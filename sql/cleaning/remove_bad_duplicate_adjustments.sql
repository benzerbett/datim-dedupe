
CREATE OR REPLACE FUNCTION resolve_bad_duplication_adjustments() RETURNS integer AS $$ 
 DECLARE
this_date date;
this_id integer;
 BEGIN 

this_date := now()::date;

SELECT COALESCE(MAX(datavalueaudit_dedupes_serialid),0) + 1 into this_id FROM datavalueaudit_dedupes ;

EXECUTE 'CREATE TEMPORARY SEQUENCE datavalueaudit_dedupes_serialid START ' || this_id;
 --Do not delete these for now, until we are sure all this mojo works

CREATE TEMP TABLE  datavalueaudit_dedupes_temp
( datavalueaudit_dedupes_tempid integer NOT NULL ,
  dataelementid integer NOT NULL,
  periodid integer NOT NULL,
  sourceid integer NOT NULL,
  categoryoptioncomboid integer NOT NULL,
  value character varying(50000),
  storedby character varying(100),
  lastupdated timestamp without time zone,
  comment character varying(50000),
  followup boolean,
  attributeoptioncomboid integer NOT NULL,
  created timestamp without time zone,
  CONSTRAINT datavalueaudit_dedupes_temp_pkey PRIMARY KEY (datavalueaudit_dedupes_tempid)
) ON COMMIT DROP;

--Create a real table, as we can leverage foreign key references then
  DROP TABLE IF EXISTS _temp_dedupe_adjustments;
  CREATE TABLE _temp_dedupe_adjustments (sourceid integer REFERENCES organisationunit ( organisationunitid ),
    periodid integer REFERENCES period( periodid ),
    dataelementid integer REFERENCES dataelement (dataelementid), 
    categoryoptioncomboid integer REFERENCES categoryoptioncombo (categoryoptioncomboid),
    lastupdated TIMESTAMP WITHOUT time ZONE, 
    dsd_timestamp TIMESTAMP WITHOUT time ZONE,
    ta_timestamp TIMESTAMP WITHOUT time zone, 
    group_count integer); 

ALTER TABLE _temp_dedupe_adjustments 
  ADD CONSTRAINT temp1_datavalue_pkey PRIMARY KEY(dataelementid, periodid, sourceid, categoryoptioncomboid);

--Materialized the view



  INSERT INTO _temp_dedupe_adjustments
  SELECT DISTINCT sourceid,
                  periodid,
                  dataelementid,
                  categoryoptioncomboid,
                  lastupdated
  FROM datavalue WHERE attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00000'));

UPDATE _temp_dedupe_adjustments a set group_count = b.group_count from (
SELECT dv.sourceid ,dv.periodid,dv.dataelementid,
dv.categoryoptioncomboid,count(*) as group_count from
datavalue dv
WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
GROUP BY dv.sourceid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid) b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid;


UPDATE _temp_dedupe_adjustments a set dsd_timestamp = b.timestamp from (
SELECT dv.sourceid ,dv.periodid,dv.dataelementid,
dv.categoryoptioncomboid,max(dv.lastupdated) as timestamp from 
datavalue dv 
WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
GROUP BY dv.sourceid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid) b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid;




INSERT INTO datavalueaudit_dedupes_temp
SELECT nextval('datavalueaudit_dedupes_serialid'), a.dataelementid, a.periodid, a.sourceid, a.categoryoptioncomboid, a.value, 
       a.storedby, a.lastupdated, a.comment, a.followup, a.attributeoptioncomboid, 
       a.created FROM datavalue a INNER JOIN
    (SELECT sourceid,
            periodid,
            dataelementid,
            categoryoptioncomboid
     FROM _temp_dedupe_adjustments
     WHERE lastupdated < dsd_timestamp
     OR dsd_timestamp IS NULL
     OR group_count IS NULL
     or group_count < 2
     ) b 

   ON a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.dataelementid = b.dataelementid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid
  WHERE a.attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00000') LIMIT 1); 

--Truncate these records
TRUNCATE _temp_dedupe_adjustments;


--Materialized the DSD/TA view
CREATE TABLE _temp_dsd_ta_crosswalk (
  dsd_dataelementid integer REFERENCES dataelement (dataelementid),
  ta_dataelementid integer REFERENCES dataelement (dataelementid)
);
ALTER TABLE _temp_dsd_ta_crosswalk
  ADD CONSTRAINT _temp_dsd_ta_crosswalk_pkey PRIMARY KEY(dsd_dataelementid,ta_dataelementid);

INSERT INTO _temp_dsd_ta_crosswalk
SELECT dsd_dataelementid,ta_dataelementid from _view_dsd_ta_crosswalk;



