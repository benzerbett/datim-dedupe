CREATE TYPE duplicate_records AS 
(oulevel2_name character varying(230)   ,
 oulevel3_name character varying(230)   ,
 oulevel4_name character varying(230)   ,
 oulevel5_name character varying(230)   ,
 orgunit_name  character varying(230)   ,
 orgunit_level integer                  ,
 iso_period character varying(20)       , 
 dataelement   character varying(230)   ,
 disaggregation character varying(250)   ,
 agency character varying (250),
 mechanism character varying(250)   ,
 partner character varying(230)   ,
 value character varying(50000),
duplicate_type character varying(50),
duplicate_status character varying(50),
ou_uid character varying (11),
de_uid character varying (11),
coc_uid character varying (11),
group_id character (32)

 );

CREATE  OR REPLACE FUNCTION view_duplicates(uid character (11),showresolved boolean default false) 
RETURNS setof duplicate_records AS  $$
DECLARE
returnrec duplicate_records;
BEGIN

BEGIN
CREATE TEMP TABLE temp2 OF duplicate_records ON COMMIT DROP ;

CREATE  TEMP TABLE  temp1 
(sourceid integer,
periodid integer,
dataelementid integer,
categoryoptioncomboid integer,
attributeoptioncomboid integer,
value character varying (500000))
ON COMMIT DROP;
END;

EXECUTE '
INSERT INTO temp1
SELECT DISTINCT
dv1.sourceid,
dv1.periodid,
dv1.dataelementid,
dv1.categoryoptioncomboid,
dv1.attributeoptioncomboid,
dv1.value 
from datavalue dv1
INNER JOIN _orgunitstructure ous on dv1.sourceid = ous.organisationunitid
and ous.uidlevel3 = ''' ||  $1 || '''  
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
 and ( 
 /*TX_CURR (N, NGI): Receiving ART
 *TX_CURR (N, DSD): Receiving ART
 *TX_CURR (N, NA): Receiving ART
 *TX_CURR (N, TA): Receiving ART
*/
 (dv1.dataelementid in (1486224, 496283, 1486200, 1486186) and dv2.dataelementid in (1486224, 496283, 1486200, 1486186)) 
 /*TX_NEW (N, DSD): New on ART
 TX_NEW (N, TA): New on ART*/
 or (dv1.dataelementid in (1487424, 496286) and dv2.dataelementid in (1487424, 496286))
 /*TX_RET (N, DSD): Alive at 12 mo. after initiating ART*/
 or (dv1.dataelementid in (496289) and dv2.dataelementid in (496289))
 /* TX_RET (D, DSD): Total Initiated ART in 12 mo.*/
 or (dv1.dataelementid in (496290) and dv2.dataelementid in (496290)) 
 /* BS_COLL (N, DSD): Blood Units Donated
  BS_COLL (N, TA): Blood Units Donated*/
 or (dv1.dataelementid in (496297, 1487432) and dv2.dataelementid in (496297, 1487432)) 
 /* C2.1.D (N, TA): PLHIV Min One Service
 C2.1.D (N, NA): PLHIV Min One Service
 C2.1.D (N, NGI): PLHIV Min One Service
 C2.1.D (N, DSD): PLHIV Min One Service */
 or (dv1.dataelementid in (1486193, 1486139, 1486120, 1486240) and dv2.dataelementid in (1486193, 1486139, 1486120, 1486240)) 
 /*C2.4.D (N, DSD): PLHIV Screened for TB*/
 or (dv1.dataelementid in (1486432) and dv2.dataelementid in (1486432)) 
 /*FN_THER (N, DSD): Undernourished PLHIV fed*/
 or (dv1.dataelementid in (496311) and dv2.dataelementid in (496311))
 /*GEND_GBV (N, DSD): GBV Care*/
 or (dv1.dataelementid in (495223) and dv2.dataelementid in (495223))
 /*PP_PREV (N, TA): HIV Prevention Program
 PP_PREV (N, DSD): HIV Prevention Program*/
 or (dv1.dataelementid in (1486154, 495270) and dv2.dataelementid in (1486154, 495270))
 /*HTC_TST (N, DSD): HTC received results
 HTC_TST (N, NA): HTC received results
 HTC_TST (N, TA): HTC received results
 HTC_TST (N, NGI): HTC received results*/
 or (dv1.dataelementid in (1486219, 1486166, 495360, 1486197) and dv2.dataelementid in (1486219, 1486166, 495360, 1486197))
 /* KP_PREV (N, DSD): Key Pop Preventive
 KP_PREV (N, TA): Key Pop Preventive*/
 or (dv1.dataelementid in (495365, 1486142) and dv2.dataelementid in (495365, 1486142))
 /*LAB_ACC (N, TA): Labs Accredited
 LAB_ACC (N, DSD): Labs Accredited*/
 or (dv1.dataelementid in (495366, 1486160) and dv2.dataelementid in (495366, 1486160))
 /* OVC_SERV (N, DSD): Beneficiaries Served
 OVC_SERV (N, TA): Beneficiaries Served*/
 or (dv1.dataelementid in (496273, 1486170) and dv2.dataelementid in (496273, 1486170))
 /*PMTCT_ARV (N, DSD): ARVs
 PMTCT_ARV (N, NA): ARVs
 PMTCT_ARV (N, NGI): ARVs
 PMTCT_ARV (N, TA): ARVs*/
 or (dv1.dataelementid in (1486230, 486970, 1486146, 1486207) and dv2.dataelementid in (1486230, 486970, 1486146, 1486207))
 /*PMTCT_CTX (N, DSD): Infants CTX*/
 or (dv1.dataelementid in (480911) and dv2.dataelementid in (480911)) 
 /* PMTCT_EID (N, TA): Infant Testing
 PMTCT_EID (N, DSD): Infant Testing*/
 or (dv1.dataelementid in (1487430, 480859) and dv2.dataelementid in (1487430, 480859))
/*  PMTCT_STAT (N, DSD): Known Results
 PMTCT_STAT (N, NA): Known Results
 PMTCT_STAT (N, NGI): Known Results
 PMTCT_STAT (N, TA): Known Results*/
 or (dv1.dataelementid in (480879, 1486204, 1486226, 1486143) and dv2.dataelementid in (480879, 1486204, 1486226, 1486143))
 /* VMMC_CIRC (N, DSD): Voluntary Circumcised
 VMMC_CIRC (N, NA): Voluntary Circumcised
 VMMC_CIRC (N, TA): Voluntary Circumcised
 VMMC_CIRC (N, NGI): Voluntary Circumcised*/
 or (dv1.dataelementid in (1486234, 1486214, 1486159, 496296) and dv2.dataelementid in (1486234, 1486214, 1486159, 496296))
 /*VMMC_AE (N, DSD): Adverse Event*/
 or (dv1.dataelementid in (496295) and dv2.dataelementid in (496295))
 /*HRH_PRE (N, TA): Graduates by Cadre
 HRH_PRE (N, DSD): Graduates by Cadre*/
 or (dv1.dataelementid in (1487434, 495301) and dv2.dataelementid in (1487434, 495301))
 OR (dv1.dataelementid  IN (1486451,1486449,1486450)
  AND dv2.dataelementid IN  (1486451,1486449,1486450) )
  
 ) ;';

