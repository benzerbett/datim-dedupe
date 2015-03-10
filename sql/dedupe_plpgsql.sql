/*DROP FUNCTION view_duplicates(character,character varying,
boolean,integer,integer );*/

CREATE  OR REPLACE FUNCTION view_duplicates(ou character (11),pe character varying(15),rs boolean default false,
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
 
 CREATE  TEMP TABLE  dsd_ta_map 
 (dsd_id integer,
 ta_id integer)
 ON COMMIT DROP;
 
 EXECUTE '
 INSERT INTO dsd_ta_map
 SELECT a.dataelementid as dsd_id,b.dataelementid as ta_id
 FROM dataelement a
 INNER JOIN  (
 SELECT dataelementid,substring(name from ''^.+\(.+,'') as name FROM dataelement 
 where name ~(''TARGET'')
 AND name ~(''TA\)'') 
 and name !~(''NARRATIVE'')
 and categorycomboid = 
 (SELECT categorycomboid FROM categorycombo WHERE name = ''default'') ) b
 ON substring(a.name from ''^.+\(.+,'') = b.name
 
 where a.name ~(''TARGET'')
 AND a.name ~(''DSD'')
 and a.name !~(''NARRATIVE'')
 and a.categorycomboid = 
 
 (SELECT categorycomboid FROM categorycombo WHERE name = ''default'')';
 
 
 CREATE TEMP TABLE   temp1
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
 dv1.value ,''PURE''::character varying(20) as duplicate_type
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
 SELECT DISTINCT dataelementid from datasetmembers where datasetid in (SELECT datasetid from dataset where uid IN (''qRvKHvlzNdv'',''ovYEbELCknv'',''tCIW2VFd8uu'',
 ''i29foJcLY9Y'',''xxo1G5V1JG2'', ''STL4izfLznL'') ) ) 
 AND dv1.periodid IN (SELECT DISTINCT periodid from _periodstructure
 where financialoct = ''' || $2 || ''' )
 UNION
 SELECT DISTINCT ta.sourceid,
 ta.periodid,
 ta.dataelementid,
 ta.categoryoptioncomboid,
 ta.attributeoptioncomboid,
 ta.value,
 ''CROSSWALK''::character varying(20) as duplicate_type
 from datavalue ta
 INNER JOIN _orgunitstructure ous on ta.sourceid = ous.organisationunitid
 and ous.uidlevel3 = ''' ||  $1 || '''
 INNER JOIN 
 (SELECT DISTINCT
 dv1.sourceid,
 dv1.periodid,
 dv1.dataelementid,
 map.ta_id,
 dv1.categoryoptioncomboid,
 dv1.attributeoptioncomboid
 from datavalue dv1
 INNER JOIN dsd_ta_map map
 on dv1.dataelementid = map.dsd_id ) dsd
 on ta.sourceid = dsd.sourceid
 AND ta.periodid = dsd.periodid
 and ta.dataelementid = dsd.ta_id
 and ta.categoryoptioncomboid = dsd.categoryoptioncomboid
 and ta.attributeoptioncomboid != dsd.attributeoptioncomboid
 WHERE ta.periodid IN (SELECT DISTINCT periodid from _periodstructure
 where financialoct = ''' || $2 || ''' )
 UNION
 SELECT DISTINCT ta.sourceid,
 ta.periodid,
 ta.dataelementid,
 ta.categoryoptioncomboid,
 ta.attributeoptioncomboid,
 ta.value,
 ''CROSSWALK''::character varying(20) as duplicate_type
 from datavalue ta
 INNER JOIN _orgunitstructure ous on ta.sourceid = ous.organisationunitid
 and ous.uidlevel3 = ''' ||  $1 || '''
 INNER JOIN 
 (SELECT DISTINCT
 dv1.sourceid,
 dv1.periodid,
 dv1.dataelementid,
 map.dsd_id,
 dv1.categoryoptioncomboid,
 dv1.attributeoptioncomboid
 from datavalue dv1
 INNER JOIN dsd_ta_map map
 on dv1.dataelementid = map.ta_id ) dsd
 on ta.sourceid = dsd.sourceid
 AND ta.periodid = dsd.periodid
 and ta.dataelementid = dsd.dsd_id
 and ta.categoryoptioncomboid = dsd.categoryoptioncomboid
 and ta.attributeoptioncomboid != dsd.attributeoptioncomboid
 WHERE ta.periodid IN (SELECT DISTINCT periodid from _periodstructure
 where financialoct = ''' || $2 || ''' )';
  
/*Group ID. This will be used to group duplicates. Important for the DSD TA overlap*/
  
EXECUTE 'ALTER TABLE temp1 ADD COLUMN group_id character(32);
 UPDATE temp1 SET group_id = md5( dataelementid::text || sourceid::text  || categoryoptioncomboid::text || periodid::text ) ';
 
  /*Paging*/
 EXECUTE 'ALTER TABLE temp1 ADD COLUMN group_count integer;
 ALTER TABLE temp1 ADD COLUMN total_groups integer';
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
  
 /*Data element names*/
 
 EXECUTE 'ALTER TABLE temp1 ADD COLUMN dataelement character varying(230);
 ALTER TABLE temp1 ADD COLUMN de_uid character varying(11);
 
 UPDATE temp1 set dataelement = b.name from dataelement b
 where temp1.dataelementid = b.dataelementid;
 
 UPDATE temp1 set de_uid = b.uid from dataelement b
 where temp1.dataelementid = b.dataelementid';
  
  
  /*Disagg*/
 EXECUTE 'ALTER TABLE temp1 ADD COLUMN disaggregation character varying(250);
 ALTER TABLE temp1 ADD COLUMN coc_uid character varying(11);
 
 UPDATE temp1 set disaggregation = b.categoryoptioncomboname from _categoryoptioncomboname b
 where temp1.categoryoptioncomboid = b.categoryoptioncomboid;
 
 UPDATE temp1 set coc_uid = b.uid from categoryoptioncombo b
 where temp1.categoryoptioncomboid = b.categoryoptioncomboid';
  /*Agency*/
 EXECUTE 'ALTER TABLE temp1 ADD COLUMN agency character varying(250);
 
 UPDATE temp1 set agency = b."Funding Agency" from _categoryoptiongroupsetstructure b
 where temp1.attributeoptioncomboid = b.categoryoptioncomboid';
 
 /*Mechanism*/
 EXECUTE 'ALTER TABLE temp1 ADD COLUMN mechanism character varying(250);
 UPDATE temp1 set mechanism = b.categoryoptioncomboname from _categoryoptioncomboname b
 where temp1.attributeoptioncomboid = b.categoryoptioncomboid';
  
  /*Orgunits*/
 EXECUTE '
 ALTER TABLE temp1 ADD COLUMN oulevel2_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN oulevel3_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN oulevel4_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN oulevel5_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN orgunit_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN orgunit_level integer;
 ALTER TABLE temp1 ADD COLUMN ou_uid character varying(11);
 
 UPDATE temp1 SET orgunit_name = b.orgunit_name,
 ou_uid = b.ou_uid,
 orgunit_level = b.orgunit_level,
 oulevel2_name = b.oulevel2_name,
 oulevel3_name = b.oulevel3_name,
 oulevel4_name = b.oulevel4_name,
 oulevel5_name = b.oulevel5_name FROM (
 
 SELECT temp1.sourceid,ou.name as orgunit_name, ou.uid as ou_uid,
 ous.level as orgunit_level,
 oulevel2.name as oulevel2_name,
 oulevel3.name as oulevel3_name,
 oulevel4.name as oulevel4_name,
 oulevel5.name as oulevel5_name from _orgunitstructure ous
 INNER JOIN temp1 on temp1.sourceid = ous.organisationunitid
 INNER JOIN organisationunit ou on temp1.sourceid = ou.organisationunitid
 LEFT JOIN organisationunit oulevel2 on ous.idlevel4 = oulevel2.organisationunitid
 LEFT JOIN organisationunit oulevel3 on ous.idlevel5 = oulevel3.organisationunitid
 LEFT JOIN  organisationunit oulevel4 on ous.idlevel6 = oulevel4.organisationunitid
 LEFT JOIN  organisationunit oulevel5 on ous.idlevel7 = oulevel5.organisationunitid ) b
 
 where temp1.sourceid = b.sourceid';
  
  /*Periods*/
 EXECUTE 'ALTER TABLE temp1 ADD COLUMN iso_period character varying(15);
 UPDATE temp1 SET iso_period = p.iso from _periodstructure p where p.periodid = temp1.periodid';
 
  /*Partner*/
  
  EXECUTE 'ALTER TABLE temp1 ADD COLUMN partner character varying(230);
  UPDATE temp1 set partner = b.name from (
  SELECT _cocg.categoryoptioncomboid,_cog.name from categoryoptiongroup _cog
 INNER JOIN categoryoptiongroupsetmembers _cogsm on _cog.categoryoptiongroupid=_cogsm.categoryoptiongroupid 
 INNER JOIN categoryoptiongroupmembers _cogm on _cog.categoryoptiongroupid=_cogm.categoryoptiongroupid 
 INNER JOIN categoryoptioncombos_categoryoptions _cocg on _cogm.categoryoptionid=_cocg.categoryoptionid
  WHERE _cogsm.categoryoptiongroupsetid= 481662 ) b
  where temp1.attributeoptioncomboid = b.categoryoptioncomboid';
 

 
 /*Duplication status*/
 
 EXECUTE 'ALTER TABLE temp1 ADD COLUMN duplication_status character varying(50) DEFAULT ''UNRESOLVED'';
 
 UPDATE temp1 set duplication_status = ''RESOLVED''
 where group_id IN (SELECT DISTINCT group_id FROM temp1
 WHERE attributeoptioncomboid = (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*(''00000 De-duplication adjustment'')))';
 
 IF rs = FALSE THEN 
 EXECUTE 'DELETE FROM temp1 where duplication_status =''RESOLVED''';
 END IF;
 
  /*Targets and results*/
  EXECUTE 'ALTER TABLE temp1 ADD COLUMN dataset_type character varying(50) DEFAULT ''RESULTS'';
  UPDATE temp1 SET dataset_type = ''TARGETS'' where 
  dataelement ~(''TARGET'')';
 
 IF dt = 'RESULTS' THEN
 EXECUTE 'DELETE FROM temp1 where dataset_type != ''RESULTS''';
 ELSEIF dt = 'TARGETS' THEN 
 EXECUTE 'DELETE FROM temp1 where dataset_type != ''TARGETS''';
 END IF;
 
 

 
 CREATE TEMP TABLE temp2 OF duplicate_records ON COMMIT DROP ;
 
  EXECUTE 'INSERT INTO temp2 SELECT 
  oulevel2_name ,
  oulevel3_name,
  oulevel4_name,
  oulevel5_name,
  orgunit_name,
  orgunit_level,
  iso_period,
  dataelement ,
  disaggregation,
  agency,
  mechanism   ,
  partner  ,
  value ,
 duplicate_type,
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
