CREATE  TABLE  datavalueaudit_dedupes
( datavalueaudit_dedupes_serialid integer NOT NULL ,
  dataelementid integer NOT NULL,
  periodid integer NOT NULL,
  sourceid integer NOT NULL,
  categoryoptioncomboid integer NOT NULL,
  value character varying(50000),
  storedby character varying(100),
  lastupdated timestamp without time zone,
  comment character varying(50000),
  followup boolean,
  attributeoptioncomboid integer NOT NULL,
  created timestamp without time zone,
  deleted_on date,
  CONSTRAINT datavalueaudit_dedupes_pkey PRIMARY KEY (datavalueaudit_dedupes_serialid)
) ;