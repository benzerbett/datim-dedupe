
CREATE OR REPLACE FUNCTION resolve_bad_duplication_adjustments() RETURNS integer AS $$ 


 BEGIN 

 --Section for removal of 00000 dedupe adjustments which are no longer valid.
--Orphaned dupes. These are ones which were a duplicate pair at some point in time, but are no longer

DELETE
FROM datavalue d USING
  (SELECT a.dataelementid,
          a.periodid,
          a.sourceid,
          a.categoryoptioncomboid
   FROM datavalue a
   INNER JOIN
     (SELECT DISTINCT dataelementid,
                      periodid,
                      sourceid,
                      categoryoptioncomboid
      FROM datavalue
      WHERE attributeoptioncomboid =
          (SELECT categoryoptioncomboid
           FROM _categoryoptioncomboname
           WHERE categoryoptioncomboname ~('^\(00000'))) b ON a.dataelementid = b.dataelementid
   AND a.periodid = b.periodid
   AND a.categoryoptioncomboid = b.categoryoptioncomboid
   AND a.sourceid = b.sourceid
   WHERE a.value != '0'
     OR a.value != ''
     OR a.value IS NULL
     OR
     AND a.attributeoptioncomboid !=
       (SELECT categoryoptioncomboid
        FROM _categoryoptioncomboname
        WHERE categoryoptioncomboname ~('^\(00001'))
   GROUP BY a.dataelementid,
            a.periodid,
            a.sourceid,
            a.categoryoptioncomboid HAVING COUNT(*) < 3) c
WHERE c.dataelementid = d.dataelementid
  AND c.periodid = d.periodid
  AND c.sourceid = d.sourceid
  AND c.categoryoptioncomboid = d.categoryoptioncomboid
  AND d.attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00000')); 

--Vintage pure dupes. Occurs when datavalues are updated after the dedupe happened.
--This SHOULD be re-deduped, but in situations when this occurs, these must be deleted.

  DELETE
  FROM datavalue d USING
    (SELECT a.dataelementid,
            a.periodid,
            a.sourceid,
            a.categoryoptioncomboid,
            a.lastupdated AS dup_timestamp,
            b.value_timestamp
     FROM datavalue a
     LEFT JOIN
       (SELECT dataelementid,
               periodid,
               sourceid,
               categoryoptioncomboid,
               MAX(lastupdated) AS value_timestamp
        FROM datavalue
        WHERE attributeoptioncomboid NOT IN
            (SELECT categoryoptioncomboid
             FROM _categoryoptioncomboname
             WHERE categoryoptioncomboname ~('^\(0000[0|1]'))
        GROUP BY dataelementid,
                 periodid,
                 sourceid,
                 categoryoptioncomboid) b ON a.dataelementid = b.dataelementid
     AND a.periodid = b.periodid
     AND a.categoryoptioncomboid = b.categoryoptioncomboid
     AND a.sourceid = b.sourceid
     WHERE a.attributeoptioncomboid =
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~('^\(00000'))
       AND a.lastupdated < b.value_timestamp) c WHERE c.dataelementid = d.dataelementid
  AND c.periodid = d.periodid
  AND c.sourceid = d.sourceid
  AND c.categoryoptioncomboid = d.categoryoptioncomboid
  AND d.attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00000'));

--Begin resolution of dangling DSD-TA dedupes
 --Every DSD-TA duplicate needs a TA conjugate
 --If the TA value is missing the dedupe needs to disappear
 --TODO: Need to work out the issue with duplicate zero values.
