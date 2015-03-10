#Global database connection
require(RPostgreSQL)
require(dplyr)
dbUserName="***"
dbPassword="****"
dbName="****"
dbPort=5432
dbHost="localhost"
con <- dbConnect(PostgreSQL(), user= dbUserName, password=dbPassword,host=dbHost, port=dbPort,dbname=dbName)


#Get datasets for dedupe
ds<-dbGetQuery(con,"SELECT datasetid,uid as ds_uid,name as dataset_name FROM dataset where name ~'MER' and name !~'Narratives' and name !~'DoD' and name !~'LEGACY'")
ds$ds_type<-"RESULTS"
ds$ds_type[grepl('Targets',ds$dataset_name)]<-"TARGETS"

#Get a datasets-dataelement map
des<-dbGetQuery(con,"SELECT dataelementid, uid as de_uid,name as dataelement_name from dataelement;")
foo<-dbGetQuery(con,"SELECT * FROM datasetmembers")

des<-merge(des,foo,by="dataelementid")
des<-merge(des,ds,by="datasetid")

des<-unique(select(des,de_uid,dataelement_name,ds_type))

des$de_type[grepl("\\(.*DSD.*\\)",des$dataelement_name)]<-"DSD"
des$de_type[grepl("\\(.*TA.*\\)",des$dataelement_name)]<-"TA"
des$de_type[grepl("\\(.+DSD/TA.+\\)",des$dataelement_name)]<-"UNKNOWN"
des.dsd<-des[des$de_type=="DSD" & !is.na(des$de_type),]
des.ta<-des[des$de_type=="TA" & !is.na(des$de_type),]
des.dsd$match_name<-gsub("DSD[,]*","",des.dsd$dataelement_name)
names(des.dsd)<-paste0("dsd_",names(des.dsd))
des.ta$match_name<-gsub("TA[,]*","",des.ta$dataelement_name)
names(des.ta)<-paste0("ta_",names(des.ta))

dsd.ta.crosswalk<-merge(des.dsd,des.ta,by.x="dsd_match_name",by.y="ta_match_name")
dsd.ta.crosswalk<-unique(select(dsd.ta.crosswalk,dsd_de_uid,dsd_dataelement_name,ta_de_uid,ta_dataelement_name))

sql<-"CREATE TABLE _table_dsd_ta_crosswalk_map (dsd_de_uid character varying(11),ta_de_uid character varying(11)); "
foo<-paste("INSERT INTO _table_dsd_ta_crosswalk_map VALUES('", dsd.ta.crosswalk$dsd_de_uid, "','",dsd.ta.crosswalk$ta_de_uid,"');",sep="",collapse="\r\n")
sql<-paste0(sql,foo)
cat(sql,file="create_dsd_ta_crosswalk.sql")