--Begin resolution of dangling DSD-TA dedupes
--DSD/TA crosswalk adjustments must be older
--than all component DSD,TA, audited DSD & TA values 
--as well as any pure deduplication adjustment. 
--If any of these are older than the crosswalk adjusmtment
--The  crosswalk adjustment is invalid.

  
  INSERT INTO _temp_dedupe_adjustments
  SELECT DISTINCT sourceid,
                  periodid,
                  dataelementid,
                  categoryoptioncomboid,
                  lastupdated
  FROM datavalue WHERE attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00001'));




  --Set the DSD current timestamp. If this value is NULL, then the 
  -- crosswalk is unattached to DSD and should be removed. If the age
  -- of the crosswalk is younger than the DSD value, then it should be removed.
  -- Normal dedupe adjustments are also excluded.

  WITH y as (SELECT dv.sourceid,
            dv.periodid,
            a.ta_dataelementid,
            a.dsd_dataelementid,
            dv.categoryoptioncomboid,
            max(dv.lastupdated) AS dsd_timestamp
     FROM datavalue dv
     INNER JOIN
       (SELECT dsd.sourceid,
               dsd.periodid,
               map.dsd_dataelementid AS dsd_dataelementid,
               dsd.dataelementid as ta_dataelementid,
               dsd.categoryoptioncomboid
        FROM _temp_dedupe_adjustments dsd
        INNER JOIN _temp_dsd_ta_crosswalk MAP ON dsd.dataelementid = MAP.ta_dataelementid ) a 
       ON a.sourceid = dv.sourceid
     AND a.periodid = dv.periodid
     AND a.categoryoptioncomboid = dv.categoryoptioncomboid
     and a.dsd_dataelementid = dv.dataelementid
     WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
     GROUP BY dv.sourceid,
              dv.periodid,
              a.ta_dataelementid,
              a.dsd_dataelementid,
              dv.categoryoptioncomboid)
  UPDATE _temp_dedupe_adjustments x
  SET dsd_timestamp = y.dsd_timestamp
  FROM  y WHERE x.dataelementid = y.ta_dataelementid
  AND x.sourceid = y.sourceid
  AND x.periodid = y.periodid
  AND x.categoryoptioncomboid = y.categoryoptioncomboid;


  --Set the ta_audit. If the age of the crosswalk is younger than the TA value,
  --then it should be removed.
  WITH y as (SELECT dv.sourceid,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.lastupdated) AS ta_timestamp
     FROM datavalue dv
     INNER JOIN _temp_dedupe_adjustments a on a.dataelementid = dv.dataelementid
     and a.periodid = dv.periodid
     and a.sourceid = dv.sourceid
     and a.categoryoptioncomboid = dv.categoryoptioncomboid
     WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
     GROUP BY dv.sourceid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid)
  UPDATE _temp_dedupe_adjustments x
  SET ta_timestamp = y.ta_timestamp
  FROM  y WHERE x.dataelementid = y.dataelementid
  AND x.sourceid = y.sourceid
  AND x.periodid = y.periodid
  AND x.categoryoptioncomboid = y.categoryoptioncomboid;






INSERT INTO datavalueaudit_dedupes_temp
SELECT nextval('datavalueaudit_dedupes_serialid'), a.dataelementid, a.periodid,
 a.sourceid, 
a.categoryoptioncomboid, a.value,
       a.storedby, a.lastupdated, a.comment, a.followup, a.attributeoptioncomboid,
       a.created FROM datavalue a INNER JOIN
    (SELECT sourceid,
            periodid,
            dataelementid,
            categoryoptioncomboid
     FROM _temp_dedupe_adjustments
     WHERE lastupdated < GREATEST(dsd_timestamp,ta_timestamp)
      OR  dsd_timestamp IS NULL
      OR ta_timestamp IS NULL
     ) b
   ON a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.dataelementid = b.dataelementid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid
  WHERE a.attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00001') LIMIT 1);

--INSERT into the main table
INSERT INTO datavalueaudit_dedupes  SELECT * FROM datavalueaudit_dedupes_temp;

--Update the dates in the main audit table
EXECUTE 'UPDATE datavalueaudit_dedupes SET deleted_on =  $1 WHERE deleted_on IS NULL' USING this_date; 
--Delete anything in the temporary table which is not a dedupe adjustment
DELETE FROM datavalueaudit_dedupes_temp where attributeoptioncomboid NOT IN (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~*('0000[0|1]'));

--Perform the main deletion operation from the data value table
DELETE FROM datavalue a USING datavalueaudit_dedupes_temp b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid
and a.attributeoptioncomboid = b.attributeoptioncomboid;

DROP SEQUENCE datavalueaudit_dedupes_serialid;

     RETURN(1); 
     END; 

     $$ LANGUAGE plpgsql VOLATILE;
