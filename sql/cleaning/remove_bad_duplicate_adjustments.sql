
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

 --Section for removal of 00000 dedupe adjustments which are no longer valid.
--Orphaned dupes. These are ones which were a duplicate pair at some point in time, but are no longer
  CREATE TEMP TABLE temp1 (sourceid integer, 
    periodid integer, 
    dataelementid integer, 
    categoryoptioncomboid integer, 
    lastupdated TIMESTAMP WITHOUT time ZONE, 
    dsd_timestamp TIMESTAMP WITHOUT time ZONE, 
    dsd_audit_timestamp TIMESTAMP WITHOUT time ZONE,
    ta_timestamp TIMESTAMP WITHOUT time zone, 
    ta_audit_timestamp TIMESTAMP WITHOUT time ZONE) 
  ON COMMIT DROP;

  INSERT INTO temp1
  SELECT DISTINCT sourceid,
                  periodid,
                  dataelementid,
                  categoryoptioncomboid,
                  lastupdated
  FROM datavalue WHERE attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00000'));

UPDATE temp1 a set dsd_timestamp = b.timestamp from (
SELECT dv.sourceid ,dv.periodid,dv.dataelementid,
dv.categoryoptioncomboid,max(dv.lastupdated) as timestamp from 
datavalue dv 
WHERE dv.attributeoptioncomboid NOT IN (SELECT categoryoptioncomboid
           FROM _categoryoptioncomboname
           WHERE categoryoptioncomboname ~('^\(0000[0|1]'))
GROUP BY dv.sourceid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid) b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid;


UPDATE temp1 a set dsd_audit_timestamp = b.timestamp from (
SELECT dv.organisationunitid,dv.periodid,dv.dataelementid,
dv.categoryoptioncomboid,max(dv.timestamp) as timestamp from 
datavalueaudit dv 
WHERE dv.attributeoptioncomboid NOT IN (SELECT categoryoptioncomboid
           FROM _categoryoptioncomboname
           WHERE categoryoptioncomboname ~('^\(0000[0|1]'))
GROUP BY dv.organisationunitid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid) b 
WHERE a.sourceid = b.organisationunitid
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
     FROM temp1
     WHERE lastupdated < GREATEST(dsd_timestamp,dsd_audit_timestamp)) b 

   ON a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.dataelementid = b.dataelementid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid
  WHERE a.attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00000') LIMIT 1); 

TRUNCATE temp1;

--Begin resolution of dangling DSD-TA dedupes
--DSD/TA crosswalk adjustments must be older
--than all component DSD,TA, audited DSD & TA values 
--as well as any pure deduplication adjustment. 
--If any of these are older than the crosswalk adjusmtment
--The  crosswalk adjustment is invalid.

  INSERT INTO temp1
  SELECT DISTINCT sourceid,
                  periodid,
                  dataelementid,
                  categoryoptioncomboid,
                  lastupdated
  FROM datavalue WHERE attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00001'));

  --Set the DSD current timestamp. 
  UPDATE temp1 a
  SET dsd_timestamp = b.dsd_timestamp
  FROM
    (SELECT dv.sourceid,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.lastupdated) AS dsd_timestamp
     FROM datavalue dv
     INNER JOIN
       (SELECT dsd.sourceid,
               dsd.periodid,
               map.dsd_dataelementid AS dataelementid,
               dsd.categoryoptioncomboid
        FROM temp1 dsd
        INNER JOIN
          (SELECT *
           FROM _view_dsd_ta_crosswalk) MAP ON dsd.dataelementid = MAP.ta_dataelementid ) a ON a.sourceid = dv.sourceid
     AND a.periodid = dv.periodid
     AND a.categoryoptioncomboid = dv.categoryoptioncomboid
     WHERE dv.attributeoptioncomboid NOT IN
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~*('00001'))
     GROUP BY dv.sourceid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid) b WHERE a.dataelementid = b.dataelementid
  AND a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid;

  --Set the DSD audit timestamp. Must be younger than the dupe adjustment
  UPDATE temp1 a
  SET dsd_audit_timestamp = b.dsd_audit_timestamp
  FROM
    (SELECT dv.organisationunitid ,
            dv.periodid,
            c.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.timestamp) AS dsd_audit_timestamp
     FROM datavalueaudit dv
     INNER JOIN
       (SELECT a.sourceid,
               a.periodid,
               b.dsd_dataelementid AS dsd_dataelementid,
               a.dataelementid as dataelementid,
               a.categoryoptioncomboid
        FROM temp1 a
        INNER JOIN
          (SELECT *
           FROM _view_dsd_ta_crosswalk) b ON a.dataelementid = b.ta_dataelementid) c 
     ON c.dsd_dataelementid = dv.dataelementid
     AND c.sourceid = dv.organisationunitid
     AND c.periodid = dv.periodid
     AND c.categoryoptioncomboid = dv.categoryoptioncomboid
     WHERE dv.attributeoptioncomboid NOT IN
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~*('00001'))
     GROUP BY dv.organisationunitid,
              dv.periodid,
              c.dataelementid,
              dv.categoryoptioncomboid) b WHERE 
  a.dataelementid = b.dataelementid
  AND a.sourceid = b.organisationunitid
  AND a.periodid = b.periodid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid;

  --TA audit timestamp
  UPDATE temp1 a
  SET ta_audit_timestamp = b.ta_audit_timestamp
  FROM
    (SELECT dv.sourceid,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.lastupdated) AS ta_audit_timestamp
     FROM datavalue dv
     INNER JOIN temp1 a ON a.sourceid = dv.sourceid
     AND a.periodid = dv.periodid
     AND a.categoryoptioncomboid = dv.categoryoptioncomboid
     AND a.dataelementid = dv.dataelementid
     WHERE dv.attributeoptioncomboid NOT IN
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~*('00001'))
     GROUP BY dv.sourceid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid) b WHERE a.dataelementid = b.dataelementid
  AND a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid;



  --Set the TA audit timestamp. Must be younger than the dupe adjustment
  UPDATE temp1 a
  SET ta_audit_timestamp = b.ta_audit_timestamp
  FROM
    (SELECT dv.organisationunitid AS sourceid ,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.timestamp) AS ta_audit_timestamp
     FROM datavalueaudit dv
     INNER JOIN temp1 a ON a.sourceid = dv.organisationunitid
     AND a.periodid = dv.periodid
     AND a.categoryoptioncomboid = dv.categoryoptioncomboid
     AND a.dataelementid = dv.dataelementid
     WHERE dv.attributeoptioncomboid NOT IN
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~*('00001'))
     GROUP BY dv.organisationunitid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid) b WHERE a.dataelementid = b.dataelementid
  AND a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid;



INSERT INTO datavalueaudit_dedupes_temp
SELECT nextval('datavalueaudit_dedupes_serialid'), a.dataelementid, a.periodid, a.sourceid, a.categoryoptioncomboid, a.value,
       a.storedby, a.lastupdated, a.comment, a.followup, a.attributeoptioncomboid,
       a.created FROM datavalue a INNER JOIN
    (SELECT sourceid,
            periodid,
            dataelementid,
            categoryoptioncomboid
     FROM temp1
     WHERE lastupdated < GREATEST(dsd_timestamp,dsd_audit_timestamp,ta_timestamp,ta_audit_timestamp)) b
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