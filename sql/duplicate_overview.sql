SELECT 
 ou.name,
 ps.iso as period,
 de.name as dataelement,
 coc.categoryoptioncomboname,
 COUNT(dv1.attributeoptioncomboid) as dup_count
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
 INNER JOIN organisationunit ou on ous.idlevel3 = ou.organisationunitid
 INNER JOIN period p on dv1.periodid = p.periodid
 INNER JOIN _periodstructure ps on p.periodid = ps.periodid
INNER JOIN dataelement de on dv1.dataelementid = de.dataelementid
INNER JOIN _categoryoptioncomboname coc on dv1.categoryoptioncomboid = coc.categoryoptioncomboid
 WHERE dv1.dataelementid IN (
 SELECT DISTINCT dataelementid from datasetmembers where datasetid in (SELECT datasetid from dataset where uid IN ('qRvKHvlzNdv','ovYEbELCknv','tCIW2VFd8uu',
 'i29foJcLY9Y','xxo1G5V1JG2', 'STL4izfLznL') ) )
GROUP BY ou.name,ps.iso,de.name, coc.categoryoptioncomboname
ORDER BY period,name, dataelement,categoryoptioncomboname;