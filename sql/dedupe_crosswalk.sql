

CREATE OR REPLACE FUNCTION view_crosswalk_duplicates(ou character (11),pe character varying(15),rs boolean default false,
ps integer default 50,pg integer default 1,dt character varying(50) default 'ALL' ) 
RETURNS setof duplicate_records AS  $$
 DECLARE
 returnrec duplicate_records;
 dup_groups RECORD;
 this_group integer;
 start_group integer;
 end_group integer;
 BEGIN
 
 start_group := pg * ps - ps + 1;
 end_group := pg * ps;
 
 
 CREATE TEMP TABLE temp1
 (sourceid integer,
 periodid integer,
 dataelementid integer,
 categoryoptioncomboid integer,
  value numeric,
  lastupdated timestamp without time zone
) ON COMMIT DROP;
 
 


EXECUTE 'INSERT INTO temp1 
SELECT DISTINCT ta.sourceid,
 ta.periodid,
 ta.dataelementid,
 ta.categoryoptioncomboid,
 sum(ta.value::numeric) as value,
 MAX(lastupdated) as lastupdated
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
 INNER JOIN  (SELECT * FROM _view_dsd_ta_crosswalk ) map
 on dv1.dataelementid = map.dsd_dataelementid
 WHERE  dv1.attributeoptioncomboid != 
 (SELECT categoryoptioncomboid from _categoryoptioncomboname where categoryoptioncomboname ~(''^\(00001''))
 AND dv1.value ~ (''^(-?0|-?[1-9][0-9]*)(\.[0-9]+)?(E[0-9]+)?$'')
 ) dsd
 on ta.sourceid = dsd.sourceid
 AND ta.periodid = dsd.periodid
 and ta.dataelementid = dsd.ta_dataelementid
 and ta.categoryoptioncomboid = dsd.categoryoptioncomboid
 INNER JOIN _orgunitstructure ous on ta.sourceid = ous.organisationunitid
 and ous.uidlevel3 = ''' || $1 || '''
  AND ta.periodid = (SELECT DISTINCT periodid from _periodstructure
 where iso = ''' || $2 || ''')
 AND ta.attributeoptioncomboid != 
 (SELECT categoryoptioncomboid from _categoryoptioncomboname where categoryoptioncomboname ~(''^\(00001''))
and ta.value ~ (''^(-?0|-?[1-9][0-9]*)(\.[0-9]+)?(E[0-9]+)?$'')
 GROUP BY ta.sourceid,ta.periodid,ta.dataelementid,ta.categoryoptioncomboid';

ALTER TABLE temp1 ADD COLUMN attributeoptioncomboid integer;
UPDATE temp1 SET  attributeoptioncomboid = -1::integer;

 /*Get any existing DSD-TA resolutions*/
EXECUTE 'INSERT INTO temp1 
SELECT DISTINCT ta.sourceid,
 ta.periodid,
 ta.dataelementid,
 ta.categoryoptioncomboid,
ta.value::numeric  as value,
 ta.lastupdated,
(SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*(''00001 De-duplication adjustment'')) as attributeoptioncomboid
 from datavalue ta
 INNER JOIN _orgunitstructure ous on ta.sourceid = ous.organisationunitid
 and ous.uidlevel3 = ''' || $1 || '''
  AND ta.periodid = (SELECT DISTINCT periodid from _periodstructure
 where iso = ''' || $2 || ''')
 WHERE ta.attributeoptioncomboid = 
 (SELECT categoryoptioncomboid from _categoryoptioncomboname where categoryoptioncomboname ~(''^\(00001''))
and ta.value ~ (''^(-?0|-?[1-9][0-9]*)(\.[0-9]+)?(E[0-9]+)?$'')';


/*Group ID. This will be used to group duplicates. */
ALTER TABLE temp1 ADD COLUMN group_id character(32);
UPDATE temp1 SET group_id = md5( dataelementid::text || sourceid::text  || categoryoptioncomboid::text || periodid::text ) ;
CREATE INDEX idx_group_ids ON temp1 (group_id);

/*Duplication status*/
 
 ALTER TABLE temp1 ADD COLUMN duplication_status character varying(50) DEFAULT 'UNRESOLVED';
/*Only resolve non-legacy dedupes*/
 UPDATE temp1 set duplication_status = 'RESOLVED'
 where group_id IN (SELECT DISTINCT group_id FROM temp1
 WHERE attributeoptioncomboid = (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*('00001 De-duplication adjustment')))
AND group_id NOT IN (SELECT a.group_id FROM (
SELECT group_id,MAX(lastupdated) as dedupe_time from temp1 
WHERE attributeoptioncomboid = (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*('00001 De-duplication adjustment'))
GROUP BY group_id ) a
INNER JOIN (
SELECT group_id,MAX(lastupdated) as data_time from temp1 
WHERE attributeoptioncomboid != (SELECT categoryoptioncomboid
FROM _categoryoptioncomboname where categoryoptioncomboname ~*('00001 De-duplication adjustment'))
GROUP BY group_id ) b
on a.group_id = b.group_id
WHERE a.dedupe_time <= b.data_time); 
 
 IF rs = FALSE THEN 
 DELETE FROM temp1 where duplication_status ='RESOLVED';
 END IF;

 /*Data element names*/
 
 ALTER TABLE temp1 ADD COLUMN dataelement character varying(230);
 UPDATE temp1 set dataelement = b.name from dataelement b
 where temp1.dataelementid = b.dataelementid;
 
/*Targets and results*/

ALTER TABLE temp1 ADD COLUMN dataset_type character varying(50) DEFAULT 'RESULTS';
UPDATE temp1 SET dataset_type = 'TARGETS' where 
dataelement ~('TARGET');

/*Filter out results and targets*/
/*TODO Do this in the SELECT statement instead*/ 
IF dt = 'RESULTS' THEN
DELETE FROM temp1 WHERE dataset_type != 'RESULTS';
ELSEIF dt = 'TARGETS' THEN 
DELETE FROM temp1 where dataset_type != 'TARGETS';
END IF;
 
/*Data element uids*/
 ALTER TABLE temp1 ADD COLUMN de_uid character varying(11);
 UPDATE temp1 set de_uid = b.uid from dataelement b
 where temp1.dataelementid = b.dataelementid;

  /*Paging*/
 ALTER TABLE temp1 ADD COLUMN group_count integer;
 ALTER TABLE temp1 ADD COLUMN total_groups integer;
 /* Init the group count*/
 this_group := 0;
FOR dup_groups IN SELECT * FROM (SELECT DISTINCT group_id FROM temp1 ORDER BY group_id) BY LOOP
this_group := this_group + 1;
 EXECUTE 'UPDATE temp1 SET group_count = $1 where group_id = $2'
 USING this_group,dup_groups.group_id;
 END LOOP;
  /*Provide the total number of groups*/
 EXECUTE 'UPDATE temp1 set total_groups = $1' USING this_group;
  
  /*Paging. Get rid of the records now.*/
   EXECUTE 'DELETE FROM temp1 
   WHERE group_count < $1
   OR group_count > $2
   ' USING start_group, end_group;
  
  /*Disagg*/
 ALTER TABLE temp1 ADD COLUMN disaggregation character varying(250);
 ALTER TABLE temp1 ADD COLUMN coc_uid character varying(11);
 
 UPDATE temp1 set disaggregation = b.categoryoptioncomboname from _categoryoptioncomboname b
 where temp1.categoryoptioncomboid = b.categoryoptioncomboid;
 
 UPDATE temp1 set coc_uid = b.uid from categoryoptioncombo b
 where temp1.categoryoptioncomboid = b.categoryoptioncomboid;
  /*Agency*/
 ALTER TABLE temp1 ADD COLUMN agency character varying(250);
 
 UPDATE temp1 set agency = b."Funding Agency" from _categoryoptiongroupsetstructure b
 where temp1.attributeoptioncomboid = b.categoryoptioncomboid;
 
 /*Mechanism*/
 ALTER TABLE temp1 ADD COLUMN mechanism character varying(250);
 UPDATE temp1 set mechanism = b.categoryoptioncomboname from _categoryoptioncomboname b
 where temp1.attributeoptioncomboid = b.categoryoptioncomboid;
  
  /*Orgunits*/
 /*Country level*/
 ALTER TABLE temp1 ADD COLUMN oulevel3_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN oulevel4_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN oulevel5_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN oulevel6_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN ou_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN ou_level integer;
 ALTER TABLE temp1 ADD COLUMN ou_uid character varying(11);

EXECUTE 'UPDATE temp1 set oulevel3_name = (SELECT name from organisationunit where uid = ''' || $1 || ''')';

EXECUTE ' UPDATE temp1 a set oulevel4_name = b.name from (
SELECT x.name,y.organisationunitid from organisationunit x 
INNER JOIN (
SELECT organisationunitid,
idlevel4 from _orgunitstructure where uidlevel3 = ''' || $1 || ''' AND idlevel4 IS NOT NULL ) y 
ON x.organisationunitid = y.idlevel4 ) b
WHERE a.sourceid = b.organisationunitid';

EXECUTE ' UPDATE temp1 a set oulevel5_name = b.name from (
SELECT x.name,y.organisationunitid from organisationunit x 
INNER JOIN (
SELECT organisationunitid,
idlevel5 from _orgunitstructure where uidlevel3 = ''' || $1 || ''' AND idlevel5 IS NOT NULL ) y 
ON x.organisationunitid = y.idlevel5 ) b
WHERE a.sourceid = b.organisationunitid';

EXECUTE ' UPDATE temp1 a set oulevel6_name = b.name from (
SELECT x.name,y.organisationunitid from organisationunit x 
INNER JOIN (
SELECT organisationunitid,
idlevel6 from _orgunitstructure where uidlevel3 = ''' || $1 || ''' AND idlevel6 IS NOT NULL ) y 
ON x.organisationunitid = y.idlevel6 ) b
WHERE a.sourceid = b.organisationunitid';


UPDATE temp1 a set ou_name =  b.name from organisationunit b where a.sourceid = b.organisationunitid;
UPDATE temp1 a set ou_uid = b.uid from organisationunit  b where a.sourceid = b.organisationunitid;



  /*Partner*/
  
ALTER TABLE temp1 ADD COLUMN partner character varying(230);
UPDATE temp1 set partner = b.name from (
SELECT _cocg.categoryoptioncomboid,_cog.name from categoryoptiongroup _cog
INNER JOIN categoryoptiongroupsetmembers _cogsm on _cog.categoryoptiongroupid=_cogsm.categoryoptiongroupid 
INNER JOIN categoryoptiongroupmembers _cogm on _cog.categoryoptiongroupid=_cogm.categoryoptiongroupid 
INNER JOIN categoryoptioncombos_categoryoptions _cocg on _cogm.categoryoptionid=_cocg.categoryoptionid
WHERE _cogsm.categoryoptiongroupsetid= 481662 ) b
WHERE  temp1.attributeoptioncomboid = b.categoryoptioncomboid;
 

 CREATE TEMP TABLE temp2 OF duplicate_records ON COMMIT DROP ;
 
EXECUTE 'INSERT INTO temp2 SELECT 
oulevel3_name ,
oulevel4_name,
oulevel5_name,
oulevel6_name,
ou_name,
dataelement ,
disaggregation,
agency,
mechanism   ,
partner  ,
value ,
duplication_status,
ou_uid,
de_uid,
coc_uid,
group_id,
group_count,
total_groups,
dataset_type
FROM temp1
ORDER BY group_id'; 
  
   /*Return the records*/
   FOR returnrec IN SELECT * FROM temp2 ORDER BY group_id LOOP
     RETURN NEXT returnrec;
     END LOOP;
 
  END;
$$ LANGUAGE plpgsql VOLATILE;
