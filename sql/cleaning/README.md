1) Execute create_datavalueaudit_deups.sql script, which will create a new table for holding "bad" dedupes. This may be a temporary table, which will later be removed. 

2) Execute remove_bad_duplicate_adjustments.sql script. This will create a function which can be executed with "SELECT resolve_bad_duplication_adjustments();". This should likely be tied to a cron job shell script. Successful execution of the script will result in return of an integer (1). 
