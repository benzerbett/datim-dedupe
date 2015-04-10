/*DROP FUNCTION view_duplicates(character,character varying,
boolean,integer,integer,character varying );*/

CREATE OR REPLACE FUNCTION view_duplicates(ou character (11),pe character varying(15),rs boolean default false,
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
 attributeoptioncomboid integer,
 value character varying (500000),
 duplicate_type character varying(20)
 ) ON COMMIT DROP;
 
 
 EXECUTE 'INSERT INTO temp1
 SELECT DISTINCT
 dv1.sourceid,
 dv1.periodid,
 dv1.dataelementid,
 dv1.categoryoptioncomboid,
 dv1.attributeoptioncomboid,
 trim(dv1.value) ,''PURE''::character varying(20) as duplicate_type
 from datavalue dv1
 INNER JOIN  datavalue dv2 on 
 dv1.sourceid = dv2.sourceid
 AND 
 dv1.periodid = dv2.periodid
 AND 
 dv1.dataelementid = dv2.dataelementid
 AND 
 dv1.categoryoptioncomboid = dv2.categoryoptioncomboid
 AND 
 dv1.attributeoptioncomboid  != dv2.attributeoptioncomboid 
 INNER JOIN _orgunitstructure ous on dv1.sourceid = ous.organisationunitid
 and ous.uidlevel3 = ''' ||  $1 || '''
 WHERE dv1.dataelementid IN (
 SELECT DISTINCT dsm.dataelementid from datasetmembers dsm
 INNER JOIN (SELECT DISTINCT dataelementid from dataelement where numbertype IS NOT NULL) de
 ON dsm.dataelementid = de.dataelementid
 where dsm.datasetid in (SELECT datasetid from dataset 
 where uid IN (''qRvKHvlzNdv'',''ovYEbELCknv'',''tCIW2VFd8uu'',
 ''i29foJcLY9Y'',''xxo1G5V1JG2'', ''STL4izfLznL'') ) ) 
 AND dv1.periodid = (SELECT DISTINCT periodid from _periodstructure
 where iso = ''' || $2 || ''' LIMIT 1)';
  

/*Group ID. This will be used to group duplicates. */
ALTER TABLE temp1 ADD COLUMN group_id character(32);
UPDATE temp1 SET group_id = md5( dataelementid::text || sourceid::text  || categoryoptioncomboid::text || periodid::text ) ;

/*We need to filter out sketchy values and then determine if there are any phantom groups */
DELETE FROM temp1 where value !~('^(-?0|-?[1-9][0-9]*)(\.[0-9]+)?(E[0-9]+)?$');
DELETE FROM temp1 where group_id IN (SELECT group_id from temp1   WHERE attributeoptioncomboid != (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~('00000 De-duplication adjustment'))  GROUP BY group_id HAVING COUNT(*) < 2); 
/*TODO..What do we do with dangling dedupe factors?*/
 
 /*Duplication status*/
 
 ALTER TABLE temp1 ADD COLUMN duplication_status character varying(50) DEFAULT 'UNRESOLVED';
 UPDATE temp1 set duplication_status = 'RESOLVED'
 where group_id IN (SELECT DISTINCT group_id FROM temp1
 WHERE attributeoptioncomboid = (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*('00000 De-duplication adjustment')));
 
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
UPDATE temp1 a set ou_level = b.level from _orgunitstructure b where a.sourceid = b.organisationunitid;
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
ou_level,
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