EXECUTE 'ALTER TABLE temp1 ADD COLUMN duplicate_type character varying(50);';

 
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
EXECUTE 'ALTER TABLE temp1 ADD COLUMN iso_period character varying;
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
 
 /*Group ID. This will be used to group duplicates. Important for the DSD TA overlap*/
 
 EXECUTE 'ALTER TABLE temp1 ADD COLUMN group_id character(32);
UPDATE temp1 SET group_id = md5( COALESCE(orgunit_name,'') || COALESCE(dataelement,'') || COALESCE(disaggregation,'') || COALESCE(iso_period,'') )';

/*Concordance*/
EXECUTE '
UPDATE temp1 set duplicate_type = b.concordance from (

SELECT group_id,
 CASE 
 WHEN COUNT(value) = 1 THEN ''CONCORDANT''
 WHEN COUNT(value) > 0 THEN ''DISCORDANT''
 ELSE ''UNKNOWN''
 END as concordance from 
(
SELECT  DISTINCT group_id ,value from temp1
WHERE attributeoptioncomboid != (SELECT categoryoptioncomboid
 FROM _categoryoptioncomboname where categoryoptioncomboname ~*(''00000 De-duplication adjustment''))
 ) a
GROUP BY group_id ) b
where temp1.group_id = b.group_id';
/*Duplication status*/

EXECUTE 'ALTER TABLE temp1 ADD COLUMN duplication_status character varying(50) DEFAULT ''UNRESOLVED'';

UPDATE temp1 set duplication_status = b.duplication_status from (

SELECT DISTINCT group_id,''RESOLVED'' AS duplication_status
FROM temp1
WHERE attributeoptioncomboid = (SELECT categoryoptioncomboid
 FROM _categoryoptioncomboname where categoryoptioncomboname ~*(''00000 De-duplication adjustment'')) ) b
where temp1.group_id = b.group_id';


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
group_id  
FROM temp1
ORDER by oulevel2_name,oulevel3_name,orgunit_name,iso_period,dataelement,
disaggregation,partner,mechanism';
 

 
 
  /*Return the records*/
  FOR returnrec IN SELECT * FROM temp2 LOOP
    	RETURN NEXT returnrec;
    END LOOP;

 END;
$$ LANGUAGE plpgsql VOLATILE;

 
 