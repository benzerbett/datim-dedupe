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
 value character varying(50000),
duplicate_type character varying(230) );


CREATE  OR REPLACE FUNCTION view_duplicates(uid character varying(11)) returns setof duplicate_records AS 
$$
SELECT level2.name as oulevel2_name, 
level3.name as oulevel3_name, 
level4.name as oulevel4_name,
 level5.name as oulevel5_name, 
 ou.name as orgunit_name, 
 ous.level as orgunit_level,
 pe.startdate, pe.enddate,
 de.name as dataelement,
 cocn.categoryoptioncomboname as disaggregation, 
 aocn.categoryoptioncomboname as mechanism, 
( SELECT _cog.name from categoryoptiongroup _cog 
INNER JOIN categoryoptiongroupsetmembers _cogsm on _cog.categoryoptiongroupid=_cogsm.categoryoptiongroupid 
INNER JOIN categoryoptiongroupmembers _cogm on _cog.categoryoptiongroupid=_cogm.categoryoptiongroupid 
INNER JOIN categoryoptioncombos_categoryoptions _cocg on _cogm.categoryoptionid=_cocg.categoryoptionid
 WHERE _cocg.categoryoptioncomboid=dv.attributeoptioncomboid and _cogsm.categoryoptiongroupsetid= 481662 limit 1) as partner,
 dv.value as value,
 'DISCORDANT' as duplicate_type
 from datavalue dv 
 INNER JOIN datavalue dv2 on (dv.periodid=dv2.periodid and dv.sourceid=dv2.sourceid and dv.categoryoptioncomboid=dv2.categoryoptioncomboid and dv.attributeoptioncomboid != dv2.attributeoptioncomboid and dv.value != dv2.value
 and ( 
 /*TX_CURR (N, NGI): Receiving ART
 *TX_CURR (N, DSD): Receiving ART
 *TX_CURR (N, NA): Receiving ART
 *TX_CURR (N, TA): Receiving ART
*/
 (dv.dataelementid in (1486224, 496283, 1486200, 1486186) and dv2.dataelementid in (1486224, 496283, 1486200, 1486186)) 
 /*TX_NEW (N, DSD): New on ART
 TX_NEW (N, TA): New on ART*/
 or (dv.dataelementid in (1487424, 496286) and dv2.dataelementid in (1487424, 496286))
 /*TX_RET (N, DSD): Alive at 12 mo. after initiating ART*/
 or (dv.dataelementid in (496289) and dv2.dataelementid in (496289))
 /* TX_RET (D, DSD): Total Initiated ART in 12 mo.*/
 or (dv.dataelementid in (496290) and dv2.dataelementid in (496290)) 
 /* BS_COLL (N, DSD): Blood Units Donated
  BS_COLL (N, TA): Blood Units Donated*/
 or (dv.dataelementid in (496297, 1487432) and dv2.dataelementid in (496297, 1487432)) 
 /* C2.1.D (N, TA): PLHIV Min One Service
 C2.1.D (N, NA): PLHIV Min One Service
 C2.1.D (N, NGI): PLHIV Min One Service
 C2.1.D (N, DSD): PLHIV Min One Service */
 or (dv.dataelementid in (1486193, 1486139, 1486120, 1486240) and dv2.dataelementid in (1486193, 1486139, 1486120, 1486240)) 
 /*C2.4.D (N, DSD): PLHIV Screened for TB*/
 or (dv.dataelementid in (1486432) and dv2.dataelementid in (1486432)) 
 /*FN_THER (N, DSD): Undernourished PLHIV fed*/
 or (dv.dataelementid in (496311) and dv2.dataelementid in (496311))
 /*GEND_GBV (N, DSD): GBV Care*/
 or (dv.dataelementid in (495223) and dv2.dataelementid in (495223))
 /*PP_PREV (N, TA): HIV Prevention Program
 PP_PREV (N, DSD): HIV Prevention Program*/
 or (dv.dataelementid in (1486154, 495270) and dv2.dataelementid in (1486154, 495270))
 /*HTC_TST (N, DSD): HTC received results
 HTC_TST (N, NA): HTC received results
 HTC_TST (N, TA): HTC received results
 HTC_TST (N, NGI): HTC received results*/
 or (dv.dataelementid in (1486219, 1486166, 495360, 1486197) and dv2.dataelementid in (1486219, 1486166, 495360, 1486197))
 /* KP_PREV (N, DSD): Key Pop Preventive
 KP_PREV (N, TA): Key Pop Preventive*/
 or (dv.dataelementid in (495365, 1486142) and dv2.dataelementid in (495365, 1486142))
 /*LAB_ACC (N, TA): Labs Accredited
 LAB_ACC (N, DSD): Labs Accredited*/
 or (dv.dataelementid in (495366, 1486160) and dv2.dataelementid in (495366, 1486160))
 /* OVC_SERV (N, DSD): Beneficiaries Served
 OVC_SERV (N, TA): Beneficiaries Served*/
 or (dv.dataelementid in (496273, 1486170) and dv2.dataelementid in (496273, 1486170))
 /*PMTCT_ARV (N, DSD): ARVs
 PMTCT_ARV (N, NA): ARVs
 PMTCT_ARV (N, NGI): ARVs
 PMTCT_ARV (N, TA): ARVs*/
 or (dv.dataelementid in (1486230, 486970, 1486146, 1486207) and dv2.dataelementid in (1486230, 486970, 1486146, 1486207))
 /*PMTCT_CTX (N, DSD): Infants CTX*/
 or (dv.dataelementid in (480911) and dv2.dataelementid in (480911)) 
 /* PMTCT_EID (N, TA): Infant Testing
 PMTCT_EID (N, DSD): Infant Testing*/
 or (dv.dataelementid in (1487430, 480859) and dv2.dataelementid in (1487430, 480859))
/*  PMTCT_STAT (N, DSD): Known Results
 PMTCT_STAT (N, NA): Known Results
 PMTCT_STAT (N, NGI): Known Results
 PMTCT_STAT (N, TA): Known Results*/
 or (dv.dataelementid in (480879, 1486204, 1486226, 1486143) and dv2.dataelementid in (480879, 1486204, 1486226, 1486143))
 /* VMMC_CIRC (N, DSD): Voluntary Circumcised
 VMMC_CIRC (N, NA): Voluntary Circumcised
 VMMC_CIRC (N, TA): Voluntary Circumcised
 VMMC_CIRC (N, NGI): Voluntary Circumcised*/
 or (dv.dataelementid in (1486234, 1486214, 1486159, 496296) and dv2.dataelementid in (1486234, 1486214, 1486159, 496296))
 /*VMMC_AE (N, DSD): Adverse Event*/
 or (dv.dataelementid in (496295) and dv2.dataelementid in (496295))
 /*HRH_PRE (N, TA): Graduates by Cadre
 HRH_PRE (N, DSD): Graduates by Cadre*/
 or (dv.dataelementid in (1487434, 495301) and dv2.dataelementid in (1487434, 495301))) ) 
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
 GROUP BY level2.name, level3.name, level4.name, level5.name, ou.name, ou.organisationunitid, ous.level, pe.periodid, pe.startdate, pe.enddate, de.name, cocn.categoryoptioncomboname, aocn.categoryoptioncomboname, dv.attributeoptioncomboid, dv.value,duplicate_type
 UNION
 SELECT level2.name as oulevel2_name, 
