


BEGIN;

SELECT plan(33);

SELECT is( current_user, 'dhis', 'Should be the dhis user' );
--Dependent tables
SELECT has_table( 'datavalue' );
SELECT has_column( 'datavalue','dataelementid' );
SELECT has_column( 'datavalue','periodid' );
SELECT has_column( 'datavalue','sourceid' );
SELECT has_column( 'datavalue','categoryoptioncomboid' );
SELECT has_column( 'datavalue','attributeoptioncomboid' );
SELECT has_column( 'datavalue','value' );
SELECT has_column( 'datavalue','lastupdated' );
SELECT table_privs_are(
     'datavalue', 'dhis', ARRAY[ 'DELETE',
'INSERT',
'REFERENCES',
'SELECT',
'TRIGGER',
'TRUNCATE',
'UPDATE'],
    'Dhis should be able to select on datavalue'
);


SELECT has_table( 'datavalueaudit' );
SELECT has_column( 'datavalueaudit','dataelementid' );
SELECT has_column( 'datavalueaudit','periodid' );
SELECT has_column( 'datavalueaudit','organisationunitid' );
SELECT has_column( 'datavalueaudit','categoryoptioncomboid' );
SELECT has_column( 'datavalueaudit','attributeoptioncomboid' );
SELECT has_column( 'datavalueaudit','value' );
SELECT col_type_is( 'datavalueaudit','created','timestamp without time zone' );


SELECT has_table( 'datavalueaudit_dedupes' );
SELECT col_type_is( 'datavalueaudit_dedupes','datavalueaudit_dedupes_serialid','integer' );
SELECT col_type_is( 'datavalueaudit_dedupes','dataelementid','integer' );
SELECT col_type_is( 'datavalueaudit_dedupes','periodid','integer' );
SELECT col_type_is( 'datavalueaudit_dedupes','sourceid','integer' );
SELECT col_type_is( 'datavalueaudit_dedupes','categoryoptioncomboid','integer' );
SELECT col_type_is( 'datavalueaudit_dedupes','value','character varying(50000)' );
SELECT col_type_is( 'datavalueaudit_dedupes','storedby','character varying(100)' );
SELECT col_type_is( 'datavalueaudit_dedupes','lastupdated','timestamp without time zone' );
SELECT col_type_is( 'datavalueaudit_dedupes','followup','boolean' );
SELECT col_type_is( 'datavalueaudit_dedupes','attributeoptioncomboid','integer' );
SELECT col_type_is( 'datavalueaudit_dedupes','created','timestamp without time zone' );
SELECT col_type_is( 'datavalueaudit_dedupes','deleted_on','date' );



--Hard coded adjustment mechanisms for performance
SELECT results_eq( 'SELECT COUNT(categoryoptioncomboid)::integer from categoryoptioncombo where categoryoptioncomboid = 2210817',  
  'SELECT 1::integer',    
  'Pure dedupe adjustment categoryoptioncombo should exist' );
--Hard coded adjustment mechanisms for performance
SELECT results_eq( 'SELECT COUNT(categoryoptioncomboid)::integer from categoryoptioncombo where categoryoptioncomboid = 3993514',  
  'SELECT 1::integer',    
  'Pure dedupe adjustment categoryoptioncombo should exist' );



-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;



--Helper function for creation of a pure dupe which is resolved
CREATE OR REPLACE FUNCTION puredupe() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,5,'jpickering','2016-12-25 12:07:04.168',NULL,FALSE,2121684,'2016-12-25 12:07:04.17');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,10,'jpickering','2016-12-25 12:07:09.909',NULL,FALSE,2121892,'2016-12-25 12:07:09.91');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,-5,'jpickering','2016-12-25 12:17:07.733',NULL,FALSE,2210817,'2016-12-25 12:17:07.734');
DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
RETURN 1;
END;
$$ LANGUAGE plpgsql;


--Test plan for a valid duplicate. 
--Cleansing function should not remove this. 
BEGIN;
SELECT plan(3);
--Seed the data
SELECT puredupe();
--Data and test results should be the same
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid pure duplicates should remain untouched.');
--Function should removed zero rows
SELECT is(resolve_bad_duplication_adjustments(),0,'Should remove zero records');
--Same test as above, but should still be valid
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid pure duplicates should remain untouched.');
-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;

