DROP FUNCTION  IF EXISTS view_duplicates(character,character varying,
boolean,integer,integer,character varying,character varying);

CREATE OR REPLACE FUNCTION view_duplicates(ou character (11),pe character varying(15),rs boolean default false,
ps integer default 50,pg integer default 1,dt character varying(50) default 'ALL',ty character varying(50) default 'PURE' ) 
RETURNS setof duplicate_records AS  $$
 DECLARE
 returnrec duplicate_records;
 dup_groups RECORD;
 this_group integer;
 start_group integer;
 end_group integer;
 dataset_filter character varying (100);
 BEGIN
 
 start_group := pg * ps - ps + 1;
 end_group := pg * ps;
 

CASE dt
 WHEN 'RESULTS' THEN
 dataset_filter := ' AND name ~*(''RESULTS'') ';
WHEN 'TARGETS' THEN
  dataset_filter := ' AND name ~*(''TARGETS'') ';
ELSE
  dataset_filter := ' ';
END CASE;

 CREATE TEMP TABLE temp1
 (sourceid integer,
 periodid integer,
 dataelementid integer,
 categoryoptioncomboid integer,
 attributeoptioncomboid integer,
 value character varying (500000),
 duplicate_type character varying(20),
 lastupdated timestamp without time zone,
 PRIMARY KEY (sourceid, periodid,dataelementid,categoryoptioncomboid,attributeoptioncomboid)
 ) ON COMMIT DROP;
 
IF ty = 'PURE'::character varying(50) THEN
 
 EXECUTE 'INSERT INTO temp1
 SELECT DISTINCT
 dv1.sourceid,
 dv1.periodid,
 dv1.dataelementid,
 dv1.categoryoptioncomboid,
 dv1.attributeoptioncomboid,
 trim(dv1.value) ,''PURE''::character varying(20) as duplicate_type,
 dv1.lastupdated
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
 SELECT DISTINCT dataelementid from datasetmembers WHERE datasetid IN (
 SELECT datasetid from dataset where uid in (
''qRvKHvlzNdv'',''vYEbELCknv'',''tCIW2VFd8uu'', ''ovYEbELCknv'',
 ''i29foJcLY9Y'',''xxo1G5V1JG2'', ''STL4izfLznL'')'  || dataset_filter ||
 ' ) ) AND dv1.periodid = (SELECT DISTINCT periodid from _periodstructure
 where iso = ''' || $2 || ''' LIMIT 1)';

  
/*Group ID. This will be used to group duplicates. */
ALTER TABLE temp1 ADD COLUMN group_id text;
UPDATE temp1 SET group_id = dataelementid::text ||  categoryoptioncomboid::text || sourceid::text  ;
--CREATE INDEX idx_group_ids ON temp1 (group_id);


/*We need to filter out sketchy values and then determine if there are any phantom groups */
DELETE FROM temp1 where value !~ ('^(-?0|-?[1-9][0-9]*)(\.[0-9]+)?(E[0-9]+)?$');

/*Get rid of any DSD-TA crosswalk. This should never happen*/
DELETE FROM temp1 where attributeoptioncomboid =
 (SELECT categoryoptioncomboid from _categoryoptioncomboname where categoryoptioncomboname ~('^\(00001'));
/*Delete any zeros. They should not be part of the crosswalk*/
DELETE FROM temp1 where attributeoptioncomboid !=
 (SELECT categoryoptioncomboid from _categoryoptioncomboname where categoryoptioncomboname ~('^\(00000'))
AND value = '0';

/*Get rid of any dangling dupes*/
DELETE FROM temp1 where group_id IN (SELECT group_id from temp1 GROUP BY group_id HAVING COUNT(*) = 1);
/*Get rid of any groups which remain with less than two members*/
DELETE FROM temp1 where group_id IN (SELECT group_id from temp1   WHERE attributeoptioncomboid != (SELECT categoryoptioncomboid
FROM _categoryoptioncomboname where categoryoptioncomboname ~('00000 De-duplication adjustment'))  GROUP BY group_id HAVING COUNT(*) < 2);


/*Duplication status*/
 
 ALTER TABLE temp1 ADD COLUMN duplication_status character varying(50) DEFAULT 'UNRESOLVED';
/*Only resolve non-legacy dedupes*/
 UPDATE temp1 set duplication_status = 'RESOLVED'
 where group_id IN (SELECT DISTINCT group_id FROM temp1
 WHERE attributeoptioncomboid = (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*('00000 De-duplication adjustment')))
