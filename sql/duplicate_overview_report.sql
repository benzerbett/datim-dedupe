DROP FUNCTION IF EXISTS duplicate_overview(iso character varying(30));
DROP TYPE IF EXISTS duplicate_summary;
CREATE TYPE duplicate_summary AS (
country character varying(255),
duplication_status character varying(50),
duplicate_type character varying(30),
duplicate_count integer
);

CREATE OR REPLACE FUNCTION duplicate_overview(iso character varying(30))  RETURNS setof duplicate_summary AS 
$$
DECLARE
 returnrec duplicate_summary;
BEGIN

 CREATE TEMP TABLE temp1
 (
 country character varying(255),
 sourceid integer,
 dataelementid integer,
 categoryoptioncomboid integer,
 attributeoptioncomboid integer,
 duplicate_type character varying(30),
 lastupdated timestamp without time zone
 ) ON COMMIT DROP; 
 
  CREATE TEMP TABLE temp2 OF  duplicate_type ON COMMIT DROP;

 EXECUTE 'INSERT INTO temp1
 SELECT DISTINCT
 ou3.name as country,
 dv1.sourceid,
 dv1.dataelementid,
 dv1.categoryoptioncomboid,
 dv1.attributeoptioncomboid,
''PURE''::character varying(20) as duplicate_type,
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
 INNER JOIN organisationunit ou3 on ous.idlevel3 = ou3.organisationunitid
 WHERE dv1.dataelementid IN (
 SELECT DISTINCT dsm.dataelementid from datasetmembers dsm
 INNER JOIN (SELECT DISTINCT dataelementid from dataelement where numbertype IS NOT NULL) de
 ON dsm.dataelementid = de.dataelementid
WHERE dsm.datasetid in (SELECT datasetid from dataset 
 WHERE uid IN (''qRvKHvlzNdv'',''ovYEbELCknv'',''tCIW2VFd8uu'',
 ''i29foJcLY9Y'',''xxo1G5V1JG2'', ''STL4izfLznL'') ) ) 
 AND dv1.periodid = (SELECT DISTINCT periodid from _periodstructure
 where iso = ''' || $1 || ''' LIMIT 1)';

/*Remove any DSD-TA Crosswalks at this point.*/
DELETE FROM temp1 where attributeoptioncomboid = 
(SELECT categoryoptioncomboid from categoryoptioncombo where code = '00001DSDTA');



ALTER TABLE temp1 ADD COLUMN group_id character(32);
 UPDATE temp1 SET group_id = md5( dataelementid::text || sourceid::text  || categoryoptioncomboid::text || duplicate_type::text );
 CREATE INDEX idx_group_ids ON temp1 (group_id);

ALTER TABLE temp1 ADD COLUMN duplication_status character varying(50) DEFAULT 'UNRESOLVED';
 
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
WHERE a.dedupe_time <= b.data_time);



INSERT INTO temp2 SELECT DISTINCT country, duplication_status,duplicate_type,COUNT(*) 
GROUP BY country, duplication_status,duplicate_type from temp1;

/*DSD-TA Crosswalk*/
TRUNCATE temp1;

EXECUTE '
INSERT INTO temp1
SELECT DISTINCT
ou3.name,
ta.sourceid,
ta.dataelementid,
ta.categoryoptioncomboid,
ta.attributeoptioncomboid,
''CROSSWALK''::character varying(20) as duplicate_type
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
 WHERE dv1.attributeoptioncomboid != (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*(''00000 De-duplication adjustment''))
) dsd
on ta.sourceid = dsd.sourceid
AND ta.periodid = dsd.periodid
and ta.dataelementid = dsd.ta_dataelementid
and ta.categoryoptioncomboid = dsd.categoryoptioncomboid
INNER JOIN _orgunitstructure ous on ta.sourceid = ous.organisationunitid
INNER JOIN organisationunit ou3 on ous.idlevel3 = ou3.organisationunitid
WHERE ta.periodid = (SELECT DISTINCT periodid from _periodstructure
 where iso = ''' || $1 || ''' LIMIT 1)
AND ta.attributeoptioncomboid != (SELECT categoryoptioncomboid
  FROM _categoryoptioncomboname where categoryoptioncomboname ~*(''00000 De-duplication adjustment''))';


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


INSERT INTO temp2 SELECT DISTINCT country, duplication_status,duplicate_type,COUNT(*) 
GROUP BY country, duplication_status,duplicate_type from temp1;

FOR returnrec IN SELECT country,duplication_status,duplicate_type,count(*) FROM temp2
   GROUP BY country,duplication_status,duplicate_type 
   ORDER BY country,duplicate_type ,duplication_status
   LOOP
     RETURN NEXT returnrec;
     END LOOP;

  END;
$$ LANGUAGE plpgsql VOLATILE;