--Case when a duplicate adjustment exists, but with no pairing
CREATE OR REPLACE FUNCTION singular_dedupe() RETURNS integer AS $$
BEGIN
PERFORM puredupe();
--DELETE one of the values from datavalue
DELETE FROM  datavalue 
WHERE dataelementid = 2192705
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 2121684;
--DELETE one of the values from dedupetests
DELETE FROM  dedupetests 
WHERE dataelementid = 2192705
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 2121684;
--DELETE the adjustment from dedupetests. The function should remove it
DELETE FROM  dedupetests 
WHERE dataelementid = 2192705
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 2210817;
RETURN 1;
END;
$$ LANGUAGE plpgsql;


--Uncoupled pure duplicate: Occurs when a duplicate existed with two components
--but now has only a single value with a duplicate
BEGIN;
SELECT plan(3);
SELECT singular_dedupe();
--The results should be different now.
--TODO: Should really test what is different
SELECT results_ne('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Test outcome and original data should not be the same prior to the test');

SELECT is(resolve_bad_duplication_adjustments(),1,'Should remove a single record');
--This test should remove the dedupe adjustment from the datavalue table and be equal
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Uncoupled duplicates should be deleted.');
SELECT * FROM finish();
ROLLBACK;


BEGIN;
--Case when a previously deduped group receives an update
CREATE OR REPLACE FUNCTION update_after_dedupe() RETURNS integer AS $$
BEGIN
PERFORM puredupe();
--Simulate an update by adjusting the timestamp
UPDATE datavalue set lastupdated = '2016-12-26 12:17:07.733'::timestamp with time zone
WHERE dataelementid = 2192705
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 2121684;
UPDATE dedupetests set lastupdated = '2016-12-26 12:17:07.733'::timestamp with time zone
WHERE dataelementid = 2192705
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 2121684;
--DELETE the adjustment from dedupetests. The function should remove it
DELETE FROM  dedupetests 
WHERE dataelementid = 2192705
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 2210817;
RETURN 1;
END;
$$ LANGUAGE plpgsql;
COMMIT;


BEGIN;
SELECT plan(3);
SELECT update_after_dedupe();
PREPARE data_timestamp as  
 SELECT max(lastupdated)::timestamp without time zone as tz FROM datavalue where attributeoptioncomboid != 2210817;

--DEALLOCATE dedupe_timestamp;
PREPARE dedupe_timestamp AS
SELECT max(lastupdated)::timestamp without time zone as tz FROM datavalue where attributeoptioncomboid = 2210817;
--Really should be using cmp_OK with >= but that is to_do
SELECT results_ne('data_timestamp',
'dedupe_timestamp',
'Data should not be older than the dedupe adustment');

SELECT is(resolve_bad_duplication_adjustments(),1,'Should remove a single record');
--This test should remove the dedupe adjustment from the datavalue table and be equal
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Dedupe adjustments younger than duplicate components should be removed');
SELECT * FROM finish();
ROLLBACK;

--DELETION OF a duplicate component. 
--This will show up as a value in the data value audit table which is older than the dedupe adjustment

CREATE OR REPLACE FUNCTION delete_after_dedupe() RETURNS integer AS $$
BEGIN
PERFORM puredupe();
--Insert a value after the dedupe
INSERT INTO datavalueaudit VALUES(1,2192705,21351215,2138647,15,5,'jpickering','DELETE',26405907,'2016-12-26 12:07:05.17');
--Delete the adjustment from the tests table
DELETE FROM  dedupetests 
WHERE dataelementid = 2192705
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 2210817;
RETURN 1;
END;
$$ LANGUAGE plpgsql;

BEGIN;
SELECT plan(2);
SELECT delete_after_dedupe();

SELECT is(resolve_bad_duplication_adjustments(),1,'Should remove a single record');
--This test should remove the dedupe adjustment from the datavalue table and be equal
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Dedupe adjustments which are younger than audited components should be removed');
SELECT * FROM finish();
ROLLBACK;



