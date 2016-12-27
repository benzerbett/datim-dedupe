BEGIN;
SELECT plan(21);
SELECT has_function(
    'view_duplicates',ARRAY[ 'character','character varying',
    'boolean','integer','integer','character varying','character varying'],
    'Function view_duplicates(character,character varying,
boolean,integer,integer,character varying,character varying) should exist'
);

SELECT has_type( 'duplicate_records' );

SELECT col_type_is( 'duplicate_records', 'ou_name', 'character varying(230)' );
SELECT col_type_is( 'duplicate_records', 'dataelement', 'character varying(230)' );
SELECT col_type_is( 'duplicate_records', 'disaggregation', 'character varying(250)' );
SELECT col_type_is( 'duplicate_records', 'agency', 'character varying(250)' );
SELECT col_type_is( 'duplicate_records', 'mechanism', 'character varying(250)' );
SELECT col_type_is( 'duplicate_records', 'partner', 'character varying(230)' );
SELECT col_type_is( 'duplicate_records', 'value', 'character varying(50000)' );
SELECT col_type_is( 'duplicate_records', 'duplicate_status', 'character varying(50)' );
SELECT col_type_is( 'duplicate_records', 'ou_uid', 'character varying(11)' );
SELECT col_type_is( 'duplicate_records', 'de_uid', 'character varying(11)' );
SELECT col_type_is( 'duplicate_records', 'coc_uid', 'character varying(11)' );
SELECT col_type_is( 'duplicate_records', 'group_count', 'integer' );
SELECT col_type_is( 'duplicate_records', 'total_groups', 'integer' );

--Invalid orgunit
SELECT throws_ok($$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('foo','2016Q3',FALSE,50,1,'RESULTS', 'PURE' ) $$,
'Invalid organisationunit');
--Invalid period
SELECT throws_ok($$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','foo',FALSE,50,1,'RESULTS', 'PURE' ) $$,
'Invalid period');
--Invalid page size less than 0
SELECT throws_ok($$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','2016Q3',FALSE,-1,1,'RESULTS', 'PURE' ) $$,
'Invalid page size');
--Invalid page 
SELECT throws_ok($$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','2016Q3',FALSE,50,-1,'RESULTS', 'PURE' ) $$,
'Invalid page');
--Invalid dataset type
SELECT throws_ok($$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','2016Q3',FALSE,50,1,'foo', 'PURE' ) $$,
'Invalid dataset type. Must be RESULTS or TARGETS or ALL');
--Invalid dupe type
SELECT throws_ok($$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','2016Q3',FALSE,50,1,'RESULTS', 'foo' ) $$,
'Invalid dedupe type. Must be PURE or CROSSWALK');

SELECT * FROM finish();
ROLLBACK;


BEGIN;
--Helper function for creation of a pure dupe which is not resolved
CREATE OR REPLACE FUNCTION puredupe() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,5,'jpickering','2016-12-25 12:07:04.168',NULL,FALSE,2121684,'2016-12-25 12:07:04.17');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,10,'jpickering','2016-12-25 12:07:09.909',NULL,FALSE,2121892,'2016-12-25 12:07:09.91');

DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
RETURN 1;
END;
$$ LANGUAGE plpgsql;

SELECT puredupe();

SELECT plan(1);
--Should return two values
SELECT results_eq( $$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status,group_count,total_groups
FROM view_duplicates('XOivy2uDpMF','2016Q3',FALSE,50,1,'RESULTS', 'PURE' ) $$,
$$ VALUES ('IHuZkWbFwNK'::character varying (11),'uUZqgHNWKD7'::character varying (11),'HllvX50cXC0'::character varying (11),'5'::character varying (50000),'UNRESOLVED'::character varying(50),1::integer,1::integer),
('IHuZkWbFwNK'::character varying (11),'uUZqgHNWKD7'::character varying (11),'HllvX50cXC0'::character varying (11),'10'::character varying (50000),'UNRESOLVED'::character varying (50),1::integer,1::integer) $$);
SELECT * FROM finish();
ROLLBACK;

