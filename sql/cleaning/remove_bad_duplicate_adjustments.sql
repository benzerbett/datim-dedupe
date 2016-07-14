
CREATE OR REPLACE FUNCTION resolve_bad_duplication_adjustments() RETURNS integer AS $$ 
 DECLARE
this_date date;
this_id integer;
dupes_removed integer;
 BEGIN                                                             

this_date := now()::date;
dupes_removed := 0;

SELECT COALESCE(MAX(datavalueaudit_dedupes_serialid),0) + 1 into this_id FROM datavalueaudit_dedupes ;

EXECUTE 'CREATE TEMPORARY SEQUENCE datavalueaudit_dedupes_serialid START ' || this_id;
 --Do not delete these for now, until we are sure all this mojo works

DROP TABLE IF EXISTS datavalueaudit_dedupes_temp;


--Create a real table, as we can leverage foreign key references then
  DROP TABLE IF EXISTS _temp_dedupe_adjustments;
  CREATE TABLE _temp_dedupe_adjustments (sourceid integer REFERENCES organisationunit ( organisationunitid ),
    periodid integer REFERENCES period( periodid ),
    dataelementid integer REFERENCES dataelement (dataelementid), 
    categoryoptioncomboid integer REFERENCES categoryoptioncombo (categoryoptioncomboid),
    lastupdated TIMESTAMP WITHOUT time ZONE, 
    pure_timestamp TIMESTAMP WITHOUT time ZONE,
    cw_timestamp TIMESTAMP WITHOUT time zone,
    pure_audit_timestamp TIMESTAMP WITHOUT time ZONE,
    cw_audit_timestamp TIMESTAMP WITHOUT time ZONE,
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
  FROM datavalue WHERE attributeoptioncomboid = 2210817;

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


UPDATE _temp_dedupe_adjustments a set pure_timestamp = b.timestamp from (
SELECT dv.sourceid ,dv.periodid,dv.dataelementid,
dv.categoryoptioncomboid,max(dv.lastupdated) as timestamp from 
datavalue dv
WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
GROUP BY dv.sourceid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid) b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid;

UPDATE _temp_dedupe_adjustments a set pure_audit_timestamp = b.timestamp from (
SELECT dv.organisationunitid as sourceid ,dv.periodid,dv.dataelementid,
dv.categoryoptioncomboid,max(dv.timestamp) as timestamp from 
datavalueaudit dv
WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
GROUP BY dv.organisationunitid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid) b 
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
     WHERE lastupdated < pure_timestamp
     OR lastupdated < pure_audit_timestamp
     OR pure_timestamp IS NULL
     OR group_count IS NULL
     or group_count < 2
     ) b 

   ON a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.dataelementid = b.dataelementid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid
  WHERE a.attributeoptioncomboid = 2210817;

--Truncate these records
TRUNCATE _temp_dedupe_adjustments;

--Begin cleaning of crosswalks

--Materialized the DSD/TA view
DROP TABLE IF EXISTS _temp_dsd_ta_crosswalk;
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
  FROM datavalue WHERE attributeoptioncomboid = 3993514;


  --Completely orphaned adjustments. These are values with no