--Helper function for creation of a pure dupe which is resolved
CREATE OR REPLACE FUNCTION crosswalk_dupe() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,5,'jpickering','2016-12-25 12:07:04.168',NULL,FALSE,2121684,'2016-12-25 12:07:04.17');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,10,'jpickering','2016-12-25 12:07:09.909',NULL,FALSE,2121892,'2016-12-25 12:07:09.91');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,-10,'jpickering','2016-12-25 12:17:07.733',NULL,FALSE,3993514,'2016-12-25 12:17:07.734');
DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;

RETURN 1;
END;
$$ LANGUAGE plpgsql;


--Test plan for a valid crosswalk duplicate. 
--Cleansing function should not touch anything. 
BEGIN;
SELECT plan(3);
--Seed the data
SELECT crosswalk_dupe();
--Data and test results should be the same
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid crosswalk duplicates should remain untouched.');
--Function should removed zero rows
SELECT is(resolve_bad_duplication_adjustments(),0,'Should remove zero records');
--Same test as above, but should still be valid
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid pure duplicates should remain untouched.');
-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;


BEGIN;
--Helper function for creation of a pure dupe which has a DSD component older than the crosswalk adjustment
CREATE OR REPLACE FUNCTION crosswalk_dupe_with_dsd_insert() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,5,'jpickering','2016-12-25 12:07:04.168',NULL,FALSE,2121684,'2016-12-25 12:07:04.17');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,10,'jpickering','2016-12-26 12:07:09.909',NULL,FALSE,2121684,'2016-12-25 12:07:09.91');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,-10,'jpickering','2016-12-25 12:17:07.733',NULL,FALSE,3993514,'2016-12-25 12:17:07.734');
--An older DSD component
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,15,'jpickering','2016-12-26 17:10:18.569',NULL,FALSE,2121892,'2016-12-25 12:17:07.734');
DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
--Delete the adjustment from the tests table
DELETE FROM  dedupetests 
WHERE dataelementid = 2192546
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 3993514;
RETURN 1;
END;
$$ LANGUAGE plpgsql;


--Test plan for a valid crosswalk duplicate. 
--Cleansing function should not touch anything. 

SELECT plan(3);
--Seed the data
SELECT crosswalk_dupe_with_dsd_insert();
--Data and test results should be the same
SELECT results_ne('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid crosswalk duplicates should remain untouched.');
--Function should removed zero rows
SELECT is(resolve_bad_duplication_adjustments(),1,'Should remove one record');
--Same test as above, but should still be valid after the execution of the cleaning function
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid pure duplicates should remain untouched.');
-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;

BEGIN;
--Helper function for creation of a pure dupe which has a DSD component older than the crosswalk adjustment
CREATE OR REPLACE FUNCTION crosswalk_dupe_with_ta_insert() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,5,'jpickering','2016-12-25 12:07:04.168',NULL,FALSE,2121684,'2016-12-25 12:07:04.17');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,10,'jpickering','2016-12-26 12:07:09.909',NULL,FALSE,2121684,'2016-12-25 12:07:09.91');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,-10,'jpickering','2016-12-25 12:17:07.733',NULL,FALSE,3993514,'2016-12-25 12:17:07.734');
--An older DSD component
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,15,'jpickering','2016-12-26 17:10:18.569',NULL,FALSE,2121892,'2016-12-25 12:17:07.734');
DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
--Delete the adjustment from the tests table
DELETE FROM  dedupetests 
WHERE dataelementid = 2192546
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 3993514;
RETURN 1;
END;
$$ LANGUAGE plpgsql;


--Test plan for a valid crosswalk duplicate. 
--Cleansing function should not touch anything. 

SELECT plan(3);
--Seed the data
SELECT crosswalk_dupe_with_ta_insert();
--Data and test results should differ
SELECT results_ne('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid crosswalk duplicates should remain untouched.');
--Function should removed zero rows
SELECT is(resolve_bad_duplication_adjustments(),1,'Should remove one record');
--Same test as above, but should still be valid after the execution of the cleaning function
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid pure duplicates should remain untouched.');
-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;

