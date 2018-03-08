
CREATE OR REPLACE FUNCTION resolve_bad_duplication_adjustments() RETURNS integer AS $$ 
 DECLARE
this_date date;
this_id integer;
dupes_removed integer;
pure_id integer;
crosswalk_id integer;
 BEGIN

SET client_min_messages TO WARNING;

--Pure dedupe mech
pure_id:= (SELECT categoryoptioncomboid from categoryoptioncombo where uid = 'X8hrDf6bLDC');
IF pure_id IS NULL THEN
  RAISE EXCEPTION 'Pure dedupe mech not found';
END IF;

--Crosswalk dedupe mech
crosswalk_id:=(SELECT categoryoptioncomboid from categoryoptioncombo where uid = 'YGT1o7UxfFu');


this_date := now()::date;
dupes_removed := 0;
--Get the starting audit id for the new dedupes.
SELECT COALESCE(MAX(datavalueaudit_dedupes_serialid),0) + 1 into this_id FROM datavalueaudit_dedupes ;
EXECUTE 'CREATE TEMPORARY SEQUENCE datavalueaudit_dedupes_serialid START ' || this_id;

--Create two tables. 
--datavalueaudit_dedupes_temp will be for both pure as well as crosswalks. 
-- _temp_dedupe_adjustments will be a table to hold temporarily pure and crosswalks 
-- before combining  them into the datavalueaudit_dedupes_temp staging table

DROP TABLE IF EXISTS datavalueaudit_dedupes_temp;
CREATE TABLE  datavalueaudit_dedupes_temp
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
) ;

--Create a real table, as we can leverage foreign key references then
  DROP TABLE IF EXISTS _temp_dedupe_adjustments;
  CREATE TABLE _temp_dedupe_adjustments (sourceid integer REFERENCES organisationunit ( organisationunitid ),
    periodid integer REFERENCES period( periodid ),
    dataelementid integer REFERENCES dataelement (dataelementid), 
    categoryoptioncomboid integer REFERENCES categoryoptioncombo (categoryoptioncomboid),
    lastupdated TIMESTAMP WITHOUT time ZONE,
    value text,
    pure_timestamp TIMESTAMP WITHOUT time ZONE,
    cw_timestamp TIMESTAMP WITHOUT time zone,
    pure_audit_timestamp TIMESTAMP WITHOUT time ZONE,
    cw_audit_timestamp TIMESTAMP WITHOUT time ZONE,
    group_count integer); 

ALTER TABLE _temp_dedupe_adjustments 
  ADD CONSTRAINT temp1_datavalue_pkey PRIMARY KEY(dataelementid, periodid, sourceid, categoryoptioncomboid);