--Orphaned DSD-TA Crosswalks duplication adjustments

  DELETE
  FROM datavalue d USING
    (SELECT a.dataelementid,
            a.periodid,
            a.sourceid,
            a.categoryoptioncomboid
     FROM datavalue a
     INNER JOIN
       (SELECT DISTINCT dataelementid,
                        periodid,
                        sourceid,
                        categoryoptioncomboid
        FROM datavalue
        WHERE attributeoptioncomboid =
            (SELECT categoryoptioncomboid
             FROM _categoryoptioncomboname
             WHERE categoryoptioncomboname ~('^\(00001'))) b ON a.dataelementid = b.dataelementid
     AND a.periodid = b.periodid
     AND a.categoryoptioncomboid = b.categoryoptioncomboid
     AND a.sourceid = b.sourceid
     WHERE a.value != '0'
       OR a.value != ''
       OR a.value IS NULL
       OR
       AND a.attributeoptioncomboid !=
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~('^\(00000'))
     GROUP BY a.dataelementid,
              a.periodid,
              a.sourceid,
              a.categoryoptioncomboid HAVING COUNT(*) < 3) c WHERE c.dataelementid = d.dataelementid
  AND c.periodid = d.periodid
  AND c.sourceid = d.sourceid
  AND c.categoryoptioncomboid = d.categoryoptioncomboid
  AND d.attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00000'));
  DELETE
  FROM datavalue b USING
    ( SELECT DISTINCT dataelementid,
                      periodid,
                      sourceid,
                      categoryoptioncomboid
     FROM datavalue
     WHERE attributeoptioncomboid =
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~('^\(00001'))
       AND value !='0' EXCEPT
       SELECT DISTINCT dataelementid,
                       periodid,
                       sourceid,
                       categoryoptioncomboid
       FROM datavalue WHERE attributeoptioncomboid NOT IN
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~('^\(0000[0|1]'))
       AND NOT (value = '0'
                OR value =''
                OR VALUE IS NULL)) c WHERE b.dataelementid = c.dataelementid
  AND b.periodid = c.periodid
  AND b.sourceid = c.sourceid
  AND b.categoryoptioncomboid = c.categoryoptioncomboid
  AND b.attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00001') LIMIT 1); --Vintage DSD-TA CROSSWALKS

  CREATE TEMP TABLE temp1 (sourceid integer, 
    periodid integer, 
    dataelementid integer, 
    categoryoptioncomboid integer, 
    lastupdated TIMESTAMP WITHOUT time ZONE, 
    dsd_timestamp TIMESTAMP WITHOUT time ZONE, 
    dsd_audit_timestamp TIMESTAMP WITHOUT time ZONE, 
    ta_audit_timestamp TIMESTAMP WITHOUT time ZONE) 
  ON COMMIT DROP;

  INSERT INTO temp1
  SELECT DISTINCT sourceid,
                  periodid,
                  dataelementid,
                  categoryoptioncomboid,
                  lastupdated
  FROM datavalue WHERE attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00001'));

     --Set the DSD current timestamp. Must be younger than the dupe adjustment
  UPDATE temp1 a
  SET dsd_timestamp = b.dsd_timestamp
  FROM
    (SELECT dv.sourceid,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.lastupdated) AS dsd_timestamp
     FROM datavalue dv
     INNER JOIN
       (SELECT dsd.sourceid,
               dsd.periodid,
               map.dsd_dataelementid AS dataelementid,
               dsd.categoryoptioncomboid
        FROM temp1 dsd
        INNER JOIN
          (SELECT *
           FROM _view_dsd_ta_crosswalk) MAP ON dsd.dataelementid = MAP.ta_dataelementid ) a ON a.sourceid = dv.sourceid
     AND a.periodid = dv.periodid
     AND a.categoryoptioncomboid = dv.categoryoptioncomboid
     WHERE dv.attributeoptioncomboid NOT IN
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~*('0000[0|1]'))
     GROUP BY dv.sourceid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid) b WHERE a.dataelementid = b.dataelementid
  AND a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid;

  --Set the DSD audit timestamp. Must be younger than the dupe adjustment
  UPDATE temp1 a
  SET dsd_audit_timestamp = b.dsd_audit_timestamp
  FROM
    (SELECT dv.organisationunitid AS sourceid ,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.TIMESTAMP) AS dsd_audit_timestamp
     FROM datavalueaudit dv
     INNER JOIN
       (SELECT a.sourceid,
               a.periodid,
               b.dsd_dataelementid AS dataelementid,
               a.categoryoptioncomboid
        FROM temp1 a
        INNER JOIN
          (SELECT *
           FROM _view_dsd_ta_crosswalk) b ON a.dataelementid = b.ta_dataelementid) c ON c.dataelementid = dv.dataelementid
     AND c.sourceid = dv.organisationunitid
     AND c.periodid = dv.periodid
     AND c.categoryoptioncomboid = dv.categoryoptioncomboid
     WHERE dv.attributeoptioncomboid NOT IN
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~*('0000[0|1]'))
     GROUP BY dv.organisationunitid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid) b WHERE a.dataelementid = b.dataelementid
  AND a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid;

  --Set the TA audit timestamp. Must be youngerr than the dupe adjustment
  UPDATE temp1 a
  SET ta_audit_timestamp = b.ta_audit_timestamp
  FROM
    (SELECT dv.organisationunitid AS sourceid ,
            dv.periodid,
            dv.dataelementid,
            dv.categoryoptioncomboid,
            max(dv.TIMESTAMP) AS ta_audit_timestamp
     FROM datavalueaudit dv
     INNER JOIN temp1 a ON a.sourceid = dv.organisationunitid
     AND a.periodid = dv.periodid
     AND a.categoryoptioncomboid = dv.categoryoptioncomboid
     AND a.dataelementid = dv.dataelementid
     WHERE dv.attributeoptioncomboid NOT IN
         (SELECT categoryoptioncomboid
          FROM _categoryoptioncomboname
          WHERE categoryoptioncomboname ~*('0000[0|1]'))
     GROUP BY dv.organisationunitid,
              dv.periodid,
              dv.dataelementid,
              dv.categoryoptioncomboid) b WHERE a.dataelementid = b.dataelementid
  AND a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid;
  DELETE
  FROM datavalue b USING
    (SELECT sourceid,
            periodid,
            dataelementid,
            categoryoptioncomboid
     FROM temp1
     WHERE lastupdated < GREATEST(dsd_timestamp,dsd_audit_timestamp,ta_audit_timestamp)) a WHERE a.sourceid = b.sourceid
  AND a.periodid = b.periodid
  AND a.dataelementid = b.dataelementid
  AND a.categoryoptioncomboid = b.categoryoptioncomboid
  AND b.attributeoptioncomboid =
    (SELECT categoryoptioncomboid
     FROM _categoryoptioncomboname
     WHERE categoryoptioncomboname ~('^\(00001') LIMIT 1); 

     RETURN(1); 
     END; 

     $$ LANGUAGE plpgsql VOLATILE;