BEGIN;
--Helper function for creation of a crosswalk with an uncoupled TA component
CREATE OR REPLACE FUNCTION crosswalk_dupe_with_ta_uncoupled() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,5,'jpickering','2016-12-25 12:07:04.168',NULL,FALSE,2121684,'2016-12-25 12:07:04.17');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,-10,'jpickering','2016-12-25 12:17:07.733',NULL,FALSE,3993514,'2016-12-25 12:17:07.734');

DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
--Delete the adjustment from the tests table
DELETE FROM  dedupetests 
WHERE dataelementid = 2192546
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 3993514;
RETURN 1;
END;
$$ LANGUAGE plpgsql;


--Test plan for a valid crosswalk duplicate. 
--Cleansing function should not touch anything. 

SELECT plan(3);
--Seed the data
SELECT crosswalk_dupe_with_ta_uncoupled();
--Data and test results should differ
SELECT results_ne('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid crosswalk duplicates should remain untouched.');
--Function should removed zero rows
SELECT is(resolve_bad_duplication_adjustments(),1,'Should remove one record');
--Same test as above, but should still be valid after the execution of the cleaning function
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid pure duplicates should remain untouched.');
-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;

BEGIN;
--Helper function for creation of a crosswalk with an uncoupled TA component
CREATE OR REPLACE FUNCTION crosswalk_dupe_with_dsd_uncoupled() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
--TA Value
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,5,'jpickering','2016-12-25 12:07:04.168',NULL,FALSE,2121684,'2016-12-25 12:07:04.17');
--DSD-TA Crosswalk adjustment
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,-10,'jpickering','2016-12-25 12:17:07.733',NULL,FALSE,3993514,'2016-12-25 12:17:07.734');

DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
--Delete the adjustment from the tests table
DELETE FROM  dedupetests 
WHERE dataelementid = 2192546
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 3993514;
RETURN 1;
END;
$$ LANGUAGE plpgsql;


--Test plan for a valid crosswalk duplicate. 
--Cleansing function should not touch anything. 

SELECT plan(3);
--Seed the data
SELECT crosswalk_dupe_with_dsd_uncoupled();
--Data and test results should differ
SELECT results_ne('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid crosswalk duplicates should remain untouched.');
--Function should removed zero rows
SELECT is(resolve_bad_duplication_adjustments(),1,'Should remove one record');
--Same test as above, but should still be valid after the execution of the cleaning function
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid pure duplicates should remain untouched.');
-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;

BEGIN;
--Helper function for creation of a more complex DSD-TA crosswalk which is valid.
--Consists of both DSD and TA pure dupes as well as crosswalk components
CREATE OR REPLACE FUNCTION crosswalk_dupe_complex() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,'5','jpickering','2016-12-26 17:32:14.885',NULL,FALSE,2121684,'2016-12-26 17:32:14.886');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,'10','jpickering','2016-12-26 17:32:21.629',NULL,FALSE,2121892,'2016-12-26 17:32:21.63');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'15','jpickering','2016-12-26 17:32:30.911',NULL,FALSE,2121684,'2016-12-26 17:32:30.913');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'20','jpickering','2016-12-26 17:32:36.39',NULL,FALSE,2121892,'2016-12-26 17:32:36.391');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'-15','jpickering','2016-12-26 17:32:57.963',NULL,FALSE,2210817,'2016-12-26 17:32:57.965');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,'-5','jpickering','2016-12-26 17:32:59.02',NULL,FALSE,2210817,'2016-12-26 17:32:59.021'); 
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'-10','jpickering','2016-12-26 17:33:13.463',NULL,FALSE,3993514,'2016-12-26 17:33:13.464');

DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;

RETURN 1;
END;
$$ LANGUAGE plpgsql;

SELECT plan(3);
--Seed the data
SELECT crosswalk_dupe_complex();
--Data and test results should differ
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Datavalue and test outcome should NOT differ');
--Function should removed zero rows
SELECT is(resolve_bad_duplication_adjustments(),0,'Should remove zero record');
--Results should be equal now. 
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'After cleaning, test and datavalue should be the same.');
-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;