level3.name as oulevel3_name, 
level4.name as oulevel4_name,
 level5.name as oulevel5_name, 
 ou.name as orgunit_name, 
 ous.level as orgunit_level,
 pe.startdate, pe.enddate,
 de.name as dataelement,
 cocn.categoryoptioncomboname as disaggregation, 
 aocn.categoryoptioncomboname as mechanism, 
( SELECT _cog.name from categoryoptiongroup _cog 
INNER JOIN categoryoptiongroupsetmembers _cogsm on _cog.categoryoptiongroupid=_cogsm.categoryoptiongroupid 
INNER JOIN categoryoptiongroupmembers _cogm on _cog.categoryoptiongroupid=_cogm.categoryoptiongroupid 
INNER JOIN categoryoptioncombos_categoryoptions _cocg on _cogm.categoryoptionid=_cocg.categoryoptionid
 WHERE _cocg.categoryoptioncomboid=dv.attributeoptioncomboid and _cogsm.categoryoptiongroupsetid= 481662 limit 1) as partner,
 dv.value as value,
 'CONCORDANT' as duplicate_type
 from datavalue dv 
 INNER JOIN datavalue dv2 on (dv.periodid=dv2.periodid and dv.sourceid=dv2.sourceid and dv.categoryoptioncomboid=dv2.categoryoptioncomboid and dv.attributeoptioncomboid != dv2.attributeoptioncomboid and dv.value = dv2.value
 and ( 
 /*TX_CURR (N, NGI): Receiving ART
 *TX_CURR (N, DSD): Receiving ART
 *TX_CURR (N, NA): Receiving ART
 *TX_CURR (N, TA): Receiving ART
*/
 (dv.dataelementid in (1486224, 496283, 1486200, 1486186) and dv2.dataelementid in (1486224, 496283, 1486200, 1486186)) 
 /*TX_NEW (N, DSD): New on ART
 TX_NEW (N, TA): New on ART*/
 or (dv.dataelementid in (1487424, 496286) and dv2.dataelementid in (1487424, 496286))
 /*TX_RET (N, DSD): Alive at 12 mo. after initiating ART*/
 or (dv.dataelementid in (496289) and dv2.dataelementid in (496289))
 /* TX_RET (D, DSD): Total Initiated ART in 12 mo.*/
 or (dv.dataelementid in (496290) and dv2.dataelementid in (496290)) 
 /* BS_COLL (N, DSD): Blood Units Donated
  BS_COLL (N, TA): Blood Units Donated*/
 or (dv.dataelementid in (496297, 1487432) and dv2.dataelementid in (496297, 1487432)) 
 /* C2.1.D (N, TA): PLHIV Min One Service
 C2.1.D (N, NA): PLHIV Min One Service
 C2.1.D (N, NGI): PLHIV Min One Service
 C2.1.D (N, DSD): PLHIV Min One Service */
 or (dv.dataelementid in (1486193, 1486139, 1486120, 1486240) and dv2.dataelementid in (1486193, 1486139, 1486120, 1486240)) 
 /*C2.4.D (N, DSD): PLHIV Screened for TB*/
 or (dv.dataelementid in (1486432) and dv2.dataelementid in (1486432)) 
 /*FN_THER (N, DSD): Undernourished PLHIV fed*/
 or (dv.dataelementid in (496311) and dv2.dataelementid in (496311))
 /*GEND_GBV (N, DSD): GBV Care*/
 or (dv.dataelementid in (495223) and dv2.dataelementid in (495223))
 /*PP_PREV (N, TA): HIV Prevention Program
 PP_PREV (N, DSD): HIV Prevention Program*/
 or (dv.dataelementid in (1486154, 495270) and dv2.dataelementid in (1486154, 495270))
 /*HTC_TST (N, DSD): HTC received results
 HTC_TST (N, NA): HTC received results
 HTC_TST (N, TA): HTC received results
 HTC_TST (N, NGI): HTC received results*/
 or (dv.dataelementid in (1486219, 1486166, 495360, 1486197) and dv2.dataelementid in (1486219, 1486166, 495360, 1486197))
 /* KP_PREV (N, DSD): Key Pop Preventive
 KP_PREV (N, TA): Key Pop Preventive*/
 or (dv.dataelementid in (495365, 1486142) and dv2.dataelementid in (495365, 1486142))
 /*LAB_ACC (N, TA): Labs Accredited
 LAB_ACC (N, DSD): Labs Accredited*/
 or (dv.dataelementid in (495366, 1486160) and dv2.dataelementid in (495366, 1486160))
 /* OVC_SERV (N, DSD): Beneficiaries Served
 OVC_SERV (N, TA): Beneficiaries Served*/
 or (dv.dataelementid in (496273, 1486170) and dv2.dataelementid in (496273, 1486170))
 /*PMTCT_ARV (N, DSD): ARVs
 PMTCT_ARV (N, NA): ARVs
 PMTCT_ARV (N, NGI): ARVs
 PMTCT_ARV (N, TA): ARVs*/
 or (dv.dataelementid in (1486230, 486970, 1486146, 1486207) and dv2.dataelementid in (1486230, 486970, 1486146, 1486207))
 /*PMTCT_CTX (N, DSD): Infants CTX*/
 or (dv.dataelementid in (480911) and dv2.dataelementid in (480911)) 
 /* PMTCT_EID (N, TA): Infant Testing
 PMTCT_EID (N, DSD): Infant Testing*/
 or (dv.dataelementid in (1487430, 480859) and dv2.dataelementid in (1487430, 480859))
/*  PMTCT_STAT (N, DSD): Known Results
 PMTCT_STAT (N, NA): Known Results
 PMTCT_STAT (N, NGI): Known Results
 PMTCT_STAT (N, TA): Known Results*/
 or (dv.dataelementid in (480879, 1486204, 1486226, 1486143) and dv2.dataelementid in (480879, 1486204, 1486226, 1486143))
 /* VMMC_CIRC (N, DSD): Voluntary Circumcised
 VMMC_CIRC (N, NA): Voluntary Circumcised
 VMMC_CIRC (N, TA): Voluntary Circumcised
 VMMC_CIRC (N, NGI): Voluntary Circumcised*/
 or (dv.dataelementid in (1486234, 1486214, 1486159, 496296) and dv2.dataelementid in (1486234, 1486214, 1486159, 496296))
 /*VMMC_AE (N, DSD): Adverse Event*/
 or (dv.dataelementid in (496295) and dv2.dataelementid in (496295))
 /*HRH_PRE (N, TA): Graduates by Cadre
 HRH_PRE (N, DSD): Graduates by Cadre*/
 or (dv.dataelementid in (1487434, 495301) and dv2.dataelementid in (1487434, 495301))) ) 
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
 GROUP BY level2.name, level3.name, level4.name, level5.name, ou.name, ou.organisationunitid, ous.level, pe.periodid, pe.startdate, pe.enddate, de.name, cocn.categoryoptioncomboname, aocn.categoryoptioncomboname, dv.attributeoptioncomboid, dv.value,duplicate_type
 ORDER BY  oulevel2_name,  oulevel3_name, oulevel4_name, oulevel5_name , orgunit_name,  startdate,enddate, dataelement,disaggregation,mechanism,partner,value
 LIMIT 500000
 $$ LANGUAGE SQL;