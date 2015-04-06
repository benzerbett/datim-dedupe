#Global database connection
require(RPostgreSQL)
require(dplyr)
dbUserName="postgres"
dbPassword="postgres"
dbName="datim"
dbPort=5432
dbHost="localhost"
con <- dbConnect(PostgreSQL(), user= dbUserName, password=dbPassword,host=dbHost, port=dbPort,dbname=dbName)
#Get datasets for dedupe
ds<-dbGetQuery(con,"SELECT datasetid,uid as ds_uid,name as dataset_name 
               FROM dataset where name ~'MER' and name !~'Narratives' and name !~'DoD' and name !~'LEGACY'")
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
des.dsd$match_name<-str_replace_all(des.dsd$match_name," ","")
names(des.dsd)<-paste0("dsd_",names(des.dsd))
des.ta$match_name[grepl(" TA, ",des.ta$dataelement_name)]<-gsub(" TA, ","",des.ta$dataelement_name[grepl(" TA, ",des.ta$dataelement_name)])
des.ta$match_name[grepl("TA\\)",des.ta$dataelement_name)]<-gsub("TA\\)",")",des.ta$dataelement_name)[grepl("TA\\)",des.ta$dataelement_name)]
des.ta$match_name<-str_replace_all(des.ta$match_name," ","")
names(des.ta)<-paste0("ta_",names(des.ta))
dsd.ta.crosswalk<-merge(des.dsd,des.ta,by.x=c("dsd_match_name","dsd_ds_type"),by.y=c("ta_match_name","ta_ds_type"))
write.csv(dsd.ta.crosswalk,file="de_map.csv")
cat("DROP TABLE IF EXISTS dsd_ta_crosswalk;
    CREATE TABLE dsd_ta_crosswalk (dsd_de_uid character(11), ta_de_uid character(11));
    ",file="create_dsd_ta_crosswalk_table.sql",append=F)
for ( i in 1:nrow(dsd.ta.crosswalk) ) {
  
  foo<-paste0("INSERT INTO dsd_ta_crosswalk VALUES ('",dsd.ta.crosswalk$dsd_de_uid[i],"','",dsd.ta.crosswalk$ta_de_uid[i],"');\r\n")
  cat(foo,file="create_dsd_ta_crosswalk_table.sql",append=T)
  
}

cat("ALTER TABLE dsd_ta_crosswalk ADD COLUMN dsd_dataelementid integer;
    ALTER TABLE dsd_ta_crosswalk ADD COLUMN ta_dataelementid integer;
    UPDATE dsd_ta_crosswalk a set dsd_dataelementid = b.dataelementid from dataelement b where a.dsd_de_uid = b.uid;
    UPDATE dsd_ta_crosswalk a set ta_dataelementid = b. dataelementid from dataelement b where a.ta_de_uid = b.uid;
    ",file="create_dsd_ta_crosswalk_table.sql",append=T)

cat("SELECT * FROM (",file="create_dsd_ta_crosswalk_view.sql",append=F)
for (i in 1:nrow(dsd.ta.crosswalk)) {
sql<-paste0("SELECT '",dsd.ta.crosswalk$dsd_de_uid[i],"' as dsd_de_uid,
           (SELECT dataelementid from dataelement where uid ='",dsd.ta.crosswalk$dsd_de_uid[i],"') as dsd_dataelementid ,'",
          dsd.ta.crosswalk$ta_de_uid[i],"' as ta_de_uid, (SELECT dataelementid from dataelement where uid = '",dsd.ta.crosswalk$ta_de_uid[i],
           "') as ta_dataelementid from dataelement where uid = '",dsd.ta.crosswalk$dsd_de_uid[i],"'") 

cat(sql,file="create_dsd_ta_crosswalk_view.sql",append=T)

sql<-ifelse( i != nrow(dsd.ta.crosswalk),"\n UNION \n",") A;")
cat(sql,file="create_dsd_ta_crosswalk_view.sql",append=T)

}