BEGIN;
--Helper function for creation of a crosswalk dupe with inserted DSD component
CREATE OR REPLACE FUNCTION crosswalk_dupe_ta_insert() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,'5','jpickering','2016-12-26 17:32:14.885',NULL,FALSE,2121684,'2016-12-26 17:32:14.886');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,'10','jpickering','2016-12-26 17:32:21.629',NULL,FALSE,2121892,'2016-12-26 17:32:21.63');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'15','jpickering','2016-12-26 17:32:30.911',NULL,FALSE,2121684,'2016-12-26 17:32:30.913');
--Simulate an TA insert
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'20','jpickering','2016-12-27 17:32:36.39',NULL,FALSE,2121892,'2016-12-27 17:32:36.391');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'-15','jpickering','2016-12-26 17:32:57.963',NULL,FALSE,2210817,'2016-12-26 17:32:57.965');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,'-5','jpickering','2016-12-26 17:32:59.02',NULL,FALSE,2210817,'2016-12-26 17:32:59.021'); 
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'-10','jpickering','2016-12-26 17:33:13.463',NULL,FALSE,3993514,'2016-12-26 17:33:13.464');
DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
--Delete the adjustment from the tests table
DELETE FROM  dedupetests 
WHERE dataelementid = 2192546
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 2210817;
--Delete the adjustment from the tests table
DELETE FROM  dedupetests 
WHERE dataelementid = 2192546
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 3993514;
RETURN 1;
RETURN 1;

RETURN 1;
END;
$$ LANGUAGE plpgsql;

SELECT plan(3);
--Seed the data
SELECT crosswalk_dupe_ta_insert();
--Data and test results should differ
SELECT results_ne('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Datavalue and test outcome should NOT differ');
--Function should removed zero rows
SELECT is(resolve_bad_duplication_adjustments(),2,'Should remove noth pure and crosswalk adjustments');
--Results should be equal now. 
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'After cleaning, test and datavalue should be the same.');
-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;


BEGIN;
--Helper function for creation of a crosswalk dupe with inserted TA component
CREATE OR REPLACE FUNCTION crosswalk_dupe_dsd_insert() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,'5','jpickering','2016-12-26 17:32:14.885',NULL,FALSE,2121684,'2016-12-26 17:32:14.886');
--Alter the DSD component to be older than everything else to Simulate an insert after dedupe
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,'10','jpickering','2016-12-27 17:32:21.629',NULL,FALSE,2121892,'2016-12-27 17:32:21.63');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'15','jpickering','2016-12-26 17:32:30.911',NULL,FALSE,2121684,'2016-12-26 17:32:30.913');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'20','jpickering','2016-12-26 17:32:36.39',NULL,FALSE,2121892,'2016-12-26 17:32:36.391');
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'-15','jpickering','2016-12-26 17:32:57.963',NULL,FALSE,2210817,'2016-12-26 17:32:57.965');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,'-5','jpickering','2016-12-26 17:32:59.02',NULL,FALSE,2210817,'2016-12-26 17:32:59.021'); 
INSERT INTO datavalue VALUES(2192546,21351215,2138647,15,'-10','jpickering','2016-12-26 17:33:13.463',NULL,FALSE,3993514,'2016-12-26 17:33:13.464');
DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
--Delete the adjustment from the tests table
DELETE FROM  dedupetests 
WHERE dataelementid = 2192705
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 2210817;
--Delete the adjustment from the tests table
DELETE FROM  dedupetests 
WHERE dataelementid = 2192546
and periodid = 21351215
and sourceid = 2138647
and categoryoptioncomboid = 15
and attributeoptioncomboid = 3993514;
RETURN 1;
RETURN 1;

RETURN 1;
END;
$$ LANGUAGE plpgsql;

SELECT plan(3);
--Seed the data
SELECT crosswalk_dupe_dsd_insert();
--Data and test results should differ
SELECT results_ne('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Datavalue and test outcome should differ');
--Function should removed zero rows
SELECT is(resolve_bad_duplication_adjustments(),2,'Should remove noth pure and crosswalk adjustments');
--Results should be equal now. 
SELECT results_eq('SELECT * FROM datavalue',
'SELECT * FROM dedupetests',
'Valid pure duplicates should remain untouched.');
-- Finish the tests and clean up.
SELECT * FROM finish();
ROLLBACK;