AND group_id NOT IN (SELECT a.group_id FROM (
SELECT group_id,MAX(lastupdated) as dedupe_time from temp1 
WHERE attributeoptioncomboid = (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*('00000 De-duplication adjustment'))
GROUP BY group_id ) a
INNER JOIN (
SELECT group_id,MAX(lastupdated) as data_time from temp1 
WHERE attributeoptioncomboid != (SELECT categoryoptioncomboid
FROM _categoryoptioncomboname where categoryoptioncomboname ~*('00000 De-duplication adjustment'))
GROUP BY group_id ) b
on a.group_id = b.group_id
WHERE a.dedupe_time <= b.data_time)
AND group_id IN (SELECT DISTINCT group_id from temp1 where value ~('^[-|0]') and attributeoptioncomboid = (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~('00000 De-duplication adjustment'))); 
 
END IF;
/*End PURE Dedupe logic*/

IF ty = 'CROSSWALK'::character varying(50) THEN

EXECUTE 'INSERT INTO temp1 
 SELECT DISTINCT
 ta.sourceid,
 ta.periodid,
 ta.dataelementid,
 ta.categoryoptioncomboid,
 ta.attributeoptioncomboid,
 trim(ta.value) ,''CROSSWALK''::character varying(20) as duplicate_type,
 ta.lastupdated
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
 INNER JOIN  (SELECT * FROM _view_dsd_ta_crosswalk where dsd_dataelementid in (
SELECT DISTINCT dataelementid from datasetmembers WHERE datasetid IN (
 SELECT datasetid from dataset where uid in (
''qRvKHvlzNdv'',''vYEbELCknv'',''tCIW2VFd8uu'', ''ovYEbELCknv'',
 ''i29foJcLY9Y'',''xxo1G5V1JG2'', ''STL4izfLznL'')'  || dataset_filter ||
 '  ) ) ) map
 on dv1.dataelementid = map.dsd_dataelementid ) dsd
 on ta.sourceid = dsd.sourceid
 AND ta.periodid = dsd.periodid
 and ta.dataelementid = dsd.ta_dataelementid
 and ta.categoryoptioncomboid = dsd.categoryoptioncomboid
 INNER JOIN _orgunitstructure ous on ta.sourceid = ous.organisationunitid
 and ous.uidlevel3 = ''' || $1 || '''
  AND ta.periodid = (SELECT DISTINCT periodid from _periodstructure
 where iso = ''' || $2 || ''')';

/*Join with the DSD values*/

EXECUTE' 
INSERT INTO temp1
SELECT sourceid,periodid,dataelementid,categoryoptioncomboid,-1::integer as attributeoptioncomboid,value::text,duplicate_type,lastupdated FROM (
SELECT 
dsd.sourceid,
dsd.periodid,
ta.dataelementid,
dsd.categoryoptioncomboid,
sum(dsd.value::numeric) as value,''CROSSWALK''::character varying(20) as duplicate_type,
max(dsd.lastupdated) as lastupdated
from datavalue dsd
INNER JOIN (SELECT DISTINCT ta.sourceid,ta.periodid,ta.dataelementid,ta.categoryoptioncomboid,map.dsd_dataelementid
FROM temp1 ta
INNER JOIN _view_dsd_ta_crosswalk map
on ta.dataelementid = map.ta_dataelementid) ta
ON dsd.sourceid=ta.sourceid
and dsd.periodid = ta.periodid
and dsd.dataelementid = ta.dsd_dataelementid
and dsd.categoryoptioncomboid = ta.categoryoptioncomboid
WHERE dsd.dataelementid IN (SELECT dsd_dataelementid FROM _view_dsd_ta_crosswalk)
AND dsd.value  ~ (''^(-?0|-?[1-9][0-9]*)(\.[0-9]+)?(E[0-9]+)?$'')
AND attributeoptioncomboid != (SELECT categoryoptioncomboid
FROM _categoryoptioncomboname where categoryoptioncomboname ~*(''00001 De-duplication adjustment''))
GROUP BY dsd.sourceid,dsd.periodid,ta.dataelementid,dsd.categoryoptioncomboid) foo';


/*Group ID. This will be used to group duplicates. */
ALTER TABLE temp1 ADD COLUMN group_id text;
UPDATE temp1 SET group_id = dataelementid::text ||  categoryoptioncomboid::text || sourceid::text  ;
CREATE INDEX idx_group_ids ON temp1 (group_id);
/*Exclude any zero dupe components*/
DELETE FROM temp1 where attributeoptioncomboid NOT IN
 (SELECT categoryoptioncomboid from _categoryoptioncomboname where categoryoptioncomboname ~('^\(0000[0|1]')
  UNION SELECT -1)
AND value = '0';

/*We need to filter out sketchy values and then determine if there are any phantom groups */
DELETE FROM temp1 where value !~ ('^(-?0|-?[1-9][0-9]*)(\.[0-9]+)?(E[0-9]+)?$');

/*DELETE CASES WHICH DO NOT HAVE ANY TA VALUES while ignoring the dedupe and DSD values*/
DELETE FROM temp1 where group_id NOT IN (SELECT DISTINCT group_id from temp1
where attributeoptioncomboid NOT IN
 (SELECT categoryoptioncomboid from _categoryoptioncomboname where categoryoptioncomboname ~('^\(0000[0|1]')
  UNION SELECT -1));


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
 

END IF;
/*End CROSSWALK Dedupe logic*/


 IF rs = FALSE THEN 
 DELETE FROM temp1 where duplication_status ='RESOLVED';
 END IF;


 /*Data element names*/
 
 ALTER TABLE temp1 ADD COLUMN dataelement character varying(230);
 UPDATE temp1 set dataelement = b.name from dataelement b
 where temp1.dataelementid = b.dataelementid;
 
/*Targets and results*/

ALTER TABLE temp1 ADD COLUMN dataset_type character varying(50) DEFAULT 'TARGETS';
UPDATE temp1 SET dataset_type = 'RESULTS' where 
dataelement ~('RESULT');

/*Data element uids*/
 ALTER TABLE temp1 ADD COLUMN de_uid character varying(11);
 UPDATE temp1 set de_uid = b.uid from dataelement b
 where temp1.dataelementid = b.dataelementid;

  /*Paging*/
 ALTER TABLE temp1 ADD COLUMN group_count integer;
 ALTER TABLE temp1 ADD COLUMN total_groups integer;

UPDATE temp1 a set group_count = b.group_count FROM(
SELECT dataelementid,categoryoptioncomboid,sourceid, sum(1) OVER (ORDER BY dataelementid,categoryoptioncomboid,sourceid) as group_count
FROM temp1
GROUP BY dataelementid,categoryoptioncomboid,sourceid) b 
where a.dataelementid = b.dataelementid
and a.categoryoptioncomboid = b.categoryoptioncomboid
and a.sourceid = b.sourceid;

  /*Provide the total number of groups*/
UPDATE temp1 set total_groups =  (SELECT max(group_count) from temp1 );
  
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
 
 UPDATE temp1 set agency = 'DSD Value' where attributeoptioncomboid = -1;

 
 /*Mechanism*/
 ALTER TABLE temp1 ADD COLUMN mechanism character varying(250);
 UPDATE temp1 set mechanism = b.categoryoptioncomboname from _categoryoptioncomboname b
 where temp1.attributeoptioncomboid = b.categoryoptioncomboid;

 UPDATE temp1 set mechanism = 'DSD Value' where attributeoptioncomboid = -1;
  
  /*Orgunits*/
 /*Country level*/

 ALTER TABLE temp1 ADD COLUMN ou_name character varying(230);
 ALTER TABLE temp1 ADD COLUMN ou_uid character varying(11);


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

UPDATE temp1 set partner = 'Dedupe adjustment' where attributeoptioncomboid IN (SELECT categoryoptioncomboid from _categoryoptioncomboname
where categoryoptioncomboname ~ '^\(00000');
UPDATE temp1 set partner = 'DSD Value' where attributeoptioncomboid = -1;

 

CREATE TEMP TABLE temp2 OF duplicate_records ON COMMIT DROP ;
 
EXECUTE 'INSERT INTO temp2 SELECT 
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
group_count,
total_groups,
dataset_type
FROM temp1'; 
  
   /*Return the records*/
   FOR returnrec IN SELECT * FROM temp2 ORDER BY group_count LOOP
     RETURN NEXT returnrec;
     END LOOP;
 
  END;
$$ LANGUAGE plpgsql VOLATILE;
