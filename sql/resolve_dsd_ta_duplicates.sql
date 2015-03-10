
CREATE  OR REPLACE FUNCTION resolve_crosswalk() RETURNS integer AS  $$

 BEGIN
 
  CREATE TEMP TABLE temp1
 (sourceid integer,
 periodid integer,
 dataelementid integer,
 categoryoptioncomboid integer,
 attributeoptioncomboid integer,
 value character varying (500000)
 ) ON COMMIT DROP;
 
 EXECUTE 'INSERT INTO temp1 
SELECT DISTINCT ta.sourceid,
 ta.periodid,
 ta.dataelementid,
 ta.categoryoptioncomboid,
 ta.attributeoptioncomboid,
 ta.value
 from datavalue ta
 INNER JOIN
 (SELECT DISTINCT
 dv1.sourceid,
 dv1.periodid,
 dv1.dataelementid,
 map.ta_dataelementid,
 dv1.categoryoptioncomboid,
 dv1.attributeoptioncomboid
 from datavalue dv1
 INNER JOIN  (SELECT * FROM _view_crosswalk_table ) map
 on dv1.dataelementid = map.dsd_dataelementid  ) dsd
 on ta.sourceid = dsd.sourceid
 AND ta.periodid = dsd.periodid
 and ta.dataelementid = dsd.ta_dataelementid
 and ta.categoryoptioncomboid = dsd.categoryoptioncomboid
 and ta.attributeoptioncomboid != dsd.attributeoptioncomboid';

 /*Determine the groups*/
 EXECUTE 'ALTER TABLE temp1 ADD COLUMN group_id character(32);
 UPDATE temp1 SET group_id = md5( dataelementid::text || sourceid::text  || categoryoptioncomboid::text || periodid::text ) ';
 
 /*Determine whether this is an UPDATE, INSERT or DELETE operation*/
  EXECUTE 'ALTER TABLE temp1 ADD COLUMN operation character(32)';
 /*INSERT. These are all records which have no dedup mechanism value*/
 EXECUTE 'UPDATE temp1 set operation = ''INSERT''
 where group_id IN (SELECT DISTINCT group_id FROM temp1
 WHERE attributeoptioncomboid != (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*(''00000 De-duplication adjustment'')))';
 
EXECUTE 'INSERT INTO datavalue (dataelementid,periodid,sourceid,categoryoptioncomboid,
attributeoptioncomboid,value,storedby,lastupdated,comment) 
SELECT a.dataelementid,a.periodid,a.sourceid,a.categoryoptioncomboid,
(SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*(''00000 De-duplication adjustment'')) as attributeoptioncomboid,a.value,''dedupedaemon'' as storedby,now() as lastupdated,''Autogenerated'' as comment FROM (
  SELECT dataelementid,periodid,sourceid,categoryoptioncomboid,
  SUM(value::numeric) * -1 as value FROM temp1 where operation =''INSERT''
  GROUP by sourceid,periodid,dataelementid,categoryoptioncomboid
  ) a';
  
    RETURN 1;
  
   END;
$$ LANGUAGE plpgsql VOLATILE;
 
 
 
 