--DSD or TA components and should be removed.
WITH y as (
WITH foo as (SELECT DISTINCT dv.sourceid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid 
  FROM datavalue dv INNER JOIN 
 _temp_dedupe_adjustments a
 ON a.sourceid = dv.sourceid
AND a.periodid = dv.periodid
AND a.dataelementid = dv.dataelementid
AND a.categoryoptioncomboid = dv.categoryoptioncomboid
WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
UNION
SELECT DISTINCT dv.sourceid,dv.periodid,MAP.ta_dataelementid,dv.categoryoptioncomboid FROM datavalue dv
INNER JOIN
 _temp_dedupe_adjustments a
 ON a.sourceid = dv.sourceid
AND a.periodid = dv.periodid
AND a.dataelementid = dv.dataelementid
AND a.categoryoptioncomboid = dv.categoryoptioncomboid
INNER JOIN _temp_dsd_ta_crosswalk MAP ON dv.dataelementid = MAP.ta_dataelementid
WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514))
SELECT sourceid,periodid,dataelementid,categoryoptioncomboid,1 as group_count FROM _temp_dedupe_adjustments
EXCEPT
SELECT sourceid,periodid,dataelementid,categoryoptioncomboid,1 as group_count from foo)
  UPDATE _temp_dedupe_adjustments x
  SET group_count = 1
  FROM  y WHERE x.dataelementid = y.dataelementid
  AND x.sourceid = y.sourceid
  AND x.periodid = y.periodid
  AND x.categoryoptioncomboid = y.categoryoptioncomboid;

  --Set the DSD current timestamp. If this value is NULL, then the 
  -- crosswalk is unattached to DSD and should be removed. If the age
  -- of the crosswalk is younger than the DSD value, then it should be removed.
  -- Normal dedupe adjustments should not be exlcuded, as the CW
  -- adjustment must be older than the pure dedupe adjustment, if it exists.

  WITH y as (SELECT dv.sourceid,
            dv.periodid,
            a.ta_dataelementid,
            a.dsd_dataelementid,
            dv.categoryoptioncomboid,
            max(dv.lastupdated) AS pure_timestamp
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
     WHERE dv.attributeoptioncomboid NOT IN (3993514)
     GROUP BY dv.sourceid,
              dv.periodid,
              a.ta_dataelementid,
              a.dsd_dataelementid,
              dv.categoryoptioncomboid)
  UPDATE _temp_dedupe_adjustments x
  SET pure_timestamp = y.pure_timestamp
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
            max(dv.lastupdated) AS cw_timestamp
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
  SET cw_timestamp = y.cw_timestamp
  FROM  y WHERE x.dataelementid = y.dataelementid
  AND x.sourceid = y.sourceid
  AND x.periodid = y.periodid
  AND x.categoryoptioncomboid = y.categoryoptioncomboid;

  --Data value audits. All CW dedupe adjustments should be older than 
  --all data values, and older than any audits. 
  --First, the TA values. All audited TA values should be older than the 
  --CW adjustment. Send to cw_audit_timestamp
    
  WITH y as (SELECT dv.organisationunitid as sourceid,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.timestamp) AS cw_audit_timestamp
     FROM datavalueaudit dv
     INNER JOIN _temp_dedupe_adjustments a on a.dataelementid = dv.dataelementid
     and a.periodid = dv.periodid
     and a.sourceid = dv.organisationunitid
     and a.categoryoptioncomboid = dv.categoryoptioncomboid
     WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
     GROUP BY dv.organisationunitid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid)
  UPDATE _temp_dedupe_adjustments x
  SET cw_audit_timestamp = y.cw_audit_timestamp
  FROM  y WHERE x.dataelementid = y.dataelementid
  AND x.sourceid = y.sourceid
  AND x.periodid = y.periodid
  AND x.categoryoptioncomboid = y.categoryoptioncomboid;
  
  --TODO. Audited DSD values. All audited component DSD values must
  --also be older than the crosswalk adjustment, if present. 
  
    WITH y as ( SELECT dv.organisationunitid as sourceid,
            dv.periodid,
           b.dsd_dataelementid,
           b.ta_dataelementid,
            dv.categoryoptioncomboid,
            max(dv.timestamp) AS cw_audit_timestamp
    FROM datavalueaudit dv
    INNER JOIN (
    SELECT a.sourceid,a.periodid,MAP.dsd_dataelementid, MAP.ta_dataelementid,
    a.categoryoptioncomboid
    from  _temp_dedupe_adjustments a
    INNER JOIN _temp_dsd_ta_crosswalk MAP ON a.dataelementid = MAP.ta_dataelementid ) b
    ON b.dsd_dataelementid = dv.dataelementid
    and b.periodid = dv.periodid
    and b.sourceid = dv.organisationunitid
    and b.categoryoptioncomboid = dv.categoryoptioncomboid
    WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
    GROUP BY dv.organisationunitid,
              dv.periodid,
              b.dsd_dataelementid,
              b.ta_dataelementid,
              dv.categoryoptioncomboid )
  UPDATE _temp_dedupe_adjustments x
  SET cw_audit_timestamp = y.cw_audit_timestamp
  FROM  y WHERE x.dataelementid = y.ta_dataelementid
  AND x.sourceid = y.sourceid
  AND x.periodid = y.periodid
  AND x.categoryoptioncomboid = y.categoryoptioncomboid;
  
--Audited TA VALUES
  
      WITH y as (SELECT dv.organisationunitid as sourceid,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.timestamp) AS pure_audit_timestamp
     FROM datavalueaudit dv
     INNER JOIN _temp_dedupe_adjustments a on a.dataelementid = dv.dataelementid
     and a.periodid = dv.periodid
     and a.sourceid = dv.organisationunitid
     and a.categoryoptioncomboid = dv.categoryoptioncomboid
     WHERE dv.attributeoptioncomboid NOT IN (2210817,3993514)
     GROUP BY dv.organisationunitid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid)
  UPDATE _temp_dedupe_adjustments x
  SET pure_audit_timestamp = y.pure_audit_timestamp
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
     WHERE lastupdated < GREATEST(pure_timestamp,cw_timestamp,pure_audit_timestamp,cw_audit_timestamp)
      OR  pure_timestamp IS NULL
      OR cw_timestamp IS NULL
      OR group_count IS NOT NULL
     ) b
   ON a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.dataelementid = b.dataelementid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid
  WHERE a.attributeoptioncomboid = 3993514;

--INSERT into the main table
INSERT INTO datavalueaudit_dedupes  SELECT * FROM datavalueaudit_dedupes_temp;

--Update the dates in the main audit table
EXECUTE 'UPDATE datavalueaudit_dedupes SET deleted_on =  $1 WHERE deleted_on IS NULL' USING this_date; 
--Delete anything in the temporary table which is not a dedupe adjustment
DELETE FROM datavalueaudit_dedupes_temp where attributeoptioncomboid NOT IN (2210817,3993514);

SELECT COUNT(*) INTO dupes_removed FROM datavalueaudit_dedupes_temp;
--Perform the main deletion operation from the data value table
DELETE FROM datavalue a USING datavalueaudit_dedupes_temp b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid
and a.attributeoptioncomboid = b.attributeoptioncomboid;

DROP SEQUENCE IF EXISTS datavalueaudit_dedupes_serialid;
DROP TABLE IF EXISTS datavalueaudit_dedupes_temp;
DROP TABLE IF EXISTS _datavalueaudit_dedupes_temp;

     RETURN dupes_removed; 
     END; 

     $$ LANGUAGE plpgsql VOLATILE;
