DROP TYPE IF EXISTS duplicate_records;

CREATE TYPE duplicate_records AS 
(oulevel3_name character varying(230)   ,
 oulevel4_name character varying(230)   ,
 oulevel5_name character varying(230)   ,
 oulevel6_name character varying(230)   ,
 ou_name  character varying(230)   ,
 dataelement   character varying(230)   ,
 disaggregation character varying(250)   ,
 agency character varying (250) ,
 mechanism character varying(250)   ,
 partner character varying(230)   ,
 value character varying(50000),
duplicate_status character varying(50),
ou_uid character varying (11),
de_uid character varying (11),
coc_uid character varying (11),
group_id character (32),
group_count integer,
total_groups integer,
dataset_type character varying(50) );
