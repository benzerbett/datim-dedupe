CREATE TYPE duplicate_records AS 
(oulevel2_name character varying(230)   ,
 oulevel3_name character varying(230)   ,
 oulevel4_name character varying(230)   ,
 oulevel5_name character varying(230)   ,
 orgunit_name  character varying(230)   ,
 orgunit_level integer                  ,
 startdate     date                     ,
 enddate       date                     ,
 dataelement   character varying(230)   ,
 disaggregation character varying(250)   ,
 mechanism character varying(250)   ,
 partner character varying(230)   ,
 value character varying(50000) );


CREATE  OR REPLACE FUNCTION view_discorcordant_duplicates(uid character varying(11)) returns setof duplicate_records AS 
$$
SELECT level2.name as oulevel2_name, level3.name as oulevel3_name, level4.name as oulevel4_name, level5.name as oulevel5_name, ou.name as orgunit_name, ous.level as orgunit_level, pe.startdate, pe.enddate, de.name as dataelement, cocn.categoryoptioncomboname as disaggregation, aocn.categoryoptioncomboname as mechanism, 
( SELECT _cog.name from categoryoptiongroup _cog 
INNER JOIN categoryoptiongroupsetmembers _cogsm on _cog.categoryoptiongroupid=_cogsm.categoryoptiongroupid 
INNER JOIN categoryoptiongroupmembers _cogm on _cog.categoryoptiongroupid=_cogm.categoryoptiongroupid 
INNER JOIN categoryoptioncombos_categoryoptions _cocg on _cogm.categoryoptionid=_cocg.categoryoptionid
 WHERE _cocg.categoryoptioncomboid=dv.attributeoptioncomboid and _cogsm.categoryoptiongroupsetid= 481662 limit 1) as partner,
 dv.value as value from datavalue dv 
 INNER JOIN datavalue dv2 on (dv.periodid=dv2.periodid and dv.sourceid=dv2.sourceid and dv.categoryoptioncomboid=dv2.categoryoptioncomboid and dv.attributeoptioncomboid != dv2.attributeoptioncomboid and dv.value != dv2.value
 and ( 
 (dv.dataelementid in (1486224, 496283, 1486200, 1486186) and dv2.dataelementid in (1486224, 496283, 1486200, 1486186)) or (dv.dataelementid in (1487424, 496286) and dv2.dataelementid in (1487424, 496286)) or (dv.dataelementid in (496289) and dv2.dataelementid in (496289)) or (dv.dataelementid in (496290) and dv2.dataelementid in (496290)) or (dv.dataelementid in (496297, 1487432) and dv2.dataelementid in (496297, 1487432)) or (dv.dataelementid in (1486193, 1486139, 1486120, 1486240) and dv2.dataelementid in (1486193, 1486139, 1486120, 1486240)) or (dv.dataelementid in (1486432) and dv2.dataelementid in (1486432)) or (dv.dataelementid in (496311) and dv2.dataelementid in (496311)) or (dv.dataelementid in (495223) and dv2.dataelementid in (495223)) or (dv.dataelementid in (1486154, 495270) and dv2.dataelementid in (1486154, 495270)) or (dv.dataelementid in (1486219, 1486166, 495360, 1486197) and dv2.dataelementid in (1486219, 1486166, 495360, 1486197)) or (dv.dataelementid in (495365, 1486142) and dv2.dataelementid in (495365, 1486142)) or (dv.dataelementid in (495366, 1486160) and dv2.dataelementid in (495366, 1486160)) or (dv.dataelementid in (496273, 1486170) and dv2.dataelementid in (496273, 1486170)) or (dv.dataelementid in (1486230, 486970, 1486146, 1486207) and dv2.dataelementid in (1486230, 486970, 1486146, 1486207)) or (dv.dataelementid in (480911) and dv2.dataelementid in (480911)) or (dv.dataelementid in (1487430, 480859) and dv2.dataelementid in (1487430, 480859)) or (dv.dataelementid in (480879, 1486204, 1486226, 1486143) and dv2.dataelementid in (480879, 1486204, 1486226, 1486143)) or (dv.dataelementid in (1486234, 1486214, 1486159, 496296) and dv2.dataelementid in (1486234, 1486214, 1486159, 496296)) or (dv.dataelementid in (496295) and dv2.dataelementid in (496295)) or (dv.dataelementid in (1487434, 495301) and dv2.dataelementid in (1487434, 495301))) ) 
 INNER JOIN organisationunit ou on dv.sourceid=ou.organisationunitid 
 INNER JOIN _orgunitstructure ous on dv.sourceid=ous.organisationunitid 
 LEFT JOIN organisationunit level2 on ous.idlevel4=level2.organisationunitid
 lEFT JOIN organisationunit level3 on ous.idlevel5=level3.organisationunitid 
 LEFT JOIN organisationunit level4 on ous.idlevel6=level4.organisationunitid 
 LEFT JOIN organisationunit level5 on ous.idlevel7=level5.organisationunitid 
 INNER JOIN period pe on dv.periodid=pe.periodid 
 INNER JOIN dataelement de on dv.dataelementid=de.dataelementid 
 INNER JOIN categoryoptioncombo coc on dv.categoryoptioncomboid=coc.categoryoptioncomboid 
 INNER JOIN _categoryoptioncomboname cocn on dv.categoryoptioncomboid=cocn.categoryoptioncomboid 
 INNER JOIN categoryoptioncombo aoc on dv.attributeoptioncomboid=aoc.categoryoptioncomboid
 INNER JOIN _categoryoptioncomboname aocn on dv.attributeoptioncomboid=aocn.categoryoptioncomboid 
 WHERE ous.uidlevel3=$1 and dv.categoryoptioncomboid=15 
 GROUP BY level2.name, level3.name, level4.name, level5.name, ou.name, ou.organisationunitid, ous.level, pe.periodid, pe.startdate, pe.enddate, de.name, cocn.categoryoptioncomboname, aocn.categoryoptioncomboname, dv.attributeoptioncomboid, dv.value order by level2.name, level3.name, level4.name, level5.name, ou.name, ou.organisationunitid, pe.startdate, pe.enddate, pe.periodid, de.name, cocn.categoryoptioncomboname limit 500000
 $$ LANGUAGE SQL;