BEGIN;
SELECT plan(1);
--Valid but wrong quarter. Should return nothing
SELECT is_empty( $$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','2016Q4',FALSE,50,1,'RESULTS', 'PURE' ) $$,'Valid but wrong quarter. Should return nothing');
SELECT * FROM finish();
ROLLBACK;

BEGIN;
SELECT plan(1);
--Valid but OU. Should return nothing
SELECT is_empty( $$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('iD2i0aynOGm','2016Q4',FALSE,50,1,'RESULTS', 'PURE' ) $$,'Valid but wrong OU. Should return nothing');
SELECT * FROM finish();
ROLLBACK;

BEGIN;
SELECT plan(1);
--Valid but wrong dedupe type
SELECT is_empty( $$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','2016Q4',FALSE,50,1,'RESULTS', 'CROSSWALK' ) $$,'Valid but wrong dedupe type. Should return nothing');
SELECT * FROM finish();
ROLLBACK;

BEGIN;
SELECT plan(1);
--Valid but wrong dataset type
SELECT is_empty( $$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','2016Q4',FALSE,50,1,'TARGETS', 'PURE' ) $$,'Valid but wrong dataset type. Should return nothing');
SELECT * FROM finish();
ROLLBACK;


BEGIN;
--Helper function for creation of a pure dupe has two values, but one of which is zero. Not  a real dupe.
CREATE OR REPLACE FUNCTION puredupe_zero() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,5,'jpickering','2016-12-25 12:07:04.168',NULL,FALSE,2121684,'2016-12-25 12:07:04.17');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,0,'jpickering','2016-12-25 12:07:09.909',NULL,FALSE,2121892,'2016-12-25 12:07:09.91');
DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
RETURN 1;
END;
$$ LANGUAGE plpgsql;

SELECT puredupe_zero();

SELECT plan(1);
--Should return empty
SELECT is_empty( $$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','2016Q3',FALSE,50,1,'RESULTS', 'PURE' ) $$,'Not a real dupe. Should return nothing.');
SELECT * FROM finish();
ROLLBACK;


BEGIN;
--Helper function for creation of a pure dupe which is resolved
CREATE OR REPLACE FUNCTION puredupe_resolved() RETURNS integer AS $$
BEGIN
TRUNCATE datavalue;
TRUNCATE datavalueaudit;
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,5,'jpickering','2016-12-25 12:07:04.168',NULL,FALSE,2121684,'2016-12-25 12:07:04.17');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,10,'jpickering','2016-12-25 12:07:09.909',NULL,FALSE,2121892,'2016-12-25 12:07:09.91');
INSERT INTO datavalue VALUES(2192705,21351215,2138647,15,-5,'jpickering','2016-12-27 11:18:14.066',NULL,FALSE,2210817,'2016-12-27 11:18:14.068');
DROP TABLE IF EXISTS dedupetests;
CREATE TABLE dedupetests as TABLE datavalue;
RETURN 1;
END;
$$ LANGUAGE plpgsql;

SELECT puredupe_resolved();

SELECT plan(1);
--Should return two values
SELECT results_eq( $$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status,group_count,total_groups
FROM view_duplicates('XOivy2uDpMF','2016Q3',TRUE,50,1,'RESULTS', 'PURE' ) $$,
$$ VALUES ('IHuZkWbFwNK'::character varying (11),'uUZqgHNWKD7'::character varying (11),'HllvX50cXC0'::character varying (11),'5'::character varying (50000),'RESOLVED'::character varying(50),1::integer,1::integer),
('IHuZkWbFwNK'::character varying (11),'uUZqgHNWKD7'::character varying (11),'HllvX50cXC0'::character varying (11),'10'::character varying (50000),'RESOLVED'::character varying (50),1::integer,1::integer),
('IHuZkWbFwNK'::character varying (11),'uUZqgHNWKD7'::character varying (11),'HllvX50cXC0'::character varying (11),'-5'::character varying (50000),'RESOLVED'::character varying(50),1::integer,1::integer) $$);
SELECT * FROM finish();
ROLLBACK;

BEGIN;
SELECT plan(1);
--Resolved dupe should not be returned
SELECT is_empty( $$ SELECT ou_uid,de_uid,coc_uid,value,duplicate_status 
FROM view_duplicates('XOivy2uDpMF','2016Q3',FALSE,50,1,'RESULTS', 'PURE' ) $$,'Already resolved. Should return nothing.');
SELECT * FROM finish();
ROLLBACK;