--Get all of the pure adjustments
  EXECUTE format('INSERT INTO _temp_dedupe_adjustments
  SELECT DISTINCT sourceid,
                  periodid,
                  dataelementid,
                  categoryoptioncomboid,
                  lastupdated,
                  value
  FROM datavalue 
  WHERE attributeoptioncomboid = %L',pure_id);

--Calculate the group count. All duplicates should have at least two members
EXECUTE format('UPDATE _temp_dedupe_adjustments a set group_count = b.group_count from (
SELECT dv.sourceid ,dv.periodid,dv.dataelementid,
dv.categoryoptioncomboid,count(*) as group_count from
datavalue dv
WHERE dv.attributeoptioncomboid NOT IN (%L,%L)
GROUP BY dv.sourceid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid) b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid',pure_id,crosswalk_id);

--All pure duplication adjustments should be older than their components
EXECUTE format('UPDATE _temp_dedupe_adjustments a set pure_timestamp = b.timestamp from (
SELECT dv.sourceid ,dv.periodid,dv.dataelementid,
dv.categoryoptioncomboid,max(dv.lastupdated) as timestamp from 
datavalue dv
WHERE dv.attributeoptioncomboid NOT IN (%L,%L)
GROUP BY dv.sourceid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid ) b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid',pure_id,crosswalk_id);

--All pure duplication adjustments should be older than any audited components as well
--This may happen in situations where a data value has been deleted for instance
EXECUTE format('UPDATE _temp_dedupe_adjustments a set pure_audit_timestamp = b.timestamp from (
SELECT dv.organisationunitid as sourceid ,dv.periodid,dv.dataelementid,
dv.categoryoptioncomboid,max(dv.created) as timestamp from 
datavalueaudit dv
WHERE dv.attributeoptioncomboid NOT IN (%L,%L)
GROUP BY dv.organisationunitid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid) b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid',pure_id,crosswalk_id);

--Insert all of the records which meet the need the needed criteria
-- Positive dedupe should be excluded

EXECUTE format('INSERT INTO datavalueaudit_dedupes_temp
SELECT nextval(''datavalueaudit_dedupes_serialid''), a.dataelementid, a.periodid, a.sourceid, a.categoryoptioncomboid, a.value, 
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
     OR group_count < 2
     OR value !~(''^(0|-\d*)(\.\d+)?$'')
     ) b 
ON a.sourceid = b.sourceid
AND a.periodid = b.periodid
AND a.dataelementid = b.dataelementid
AND a.categoryoptioncomboid = b.categoryoptioncomboid
WHERE a.attributeoptioncomboid = %L',pure_id);

--Truncate these records
TRUNCATE _temp_dedupe_adjustments;

--Begin cleaning of crosswalks

--Materialized the DSD/TA view
DROP TABLE IF EXISTS _temp_dsd_ta_crosswalk;
CREATE TABLE _temp_dsd_ta_crosswalk (
  dsd_uid character(11),
  ta_uid character(11),
  dsd_dataelementid integer ,
  ta_dataelementid integer
);


INSERT INTO _temp_dsd_ta_crosswalk
SELECT dsd_uid,ta_uid FROM( 
  SELECT (json_populate_recordset(null::crosswalks,value::JSON)).* 
  FROM keyjsonvalue where namespace='dedupe' and namespacekey='crosswalks') as foo;
UPDATE _temp_dsd_ta_crosswalk SET dsd_dataelementid = a.dataelementid from dataelement a where dsd_uid = a.uid;
UPDATE _temp_dsd_ta_crosswalk SET ta_dataelementid = a.dataelementid from dataelement a where ta_uid = a.uid;


ALTER TABLE _temp_dsd_ta_crosswalk
  ADD CONSTRAINT _temp_dsd_ta_crosswalk_pkey PRIMARY KEY(dsd_dataelementid,ta_dataelementid);


--Begin resolution of dangling DSD-TA dedupes
--DSD/TA crosswalk adjustments must be older
--than all component DSD,TA, audited DSD & TA values 
--as well as any pure deduplication adjustment. 
--If any of these are older than the crosswalk adjusmtment
--The  crosswalk adjustment is invalid.

  
  EXECUTE format('INSERT INTO _temp_dedupe_adjustments
  SELECT DISTINCT sourceid,
                  periodid,
                  dataelementid,
                  categoryoptioncomboid,
                  lastupdated,
                  value
  FROM datavalue WHERE attributeoptioncomboid = %L',crosswalk_id);


--This may be causing a deadlock due to the CTE expressions. 
--Completely orphaned adjustments. These are values with no
--DSD or TA components and should be removed.
CREATE TEMPORARY TABLE _temp_dedupe_adjustments_group_count (
sourceid integer,
periodid integer,
dataelementid integer,
categoryoptioncomboid integer,
group_count integer
)
ON COMMIT DROP;

EXECUTE format('WITH y as (
--All non-dedupe components, pure and crosswalks
WITH foo as (
--All  pure non-dedupe value. This should only be TA values
--Since the TA datavalue receives the adjustment
SELECT DISTINCT dv.sourceid,dv.periodid,dv.dataelementid,dv.categoryoptioncomboid 
FROM datavalue dv 
INNER JOIN _temp_dedupe_adjustments a
ON a.sourceid = dv.sourceid
AND a.periodid = dv.periodid
AND a.dataelementid = dv.dataelementid
AND a.categoryoptioncomboid = dv.categoryoptioncomboid
WHERE dv.attributeoptioncomboid NOT IN (%L,%L)
INTERSECT
--This needs to intersect with the DSD values, otherwise the duplicate is not coupled.
SELECT DISTINCT dv2.sourceid,dv2.periodid,c.ta_dataelementid as dataelementid, dv2.categoryoptioncomboid 
FROM datavalue dv2
INNER JOIN 
( SELECT b.sourceid,b.periodid,MAP.dsd_dataelementid,b.dataelementid as ta_dataelementid,b.categoryoptioncomboid 
from _temp_dedupe_adjustments b
INNER JOIN _temp_dsd_ta_crosswalk MAP ON b.dataelementid = MAP.ta_dataelementid ) c
ON c.sourceid = dv2.sourceid
AND c.periodid = dv2.periodid
AND c.dsd_dataelementid = dv2.dataelementid
AND c.categoryoptioncomboid = dv2.categoryoptioncomboid
WHERE dv2.attributeoptioncomboid NOT IN (%L,%L) )

--Get all of the ou,pe,de,coc maps
SELECT sourceid,periodid,dataelementid,categoryoptioncomboid,1 as group_count FROM _temp_dedupe_adjustments
EXCEPT
--Except the ones which have dedupe adjustments
SELECT sourceid,periodid,dataelementid,categoryoptioncomboid,1 as group_count from foo
)

INSERT INTO _temp_dedupe_adjustments_group_count (sourceid,periodid,dataelementid,categoryoptioncomboid,group_count)
SELECT y.sourceid,y.periodid,y.dataelementid,y.categoryoptioncomboid,y.group_count from y',pure_id,crosswalk_id,pure_id,crosswalk_id);

--Only set the group count to non-null of the duplicate is not coupled.
UPDATE _temp_dedupe_adjustments x
SET group_count = 1
FROM (
   SELECT sourceid,periodid,dataelementid,categoryoptioncomboid
   FROM   _temp_dedupe_adjustments_group_count
   ORDER BY sourceid,periodid,dataelementid,categoryoptioncomboid
   FOR    UPDATE
   ) y
 WHERE x.dataelementid = y.dataelementid
  AND x.sourceid = y.sourceid
  AND x.periodid = y.periodid
  AND x.categoryoptioncomboid = y.categoryoptioncomboid;

  --Set the DSD current timestamp. If this value is NULL, then the 
  -- crosswalk is unattached to DSD and should be removed. If the age
  -- of the crosswalk is younger than the DSD value, then it should be removed.
  -- Normal dedupe adjustments should not be exlcuded, as the CW
  -- adjustment must be older than the pure dedupe adjustment, if it exists.

CREATE TEMPORARY TABLE _temp_dedupe_adjustments_cw_timestamp (
sourceid integer,
periodid integer,
dataelementid integer,
categoryoptioncomboid integer,
cw_timestamp timestamp WITHOUT time zone
)
ON COMMIT DROP;

--Crosswalk adjustments must be older than their components, including any possible pure adjustments
EXECUTE format('INSERT INTO _temp_dedupe_adjustments_cw_timestamp

SELECT sourceid,periodid,dataelementid, categoryoptioncomboid,max(cw_timestamp) FROM (
--DSD timestamp. Normal values plus dedupe, excluding any the crosswalk adjustment
SELECT dv.sourceid,
            dv.periodid,
            a.ta_dataelementid as dataelementid,
            dv.categoryoptioncomboid,
            max(dv.lastupdated) AS cw_timestamp
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
     WHERE dv.attributeoptioncomboid NOT IN (%L)
     GROUP BY dv.sourceid,
              dv.periodid,
              a.ta_dataelementid,
              a.dsd_dataelementid,
              dv.categoryoptioncomboid
--TA timestamp. Normal values plus pure dedupe, excluding any the crosswalk adjustment
UNION
SELECT dv.sourceid,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.lastupdated) AS cw_timestamp
     FROM datavalue dv
     INNER JOIN _temp_dedupe_adjustments a on a.dataelementid = dv.dataelementid
     and a.periodid = dv.periodid
     and a.sourceid = dv.sourceid
     and a.categoryoptioncomboid = dv.categoryoptioncomboid
     WHERE dv.attributeoptioncomboid NOT IN (%L)
     GROUP BY dv.sourceid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid 
UNION
--Audited TA values. 
SELECT dv.organisationunitid as sourceid,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.created) AS cw_timestamp
FROM datavalueaudit dv
INNER JOIN _temp_dedupe_adjustments a on a.dataelementid = dv.dataelementid
and a.periodid = dv.periodid
and a.sourceid = dv.organisationunitid
and a.categoryoptioncomboid = dv.categoryoptioncomboid
WHERE dv.attributeoptioncomboid NOT IN (%L)
GROUP BY dv.organisationunitid,
dv.periodid,
dv.dataelementid,
dv.categoryoptioncomboid
UNION
--Audited DSD values
SELECT dv.organisationunitid as sourceid,
            dv.periodid,
           b.ta_dataelementid AS dataelementid,
            dv.categoryoptioncomboid,
            max(dv.created) AS cw_timestamp
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
WHERE dv.attributeoptioncomboid NOT IN (%L)
GROUP BY dv.organisationunitid,
              dv.periodid,
              b.dsd_dataelementid,
              b.ta_dataelementid,
              dv.categoryoptioncomboid ) foo
GROUP BY sourceid,periodid,dataelementid, categoryoptioncomboid',crosswalk_id,crosswalk_id,crosswalk_id,crosswalk_id);

--Set the pure_timestamp to be the maximum of the components. 
--The crosswalk adjustment must be older than this value 
  UPDATE _temp_dedupe_adjustments x
  SET cw_timestamp = upd.cw_timestamp
  FROM  
( SELECT sourceid,periodid,
  dataelementid,categoryoptioncomboid, cw_timestamp
   FROM   _temp_dedupe_adjustments_cw_timestamp
   ORDER BY sourceid,periodid,dataelementid,categoryoptioncomboid
   FOR    UPDATE ) upd
  WHERE x.dataelementid = upd.dataelementid
  AND x.sourceid = upd.sourceid
  AND x.periodid = upd.periodid
  AND x.categoryoptioncomboid = upd.categoryoptioncomboid;



EXECUTE format('INSERT INTO datavalueaudit_dedupes_temp
SELECT nextval(''datavalueaudit_dedupes_serialid''), a.dataelementid, a.periodid,
 a.sourceid, 
a.categoryoptioncomboid, a.value,
       a.storedby, a.lastupdated, a.comment, a.followup, a.attributeoptioncomboid,
       a.created FROM datavalue a INNER JOIN
    (SELECT sourceid,
            periodid,
            dataelementid,
            categoryoptioncomboid
     FROM _temp_dedupe_adjustments
     WHERE lastupdated < cw_timestamp
      OR cw_timestamp IS NULL
      OR group_count IS NOT NULL
      OR value !~(''^(0|-\d*)(\.\d+)?$'')
     ) b
   ON a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.dataelementid = b.dataelementid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid
  WHERE a.attributeoptioncomboid = %L',crosswalk_id);

--INSERT into the main table
INSERT INTO datavalueaudit_dedupes  SELECT * FROM datavalueaudit_dedupes_temp;

--Update the dates in the main audit table
EXECUTE 'UPDATE datavalueaudit_dedupes SET deleted_on =  $1 WHERE deleted_on IS NULL' USING this_date; 
--Delete anything in the temporary table which is not a dedupe adjustment
EXECUTE format('DELETE FROM datavalueaudit_dedupes_temp where attributeoptioncomboid NOT IN (%L,%L)',pure_id,crosswalk_id);

SELECT COUNT(*) INTO dupes_removed FROM datavalueaudit_dedupes_temp;


--Perform the main deletion operation from the data value table
DELETE FROM datavalue a USING 
(SELECT sourceid,periodid,dataelementid,categoryoptioncomboid,attributeoptioncomboid
FROM datavalueaudit_dedupes_temp
ORDER BY sourceid,periodid,dataelementid,categoryoptioncomboid,attributeoptioncomboid
FOR    UPDATE )b 
WHERE a.sourceid = b.sourceid
and a.periodid = b.periodid
and a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid
and a.attributeoptioncomboid = b.attributeoptioncomboid;


DROP SEQUENCE IF EXISTS datavalueaudit_dedupes_serialid;
DROP TABLE IF EXISTS datavalueaudit_dedupes_temp;
DROP TABLE IF EXISTS _datavalueaudit_dedupes_temp;
DROP TABLE IF EXISTS _temp_dedupe_adjustments;
DROP TABLE IF EXISTS _temp_dsd_ta_crosswalk;

RETURN dupes_removed; 
END; 
$$ LANGUAGE plpgsql VOLATILE;
