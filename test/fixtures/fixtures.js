(function () {
    var fixtures = {

        organisationUnits: {"organisationUnits":[{"id":"W73PRZcjFIU","created":"2014-09-29T16:51:27.873+0000","name":"Indonesia","lastUpdated":"2014-11-19T19:44:27.619+0000","code":"ID","href":"http://localhost:8080/dhis/api/organisationUnits/W73PRZcjFIU"},{"id":"PqlFzhuPcF1","created":"2014-02-18T06:43:59.199+0000","name":"Nigeria","lastUpdated":"2014-11-19T19:30:37.859+0000","code":"NG","href":"http://localhost:8080/dhis/api/organisationUnits/PqlFzhuPcF1"},{"id":"CZ9ysPg2dSk","created":"2014-09-29T16:47:12.410+0000","name":"China","lastUpdated":"2014-11-19T19:43:55.182+0000","code":"CN","href":"http://localhost:8080/dhis/api/organisationUnits/CZ9ysPg2dSk"},{"id":"cl7jVQOW3Ks","created":"2014-09-29T16:56:35.880+0000","name":"Papua New Guinea","lastUpdated":"2014-11-19T19:44:41.144+0000","code":"PG","href":"http://localhost:8080/dhis/api/organisationUnits/cl7jVQOW3Ks"},{"id":"ANN4YCOufcP","created":"2014-09-29T16:47:53.148+0000","name":"Democratic Republic of the Congo","lastUpdated":"2014-11-20T03:00:24.791+0000","code":"CD","href":"http://localhost:8080/dhis/api/organisationUnits/ANN4YCOufcP"},{"id":"a71G4Gtcttv","created":"2014-02-18T06:44:21.494+0000","name":"Zimbabwe","lastUpdated":"2014-11-20T03:00:51.444+0000","code":"ZW","href":"http://localhost:8080/dhis/api/organisationUnits/a71G4Gtcttv"},{"id":"mdXu6iCbn2G","created":"2014-09-29T16:59:31.687+0000","name":"Tanzania","lastUpdated":"2014-11-20T02:59:57.830+0000","code":"TZ","href":"http://localhost:8080/dhis/api/organisationUnits/mdXu6iCbn2G"},{"id":"y3zhsvdXlhN","created":"2014-09-29T16:49:55.628+0000","name":"Ghana","lastUpdated":"2014-11-19T19:29:23.460+0000","code":"GH","href":"http://localhost:8080/dhis/api/organisationUnits/y3zhsvdXlhN"},{"id":"h11OyvlPxpJ","created":"2014-02-18T06:43:33.680+0000","name":"Mozambique","lastUpdated":"2014-11-19T19:30:09.899+0000","code":"MZ","href":"http://localhost:8080/dhis/api/organisationUnits/h11OyvlPxpJ"},{"id":"V0qMZH29CtN","created":"2014-09-29T16:59:06.478+0000","name":"Swaziland","lastUpdated":"2014-11-21T09:03:34.037+0000","code":"SZ","href":"http://localhost:8080/dhis/api/organisationUnits/V0qMZH29CtN"},{"id":"JTypsdEUNPw","created":"2014-09-29T16:50:36.286+0000","name":"Haiti","lastUpdated":"2014-11-19T19:35:00.887+0000","code":"HT","href":"http://localhost:8080/dhis/api/organisationUnits/JTypsdEUNPw"},{"id":"iD2i0aynOGm","created":"2014-09-29T16:44:28.491+0000","name":"Asia Regional Program","lastUpdated":"2014-11-19T19:42:17.514+0000","code":"AS","href":"http://localhost:8080/dhis/api/organisationUnits/iD2i0aynOGm"},{"id":"XtxUYCsDWrR","created":"2014-02-18T06:43:03.335+0000","name":"Rwanda","lastUpdated":"2014-11-26T22:41:35.298+0000","code":"RW","href":"http://localhost:8080/dhis/api/organisationUnits/XtxUYCsDWrR"},{"id":"FFVkaV9Zk1S","created":"2014-02-18T06:43:14.510+0000","name":"Namibia","lastUpdated":"2014-11-19T19:30:27.346+0000","code":"NA","href":"http://localhost:8080/dhis/api/organisationUnits/FFVkaV9Zk1S"},{"id":"IH1kchw86uA","created":"2014-09-29T16:48:36.042+0000","name":"Ethiopia","lastUpdated":"2014-11-20T03:00:19.124+0000","code":"ET","href":"http://localhost:8080/dhis/api/organisationUnits/IH1kchw86uA"},{"id":"ds0ADyc9UCU","created":"2014-09-29T16:47:14.868+0000","name":"Cote d'Ivoire","lastUpdated":"2014-11-19T19:28:45.763+0000","code":"CI","href":"http://localhost:8080/dhis/api/organisationUnits/ds0ADyc9UCU"},{"id":"PeOHqAwdtez","created":"2014-09-29T16:50:18.011+0000","name":"Guyana","lastUpdated":"2014-11-20T03:00:00.811+0000","code":"GY","href":"http://localhost:8080/dhis/api/organisationUnits/PeOHqAwdtez"},{"id":"qllxzIjjurr","created":"2014-09-29T16:52:58.090+0000","name":"Lesotho","lastUpdated":"2014-11-20T03:00:32.122+0000","code":"LS","href":"http://localhost:8080/dhis/api/organisationUnits/qllxzIjjurr"},{"id":"YM6xn5QxNpY","created":"2014-09-11T22:37:26.760+0000","name":"Vietnam","lastUpdated":"2014-11-20T03:00:34.981+0000","code":"VN","href":"http://localhost:8080/dhis/api/organisationUnits/YM6xn5QxNpY"},{"id":"FETQ6OmnsKB","created":"2014-02-18T06:42:55.569+0000","name":"Uganda","lastUpdated":"2014-11-20T14:23:00.372+0000","code":"UG","href":"http://localhost:8080/dhis/api/organisationUnits/FETQ6OmnsKB"},{"id":"NzelIFhEv3C","created":"2014-09-29T16:48:16.405+0000","name":"Dominican Republic","lastUpdated":"2014-11-20T03:00:47.978+0000","code":"DR","href":"http://localhost:8080/dhis/api/organisationUnits/NzelIFhEv3C"},{"id":"Qh4XMQJhbk8","created":"2014-09-29T16:45:28.378+0000","name":"Burundi","lastUpdated":"2014-11-20T02:59:49.576+0000","code":"BI","href":"http://localhost:8080/dhis/api/organisationUnits/Qh4XMQJhbk8"},{"id":"vSu0nPMbq7b","created":"2014-09-29T16:46:32.557+0000","name":"Central America Region","lastUpdated":"2014-11-19T19:34:12.213+0000","code":"CE","href":"http://localhost:8080/dhis/api/organisationUnits/vSu0nPMbq7b"},{"id":"XWZK2nop7pM","created":"2014-09-29T16:45:39.189+0000","name":"Cambodia","lastUpdated":"2014-11-19T19:43:31.512+0000","code":"KH","href":"http://localhost:8080/dhis/api/organisationUnits/XWZK2nop7pM"},{"id":"wChmwjpXOw2","created":"2014-09-29T16:45:23.077+0000","name":"Burma","lastUpdated":"2014-11-19T19:43:07.887+0000","code":"MM","href":"http://localhost:8080/dhis/api/organisationUnits/wChmwjpXOw2"},{"id":"t25400wXrNB","created":"2014-09-29T16:46:55.860+0000","name":"Central Asia Region","lastUpdated":"2014-11-19T19:43:45.823+0000","code":"AC","href":"http://localhost:8080/dhis/api/organisationUnits/t25400wXrNB"},{"id":"ligZVIYs2rL","created":"2014-09-29T17:02:07.138+0000","name":"Ukraine","lastUpdated":"2014-11-19T20:53:40.855+0000","code":"UA","href":"http://localhost:8080/dhis/api/organisationUnits/ligZVIYs2rL"},{"id":"lZsCb6y0KDX","created":"2013-06-10T04:34:22.000+0000","name":"Malawi","lastUpdated":"2014-11-19T19:29:59.290+0000","code":"MW","href":"http://localhost:8080/dhis/api/organisationUnits/lZsCb6y0KDX"},{"id":"l1KFEXKI4Dg","created":"2014-02-18T06:44:11.821+0000","name":"Botswana","lastUpdated":"2014-11-20T03:00:37.815+0000","code":"BW","href":"http://localhost:8080/dhis/api/organisationUnits/l1KFEXKI4Dg"},{"id":"f5RoebaDLMx","created":"2014-02-18T06:43:52.854+0000","name":"Zambia","lastUpdated":"2014-11-19T19:31:45.824+0000","code":"ZM","href":"http://localhost:8080/dhis/api/organisationUnits/f5RoebaDLMx"},{"id":"cDGPF739ZZr","created":"2014-02-18T06:43:08.843+0000","name":"South Africa","lastUpdated":"2014-11-19T19:30:59.557+0000","code":"ZA","href":"http://localhost:8080/dhis/api/organisationUnits/cDGPF739ZZr"},{"id":"bQQJe0cC1eD","created":"2014-09-29T16:45:49.289+0000","name":"Cameroon","lastUpdated":"2014-11-20T02:59:41.480+0000","code":"CM","href":"http://localhost:8080/dhis/api/organisationUnits/bQQJe0cC1eD"},{"id":"HfVjCurKxh2","created":"2013-03-14T05:25:38.231+0000","name":"Kenya","lastUpdated":"2014-11-20T03:00:03.833+0000","code":"KE","href":"http://localhost:8080/dhis/api/organisationUnits/HfVjCurKxh2"},{"id":"XOivy2uDpMF","created":"2014-09-29T16:44:12.521+0000","name":"Angola","lastUpdated":"2014-11-19T19:23:39.554+0000","code":"AO","href":"http://localhost:8080/dhis/api/organisationUnits/XOivy2uDpMF"},{"id":"WLG0z5NxQs8","created":"2014-09-29T16:58:51.573+0000","name":"South Sudan","lastUpdated":"2014-11-19T19:31:09.051+0000","code":"SS","href":"http://localhost:8080/dhis/api/organisationUnits/WLG0z5NxQs8"},{"id":"skj3e4YSiJY","created":"2014-09-29T16:51:08.754+0000","name":"India","lastUpdated":"2014-11-19T19:44:03.744+0000","code":"IN","href":"http://localhost:8080/dhis/api/organisationUnits/skj3e4YSiJY"},{"id":"nBo9Y4yZubB","created":"2014-09-29T16:46:04.353+0000","name":"Caribbean Region","lastUpdated":"2014-11-19T19:34:04.011+0000","code":"CB","href":"http://localhost:8080/dhis/api/organisationUnits/nBo9Y4yZubB"}]},
        generatedPeriods: [{"startDate":"2014-04-01","endDate":"2015-03-31","name":"April 2014 - March 2015","id":"FinancialApril_2014-04-01","iso":"2014April","_startDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2014,"_month":4,"_day":1},"_endDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2015,"_month":3,"_day":31},"$$hashKey":"object:11"},{"startDate":"2013-04-01","endDate":"2014-03-31","name":"April 2013 - March 2014","id":"FinancialApril_2013-04-01","iso":"2013April","_startDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2013,"_month":4,"_day":1},"_endDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2014,"_month":3,"_day":31},"$$hashKey":"object:12"},{"startDate":"2012-04-01","endDate":"2013-03-31","name":"April 2012 - March 2013","id":"FinancialApril_2012-04-01","iso":"2012April","_startDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2012,"_month":4,"_day":1},"_endDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2013,"_month":3,"_day":31},"$$hashKey":"object:13"},{"startDate":"2011-04-01","endDate":"2012-03-31","name":"April 2011 - March 2012","id":"FinancialApril_2011-04-01","iso":"2011April","_startDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2011,"_month":4,"_day":1},"_endDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2012,"_month":3,"_day":31},"$$hashKey":"object:14"},{"startDate":"2010-04-01","endDate":"2011-03-31","name":"April 2010 - March 2011","id":"FinancialApril_2010-04-01","iso":"2010April","_startDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2010,"_month":4,"_day":1},"_endDate":{"_calendar":{"local":{"name":"Gregorian","epochs":["BCE","CE"],"monthNames":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthNamesShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"dayNames":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"dayNamesShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"dayNamesMin":["Su","Mo","Tu","We","Th","Fr","Sa"],"dateFormat":"mm/dd/yyyy","firstDay":0,"isRTL":false},"_validateLevel":0},"_year":2011,"_month":3,"_day":31},"$$hashKey":"object:15"}],

        dedupe: {
            "title": "DEDUPLICATION_Demoland",
            "headers": [{
                "name": "oulevel2_name",
                "column": "oulevel2_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel3_name",
                "column": "oulevel3_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel4_name",
                "column": "oulevel4_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel5_name",
                "column": "oulevel5_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "orgunit_name",
                "column": "orgunit_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "orgunit_level",
                "column": "orgunit_level",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "iso_period",
                "column": "iso_period",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "dataelement",
                "column": "dataelement",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "disaggregation",
                "column": "disaggregation",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "agency",
                "column": "agency",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "mechanism",
                "column": "mechanism",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "partner",
                "column": "partner",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "value",
                "column": "value",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "duplicate_type",
                "column": "duplicate_type",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "duplicate_status",
                "column": "duplicate_status",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "ou_uid",
                "column": "ou_uid",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "de_uid",
                "column": "de_uid",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "coc_uid",
                "column": "coc_uid",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {"name": "group_id", "column": "group_id", "type": "java.lang.String", "hidden": false, "meta": false}],
            "rows": [
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(1002 Demoland USAID Cardinal IM)", "Demoland Cardinal IP", "23", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "K6f6jR0NOcZ", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "2500", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "K6f6jR0NOcZ", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "900", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "OuudMtJsh2z", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "100", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "OuudMtJsh2z", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "100", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "OuudMtJsh2z", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "11", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "TbYpjxM5j6w", "dd978a42a0fa04a0441e88bac3e394b8"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "3", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "TbYpjxM5j6w", "dd978a42a0fa04a0441e88bac3e394b8"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "22", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "m8x88iYhmwQ", "eda63f5fa49d669f665172b4ffdab8bd"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "30", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "m8x88iYhmwQ", "eda63f5fa49d669f665172b4ffdab8bd"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(<15, Female)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "12", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "fut2YHUHJWD", "846695851799a4e285d554399e12ce32"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(<15, Female)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "10", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "fut2YHUHJWD", "846695851799a4e285d554399e12ce32"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(<15, Male)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "23", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "NN3gA5T8q1g", "665b83bbeac727a52dde7ace81962477"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(<15, Male)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "20", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "NN3gA5T8q1g", "665b83bbeac727a52dde7ace81962477"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_NEW (N, DSD): New on ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "120", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "tG7ocyZ8kVA", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_NEW (N, DSD): New on ART", "(default)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "333", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "tG7ocyZ8kVA", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_NEW (N, DSD): New on ART", "(default)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "30", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "tG7ocyZ8kVA", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_RET (D, DSD): Total Initiated ART in 12 mo.", "(default)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "90", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "XU4vM2XkDqP", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_RET (D, DSD): Total Initiated ART in 12 mo.", "(default)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "33", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "XU4vM2XkDqP", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_RET (N, DSD): Alive at 12 mo. after initiating ART", "(default)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "80", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "Y3s0CtjmmYd", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_RET (N, DSD): Alive at 12 mo. after initiating ART", "(default)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "32", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "Y3s0CtjmmYd", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(1002 Demoland USAID Cardinal IM)", "Demoland Cardinal IP", "23", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "qeS0bazg6IW", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "500", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "qeS0bazg6IW", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "", "(default)", "", "2000", "DISCORDANT", "UNRESOLVED", "HfiOUYEPgLK", "qeS0bazg6IW", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "900", "CONCORDANT", "UNRESOLVED", "RQCy4nM3afc", "OuudMtJsh2z", "HllvX50cXC0", "2d55e17f27d5efd5046ebd49a13a29cb"],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "HHS/CDC", "(2024 Demoland CDC Moth IM)", "Demoland Moth IP", "900", "CONCORDANT", "UNRESOLVED", "RQCy4nM3afc", "OuudMtJsh2z", "HllvX50cXC0", "2d55e17f27d5efd5046ebd49a13a29cb"],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "450", "CONCORDANT", "UNRESOLVED", "RQCy4nM3afc", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "db17c39b4bee013c3b863d1adb478c97"],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "", "(4015 Demoland Peace Corps Noodle IM)", "U.S. Peace Corps", "450", "CONCORDANT", "UNRESOLVED", "RQCy4nM3afc", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "db17c39b4bee013c3b863d1adb478c97"],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "350", "CONCORDANT", "UNRESOLVED", "RQCy4nM3afc", "H9Q2jDZ76ih", "O2eX2ntFKqm", "c457efe31b686a2a2ec9f9a7cba27534"],
                ["Animal Region", "Bird District", "Crow Site", "", "Crow Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "", "(4029 Demoland Peace Corps Taffy IM)", "U.S. Peace Corps", "350", "CONCORDANT", "UNRESOLVED", "RQCy4nM3afc", "H9Q2jDZ76ih", "O2eX2ntFKqm", "c457efe31b686a2a2ec9f9a7cba27534"],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "HHS/CDC", "(2003 Demoland CDC Dalmatian IM)", "Demoland Dalmatian IP", "1200", "CONCORDANT", "UNRESOLVED", "qAjEo5sOF2g", "OuudMtJsh2z", "HllvX50cXC0", "7b97cd79174c50842218bdf54c0c6450"],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "1200", "CONCORDANT", "UNRESOLVED", "qAjEo5sOF2g", "OuudMtJsh2z", "HllvX50cXC0", "7b97cd79174c50842218bdf54c0c6450"],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(1028 Demoland USAID Dory IM)", "Demoland Dory IP", "1200", "CONCORDANT", "UNRESOLVED", "qAjEo5sOF2g", "OuudMtJsh2z", "HllvX50cXC0", "7b97cd79174c50842218bdf54c0c6450"],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(1027 Demoland USAID Carp IM)", "Demoland Carp IP", "600", "CONCORDANT", "UNRESOLVED", "qAjEo5sOF2g", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "58d0498e61c27e55f1f7fcc93c5309d5"],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "DOD", "(3022 Demoland DOD Cherry IM)", "Demoland Cherry IP", "600", "CONCORDANT", "UNRESOLVED", "qAjEo5sOF2g", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "58d0498e61c27e55f1f7fcc93c5309d5"],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "600", "CONCORDANT", "UNRESOLVED", "qAjEo5sOF2g", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "58d0498e61c27e55f1f7fcc93c5309d5"],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "455", "CONCORDANT", "UNRESOLVED", "qAjEo5sOF2g", "H9Q2jDZ76ih", "O2eX2ntFKqm", "c32f3b9f896a634a2b157bbfc0df530e"],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "HHS/CDC", "(2015 Demoland CDC Greyhound IM)", "Demoland Greyhound IP", "455", "CONCORDANT", "UNRESOLVED", "qAjEo5sOF2g", "H9Q2jDZ76ih", "O2eX2ntFKqm", "c32f3b9f896a634a2b157bbfc0df530e"],
                ["Animal Region", "Bird District", "Hawk Site", "", "Hawk Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "", "(4008 Demoland Peace Corps Ravioli IM)", "U.S. Peace Corps", "455", "CONCORDANT", "UNRESOLVED", "qAjEo5sOF2g", "H9Q2jDZ76ih", "O2eX2ntFKqm", "c32f3b9f896a634a2b157bbfc0df530e"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "1000", "DISCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "K6f6jR0NOcZ", "HllvX50cXC0", "aff6ccc709ad5a6d193695d66d55bac2"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(1003 Demoland USAID Ostrich IM)", "Demoland Ostrich IP", "555", "DISCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "K6f6jR0NOcZ", "HllvX50cXC0", "aff6ccc709ad5a6d193695d66d55bac2"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "", "(default)", "", "11", "DISCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "K6f6jR0NOcZ", "HllvX50cXC0", "aff6ccc709ad5a6d193695d66d55bac2"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "DOD", "(3004 Demoland DOD Broccoli IM)", "Demoland Broccoli IP", "300", "DISCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "OuudMtJsh2z", "HllvX50cXC0", "aff6ccc709ad5a6d193695d66d55bac2"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "300", "DISCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "OuudMtJsh2z", "HllvX50cXC0", "aff6ccc709ad5a6d193695d66d55bac2"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "HHS/CDC", "(2018 Demoland CDC Beetle IM)", "Demoland Beetle IP", "150", "CONCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "3dc0fad971eab8cbe41711b742487862"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "150", "CONCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "3dc0fad971eab8cbe41711b742487862"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "110", "CONCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "H9Q2jDZ76ih", "O2eX2ntFKqm", "3c6505a179b3fabcd40dcb345b87666b"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "HHS/CDC", "(2006 Demoland CDC Hound IM)", "Demoland Hound IP", "110", "CONCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "H9Q2jDZ76ih", "O2eX2ntFKqm", "3c6505a179b3fabcd40dcb345b87666b"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "300", "DISCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "qeS0bazg6IW", "HllvX50cXC0", "aff6ccc709ad5a6d193695d66d55bac2"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(1003 Demoland USAID Ostrich IM)", "Demoland Ostrich IP", "777", "DISCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "qeS0bazg6IW", "HllvX50cXC0", "aff6ccc709ad5a6d193695d66d55bac2"],
                ["Animal Region", "Bird District", "Ostrich Site", "", "Ostrich Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "", "(default)", "", "33", "DISCORDANT", "UNRESOLVED", "N4TfJIX2bNK", "qeS0bazg6IW", "HllvX50cXC0", "aff6ccc709ad5a6d193695d66d55bac2"],
                ["Animal Region", "Bird District", "Partirdge Site", "", "Partirdge Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "550", "DISCORDANT", "UNRESOLVED", "nzuw7Ts0XLd", "K6f6jR0NOcZ", "HllvX50cXC0", "17b0314c91f4882f09cc2a5992049cfe"],
                ["Animal Region", "Bird District", "Partirdge Site", "", "Partirdge Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(1011 Demoland USAID Partirdge IM)", "Demoland Partirdge IP", "18", "DISCORDANT", "UNRESOLVED", "nzuw7Ts0XLd", "K6f6jR0NOcZ", "HllvX50cXC0", "17b0314c91f4882f09cc2a5992049cfe"],
                ["Animal Region", "Bird District", "Partirdge Site", "", "Partirdge Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "100", "DISCORDANT", "UNRESOLVED", "nzuw7Ts0XLd", "qeS0bazg6IW", "HllvX50cXC0", "17b0314c91f4882f09cc2a5992049cfe"],
                ["Animal Region", "Bird District", "Partirdge Site", "", "Partirdge Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(1011 Demoland USAID Partirdge IM)", "Demoland Partirdge IP", "32", "DISCORDANT", "UNRESOLVED", "nzuw7Ts0XLd", "qeS0bazg6IW", "HllvX50cXC0", "17b0314c91f4882f09cc2a5992049cfe"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "125", "DISCORDANT", "UNRESOLVED", "G6e02IPl9om", "OuudMtJsh2z", "HllvX50cXC0", "d21bae94bdcd1f8d33b507d47e566de3"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "DOD", "(3030 Demoland DOD Durian IM)", "Demoland Durian IP", "125", "DISCORDANT", "UNRESOLVED", "G6e02IPl9om", "OuudMtJsh2z", "HllvX50cXC0", "d21bae94bdcd1f8d33b507d47e566de3"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "DOD", "(3021 Demoland DOD Lemon IM)", "Demoland Lemon IP", "40", "DISCORDANT", "UNRESOLVED", "G6e02IPl9om", "OuudMtJsh2z", "HllvX50cXC0", "d21bae94bdcd1f8d33b507d47e566de3"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "70", "DISCORDANT", "UNRESOLVED", "G6e02IPl9om", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "fa7cfe7364021cdb605cba1de321f1fe"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(1006 Demoland USAID Robin IM)", "Demoland Robin IP", "70", "DISCORDANT", "UNRESOLVED", "G6e02IPl9om", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "fa7cfe7364021cdb605cba1de321f1fe"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(1021 Demoland USAID Trout IM)", "Demoland Trout IP", "16", "DISCORDANT", "UNRESOLVED", "G6e02IPl9om", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "fa7cfe7364021cdb605cba1de321f1fe"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(1002 Demoland USAID Cardinal IM)", "Demoland Cardinal IP", "20", "DISCORDANT", "UNRESOLVED", "G6e02IPl9om", "H9Q2jDZ76ih", "O2eX2ntFKqm", "4210c148378cb93047c7743dca5f9013"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "40", "DISCORDANT", "UNRESOLVED", "G6e02IPl9om", "H9Q2jDZ76ih", "O2eX2ntFKqm", "4210c148378cb93047c7743dca5f9013"],
                ["Animal Region", "Bird District", "Robin Site", "", "Robin Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "DOD", "(3026 Demoland DOD Raspberry IM)", "Demoland Raspberry IP", "40", "DISCORDANT", "UNRESOLVED", "G6e02IPl9om", "H9Q2jDZ76ih", "O2eX2ntFKqm", "4210c148378cb93047c7743dca5f9013"],
                ["Animal Region", "Bird District", "Stork Site", "", "Stork Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "1000", "DISCORDANT", "UNRESOLVED", "HHwBVnPURNE", "K6f6jR0NOcZ", "HllvX50cXC0", "c941c9e9eaf39f49ec09ce87b2d2fcf1"],
                ["Animal Region", "Bird District", "Stork Site", "", "Stork Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(1013 Demoland USAID Stork IM)", "Demoland Stork IP", "2200", "DISCORDANT", "UNRESOLVED", "HHwBVnPURNE", "K6f6jR0NOcZ", "HllvX50cXC0", "c941c9e9eaf39f49ec09ce87b2d2fcf1"],
                ["Animal Region", "Bird District", "Stork Site", "", "Stork Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "800", "DISCORDANT", "UNRESOLVED", "HHwBVnPURNE", "qeS0bazg6IW", "HllvX50cXC0", "c941c9e9eaf39f49ec09ce87b2d2fcf1"],
                ["Animal Region", "Bird District", "Stork Site", "", "Stork Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(1013 Demoland USAID Stork IM)", "Demoland Stork IP", "93", "DISCORDANT", "UNRESOLVED", "HHwBVnPURNE", "qeS0bazg6IW", "HllvX50cXC0", "c941c9e9eaf39f49ec09ce87b2d2fcf1"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "5000", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "K6f6jR0NOcZ", "HllvX50cXC0", "ec0ee3f38eb210fe764fb5aa701e09d7"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "", "(default)", "", "543", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "K6f6jR0NOcZ", "HllvX50cXC0", "ec0ee3f38eb210fe764fb5aa701e09d7"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "HHS/CDC", "(2020 Demoland CDC Butterfly IM)", "Demoland Butterfly IP", "3600", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "OuudMtJsh2z", "HllvX50cXC0", "ec0ee3f38eb210fe764fb5aa701e09d7"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "1800", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "OuudMtJsh2z", "HllvX50cXC0", "ec0ee3f38eb210fe764fb5aa701e09d7"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "1000", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "fa06e643d2ef0a81fc2b21b5652a3753"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "HHS/CDC", "(2021 Demoland CDC Honeybee IM)", "Demoland Honeybee IP", "2000", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "H9Q2jDZ76ih", "Yxkz6j1sGN5", "fa06e643d2ef0a81fc2b21b5652a3753"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "650", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "H9Q2jDZ76ih", "O2eX2ntFKqm", "248a86ee8e7ec7ff785cd79a9b0b040a"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "HHS/CDC", "(2005 Demoland CDC Poodle IM)", "Demoland Poodle IP", "1300", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "H9Q2jDZ76ih", "O2eX2ntFKqm", "248a86ee8e7ec7ff785cd79a9b0b040a"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "3500", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "qeS0bazg6IW", "HllvX50cXC0", "ec0ee3f38eb210fe764fb5aa701e09d7"],
                ["Animal Region", "Bird District", "Woodpecker Site", "", "Woodpecker Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "", "(default)", "", "324", "DISCORDANT", "UNRESOLVED", "cmbkvwQCrxN", "qeS0bazg6IW", "HllvX50cXC0", "ec0ee3f38eb210fe764fb5aa701e09d7"],
                ["Animal Region", "Dog District", "Dalmatian Site", "", "Dalmatian Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "HHS/CDC", "(2003 Demoland CDC Dalmatian IM)", "Demoland Dalmatian IP", "8", "DISCORDANT", "UNRESOLVED", "oUdX2BkI0ur", "K6f6jR0NOcZ", "HllvX50cXC0", "c7408456a8b075eb80f26b3f0c955da1"],
                ["Animal Region", "Dog District", "Dalmatian Site", "", "Dalmatian Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "DOD", "(7777 Demoland DOD IM)", "Demoland Demoland DOD IP", "400", "DISCORDANT", "UNRESOLVED", "oUdX2BkI0ur", "K6f6jR0NOcZ", "HllvX50cXC0", "c7408456a8b075eb80f26b3f0c955da1"],
                ["Animal Region", "Dog District", "Dalmatian Site", "", "Dalmatian Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "HHS/CDC", "(2003 Demoland CDC Dalmatian IM)", "Demoland Dalmatian IP", "3", "DISCORDANT", "UNRESOLVED", "oUdX2BkI0ur", "qeS0bazg6IW", "HllvX50cXC0", "c7408456a8b075eb80f26b3f0c955da1"],
                ["Animal Region", "Dog District", "Dalmatian Site", "", "Dalmatian Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "DOD", "(7777 Demoland DOD IM)", "Demoland Demoland DOD IP", "200", "DISCORDANT", "UNRESOLVED", "oUdX2BkI0ur", "qeS0bazg6IW", "HllvX50cXC0", "c7408456a8b075eb80f26b3f0c955da1"],
                ["Animal Region", "Dog District", "Shih-Tzu Site", "", "Shih-Tzu Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "HHS/CDC", "(8888 Demoland CDC IM)", "Demoland Demoland CDC IP", "420", "DISCORDANT", "UNRESOLVED", "pNcQW9q1Gmz", "OuudMtJsh2z", "HllvX50cXC0", "83579147fa59819f29e412290025dce6"],
                ["Animal Region", "Dog District", "Shih-Tzu Site", "", "Shih-Tzu Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(1008 Demoland USAID Pigeon IM)", "Demoland Pigeon IP", "200", "DISCORDANT", "UNRESOLVED", "pNcQW9q1Gmz", "OuudMtJsh2z", "HllvX50cXC0", "83579147fa59819f29e412290025dce6"],
                ["Animal Region", "Fish District", "Carp Site", "", "Carp Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(1027 Demoland USAID Carp IM)", "Demoland Carp IP", "210", "DISCORDANT", "UNRESOLVED", "SLu9JjrZNVb", "K6f6jR0NOcZ", "HllvX50cXC0", "4bb06f6bef42e03105dc531e193948f0"],
                ["Animal Region", "Fish District", "Carp Site", "", "Carp Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "500", "DISCORDANT", "UNRESOLVED", "SLu9JjrZNVb", "K6f6jR0NOcZ", "HllvX50cXC0", "4bb06f6bef42e03105dc531e193948f0"],
                ["Animal Region", "Fish District", "", "", "Fish District", "5", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(1029 Demoland USAID Guppy IM)", "Demoland Guppy IP", "32", "DISCORDANT", "UNRESOLVED", "B5iyf6DXdIJ", "K6f6jR0NOcZ", "HllvX50cXC0", "273a7ef605ce3cd86c77ff73185c8a72"],
                ["Animal Region", "Fish District", "", "", "Fish District", "5", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "", "(6666 Demoland Peace Corps IM)", "U.S. Peace Corps", "9000", "DISCORDANT", "UNRESOLVED", "B5iyf6DXdIJ", "K6f6jR0NOcZ", "HllvX50cXC0", "273a7ef605ce3cd86c77ff73185c8a72"],
                ["Animal Region", "Fish District", "Salmon Site", "", "Salmon Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "300", "DISCORDANT", "UNRESOLVED", "MdHwNQcp0I9", "K6f6jR0NOcZ", "HllvX50cXC0", "3c2b5d37ff917f89708a02821c7aff04"],
                ["Animal Region", "Fish District", "Salmon Site", "", "Salmon Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(1026 Demoland USAID Salmon IM)", "Demoland Salmon IP", "121", "DISCORDANT", "UNRESOLVED", "MdHwNQcp0I9", "K6f6jR0NOcZ", "HllvX50cXC0", "3c2b5d37ff917f89708a02821c7aff04"],
                ["Animal Region", "Fish District", "Salmon Site", "", "Salmon Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "130", "DISCORDANT", "UNRESOLVED", "MdHwNQcp0I9", "qeS0bazg6IW", "HllvX50cXC0", "3c2b5d37ff917f89708a02821c7aff04"],
                ["Animal Region", "Fish District", "Salmon Site", "", "Salmon Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "USAID", "(1026 Demoland USAID Salmon IM)", "Demoland Salmon IP", "103", "DISCORDANT", "UNRESOLVED", "MdHwNQcp0I9", "qeS0bazg6IW", "HllvX50cXC0", "3c2b5d37ff917f89708a02821c7aff04"],
                ["Animal Region", "Fish District", "Shark Site", "", "Shark Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "HHS/CDC", "(8888 Demoland CDC IM)", "Demoland Demoland CDC IP", "1000", "DISCORDANT", "UNRESOLVED", "xV7zFfsR803", "K6f6jR0NOcZ", "HllvX50cXC0", "7131421c62830b7ff22af0326b7d7801"],
                ["Animal Region", "Fish District", "Shark Site", "", "Shark Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(1016 Demoland USAID Shark IM)", "Demoland Shark IP", "25", "DISCORDANT", "UNRESOLVED", "xV7zFfsR803", "K6f6jR0NOcZ", "HllvX50cXC0", "7131421c62830b7ff22af0326b7d7801"],
                ["Animal Region", "Fish District", "Shark Site", "", "Shark Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "", "(default)", "", "12", "DISCORDANT", "UNRESOLVED", "xV7zFfsR803", "K6f6jR0NOcZ", "HllvX50cXC0", "7131421c62830b7ff22af0326b7d7801"],
                ["Animal Region", "Fish District", "Shark Site", "", "Shark Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "HHS/CDC", "(8888 Demoland CDC IM)", "Demoland Demoland CDC IP", "900", "DISCORDANT", "UNRESOLVED", "xV7zFfsR803", "qeS0bazg6IW", "HllvX50cXC0", "7131421c62830b7ff22af0326b7d7801"],
                ["Animal Region", "Fish District", "Shark Site", "", "Shark Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "", "(default)", "", "25", "DISCORDANT", "UNRESOLVED", "xV7zFfsR803", "qeS0bazg6IW", "HllvX50cXC0", "7131421c62830b7ff22af0326b7d7801"],
                ["Animal Region", "Insect District", "Worm Site", "", "Worm Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "375", "DISCORDANT", "UNRESOLVED", "ixwjYOMeIZ4", "OuudMtJsh2z", "HllvX50cXC0", "3c4ad772963c3d6ad57a50ee5e8f0bfe"],
                ["Animal Region", "Insect District", "Worm Site", "", "Worm Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "HHS/CDC", "(2025 Demoland CDC Worm IM)", "Demoland Worm IP", "23", "DISCORDANT", "UNRESOLVED", "ixwjYOMeIZ4", "OuudMtJsh2z", "HllvX50cXC0", "3c4ad772963c3d6ad57a50ee5e8f0bfe"],
                ["Animal Region", "Insect District", "Worm Site", "", "Worm Site", "6", "2013Oct", "TX_NEW (N, DSD): New on ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "22", "DISCORDANT", "UNRESOLVED", "ixwjYOMeIZ4", "tG7ocyZ8kVA", "HllvX50cXC0", "3c4ad772963c3d6ad57a50ee5e8f0bfe"],
                ["Animal Region", "Insect District", "Worm Site", "", "Worm Site", "6", "2013Oct", "TX_NEW (N, DSD): New on ART", "(default)", "HHS/CDC", "(2025 Demoland CDC Worm IM)", "Demoland Worm IP", "60", "DISCORDANT", "UNRESOLVED", "ixwjYOMeIZ4", "tG7ocyZ8kVA", "HllvX50cXC0", "3c4ad772963c3d6ad57a50ee5e8f0bfe"],
                ["", "", "", "", "Demoland", "3", "2013Oct", "BS_COLL (N, TA): Blood Units Donated", "(default)", "USAID", "(1028 Demoland USAID Dory IM)", "Demoland Dory IP", "114", "DISCORDANT", "UNRESOLVED", "KKFzPM8LoXs", "ASaP3A4Y416", "HllvX50cXC0", "afcef7095828ad05ff593d21e336bbfe"],
                ["", "", "", "", "Demoland", "3", "2013Oct", "BS_COLL (N, TA): Blood Units Donated", "(default)", "USAID", "(1007 Demoland USAID Hawk IM)", "Demoland Hawk IP", "10", "DISCORDANT", "UNRESOLVED", "KKFzPM8LoXs", "ASaP3A4Y416", "HllvX50cXC0", "afcef7095828ad05ff593d21e336bbfe"],
                ["", "", "", "", "Demoland", "3", "2013Oct", "BS_COLL (N, TA): Blood Units Donated", "(default)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "12", "DISCORDANT", "UNRESOLVED", "KKFzPM8LoXs", "ASaP3A4Y416", "HllvX50cXC0", "afcef7095828ad05ff593d21e336bbfe"],
                ["", "", "", "", "Demoland", "3", "2013Oct", "BS_COLL (N, TA): Blood Units Donated", "(default)", "USAID", "(1001 Demoland USAID Parrot IM)", "Demoland Parrot IP", "123", "DISCORDANT", "UNRESOLVED", "KKFzPM8LoXs", "ASaP3A4Y416", "HllvX50cXC0", "afcef7095828ad05ff593d21e336bbfe"]
            ],
            "width": 19,
            "height": 104
        },

        smallerDedupe: {
            "title": "DEDUPLICATION_Demoland",
            "headers": [{
                "name": "oulevel3_name",
                "column": "oulevel3_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel4_name",
                "column": "oulevel4_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel5_name",
                "column": "oulevel5_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel6_name",
                "column": "oulevel6_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "orgunit_name",
                "column": "orgunit_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "orgunit_level",
                "column": "orgunit_level",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "iso_period",
                "column": "iso_period",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "dataelement",
                "column": "dataelement",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "disaggregation",
                "column": "disaggregation",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "agency",
                "column": "agency",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "mechanism",
                "column": "mechanism",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "partner",
                "column": "partner",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "value",
                "column": "value",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "duplicate_type",
                "column": "duplicate_type",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "duplicate_status",
                "column": "duplicate_status",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "ou_uid",
                "column": "ou_uid",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "de_uid",
                "column": "de_uid",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "coc_uid",
                "column": "coc_uid",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "group_id",
                "column": "group_id",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                name: "group_count",
                column: "group_count",
                type: "java.lang.String",
                hidden: false,
                meta: false
            }, {
                name: "total_groups",
                column: "total_groups",
                type: "java.lang.String",
                hidden: false,
                meta: false
            }, {
                name: "dataset_type",
                column: "dataset_type",
                type: "java.lang.String",
                hidden: false,
                meta: false
            }],
            "rows": [
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(1002 Demoland USAID Cardinal IM)", "Demoland Cardinal IP", "23", "CROSSWALK", "UNRESOLVED", "HfiOUYEPgLK", "K6f6jR0NOcZ", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629", "1", "243", "RESULTS"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "HTC_TST (N, DSD): HTC received results", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "2500", "CROSSWALK", "UNRESOLVED", "HfiOUYEPgLK", "K6f6jR0NOcZ", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "900", "CROSSWALK", "UNRESOLVED", "HfiOUYEPgLK", "OuudMtJsh2z", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "100", "CROSSWALK", "UNRESOLVED", "HfiOUYEPgLK", "OuudMtJsh2z", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "100", "CROSSWALK", "UNRESOLVED", "HfiOUYEPgLK", "OuudMtJsh2z", "HllvX50cXC0", "2364f5b15e57185fc6564ce64cc9c629"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "11", "PURE", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "TbYpjxM5j6w", "dd978a42a0fa04a0441e88bac3e394b8"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Female)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "3", "PURE", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "TbYpjxM5j6w", "dd978a42a0fa04a0441e88bac3e394b8"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "22", "PURE", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "m8x88iYhmwQ", "eda63f5fa49d669f665172b4ffdab8bd"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(15+, Male)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "30", "PURE", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "m8x88iYhmwQ", "eda63f5fa49d669f665172b4ffdab8bd"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(<15, Female)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "12", "PURE", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "fut2YHUHJWD", "846695851799a4e285d554399e12ce32"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(<15, Female)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "10", "PURE", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "fut2YHUHJWD", "846695851799a4e285d554399e12ce32"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(<15, Male)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "23", "PURE", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "NN3gA5T8q1g", "665b83bbeac727a52dde7ace81962477"],
                ["Animal Region", "Bird District", "Cardinal Site", "", "Cardinal Site", "6", "2013Oct", "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART", "(<15, Male)", "USAID", "(1030 Demoland USAID Perch IM)", "Demoland Perch IP", "20", "PURE", "UNRESOLVED", "HfiOUYEPgLK", "H9Q2jDZ76ih", "NN3gA5T8q1g", "665b83bbeac727a52dde7ace81962477"],
                ["Demoland", "", "", "", "Demoland", "3", "2013Oct", "BS_COLL (N, TA): Blood Units Donated", "(default)", "USAID", "(1028 Demoland USAID Dory IM)", "Demoland Dory IP", "114", "PURE", "UNRESOLVED", "KKFzPM8LoXs", "ASaP3A4Y416", "HllvX50cXC0", "afcef7095828ad05ff593d21e336bbfe"],
                ["Demoland", "", "", "", "Demoland", "3", "2013Oct", "BS_COLL (N, TA): Blood Units Donated", "(default)", "USAID", "(1007 Demoland USAID Hawk IM)", "Demoland Hawk IP", "10", "PURE", "UNRESOLVED", "KKFzPM8LoXs", "ASaP3A4Y416", "HllvX50cXC0", "afcef7095828ad05ff593d21e336bbfe"],
                ["Demoland", "", "", "", "Demoland", "3", "2013Oct", "BS_COLL (N, TA): Blood Units Donated", "(default)", "USAID", "(1009 Demoland USAID Owl IM)", "Demoland Owl IP", "12", "PURE", "UNRESOLVED", "KKFzPM8LoXs", "ASaP3A4Y416", "HllvX50cXC0", "afcef7095828ad05ff593d21e336bbfe"],
                ["Demoland", "", "", "", "Demoland", "3", "2013Oct", "BS_COLL (N, TA): Blood Units Donated", "(default)", "USAID", "(1001 Demoland USAID Parrot IM)", "Demoland Parrot IP", "123", "PURE", "UNRESOLVED", "KKFzPM8LoXs", "ASaP3A4Y416", "HllvX50cXC0", "afcef7095828ad05ff593d21e336bbfe"]
            ],
            "width": 22,
            "height": 17
        },

        dedupeRecords: [
            {
                "details": {
                    "orgUnitId": "HfiOUYEPgLK",
                    "orgUnitName": "Cardinal Site",
                    "timePeriodName": "2013Oct",
                    "dataElementId": "K6f6jR0NOcZ",
                    "dataElementName": "HTC_TST (N, DSD): HTC received results",
                    "categoryOptionComboId": "HllvX50cXC0",
                    "categoryOptionComboName": "(default)",
                    "type": "CROSSWALK"
                },
                "data": [
                    {
                        "agency": "USAID",
                        "partner": "Demoland Cardinal IP",
                        "value": 23
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Demoland USAID IP",
                        "value": 2500
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Demoland USAID IP",
                        "value": 900
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Owl IP",
                        "value": 100
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Perch IP",
                        "value": 100
                    }
                ],
                "resolve": {
                    "isResolved": true,
                    "type": "custom",
                    "value": 2023
                }
            },
            {
                "details": {
                    "orgUnitId": "HfiOUYEPgLK",
                    "orgUnitName": "Cardinal Site",
                    "timePeriodName": "2013Oct",
                    "dataElementId": "H9Q2jDZ76ih",
                    "dataElementName": "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART",
                    "categoryOptionComboId": "TbYpjxM5j6w",
                    "categoryOptionComboName": "(15+, Female)",
                    "type": "PURE"
                },
                "data": [
                    {
                        "agency": "USAID",
                        "partner": "Demoland Owl IP",
                        "value": 11
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Perch IP",
                        "value": 3
                    }
                ],
                "resolve": {
                    "isResolved": false
                }
            },
            {
                "details": {
                    "orgUnitId": "HfiOUYEPgLK",
                    "orgUnitName": "Cardinal Site",
                    "timePeriodName": "2013Oct",
                    "dataElementId": "H9Q2jDZ76ih",
                    "dataElementName": "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART",
                    "categoryOptionComboId": "m8x88iYhmwQ",
                    "categoryOptionComboName": "(15+, Male)",
                    "type": "PURE"
                },
                "data": [
                    {
                        "agency": "USAID",
                        "partner": "Demoland Owl IP",
                        "value": 22
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Perch IP",
                        "value": 30
                    }
                ],
                "resolve": {
                    "isResolved": false
                }
            },
            {
                "details": {
                    "orgUnitId": "HfiOUYEPgLK",
                    "orgUnitName": "Cardinal Site",
                    "timePeriodName": "2013Oct",
                    "dataElementId": "H9Q2jDZ76ih",
                    "dataElementName": "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART",
                    "categoryOptionComboId": "fut2YHUHJWD",
                    "categoryOptionComboName": "(<15, Female)"
                },
                "data": [
                    {
                        "agency": "USAID",
                        "partner": "Demoland Owl IP",
                        "value": 12
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Perch IP",
                        "value": 10
                    }
                ],
                "resolve": {
                    "isResolved": false
                }
            },
            {
                "details": {
                    "orgUnitId": "HfiOUYEPgLK",
                    "orgUnitName": "Cardinal Site",
                    "timePeriodName": "2013Oct",
                    "dataElementId": "H9Q2jDZ76ih",
                    "dataElementName": "TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART",
                    "categoryOptionComboId": "NN3gA5T8q1g",
                    "categoryOptionComboName": "(<15, Male)",
                    "type": "PURE"
                },
                "data": [
                    {
                        "agency": "USAID",
                        "partner": "Demoland Owl IP",
                        "value": 23
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Perch IP",
                        "value": 20
                    }
                ],
                "resolve": {
                    "isResolved": false
                }
            },
            {
                "details": {
                    "orgUnitId": "KKFzPM8LoXs",
                    "orgUnitName": "Demoland",
                    "timePeriodName": "2013Oct",
                    "dataElementId": "ASaP3A4Y416",
                    "dataElementName": "BS_COLL (N, TA): Blood Units Donated",
                    "categoryOptionComboId": "HllvX50cXC0",
                    "categoryOptionComboName": "(default)",
                    "type": "CROSSWALK"
                },
                "data": [
                    {
                        "agency": "USAID",
                        "partner": "Demoland Dory IP",
                        "value": 114
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Hawk IP",
                        "value": 10
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Owl IP",
                        "value": 12
                    },
                    {
                        "agency": "USAID",
                        "partner": "Demoland Parrot IP",
                        "value": 123
                    }
                ],
                "resolve": {
                    "isResolved": false
                }
            }
        ],

        importResponse: {"status":"SUCCESS","description":"Import process completed successfully","dataValueCount":{"imported":1,"updated":0,"ignored":0,"deleted":0},"importCount":{"imported":0,"updated":0,"ignored":0,"deleted":0},"dataSetComplete":"false"},

        resolvedDedupe: {
            "title": "DEDUPLICATION_Demoland",
            "headers": [{
                "name": "oulevel2_name",
                "column": "oulevel2_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel3_name",
                "column": "oulevel3_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel4_name",
                "column": "oulevel4_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "oulevel5_name",
                "column": "oulevel5_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "orgunit_name",
                "column": "orgunit_name",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "orgunit_level",
                "column": "orgunit_level",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "iso_period",
                "column": "iso_period",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "dataelement",
                "column": "dataelement",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "disaggregation",
                "column": "disaggregation",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "agency",
                "column": "agency",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "mechanism",
                "column": "mechanism",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "partner",
                "column": "partner",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "value",
                "column": "value",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "duplicate_type",
                "column": "duplicate_type",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "duplicate_status",
                "column": "duplicate_status",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "ou_uid",
                "column": "ou_uid",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "de_uid",
                "column": "de_uid",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {
                "name": "coc_uid",
                "column": "coc_uid",
                "type": "java.lang.String",
                "hidden": false,
                "meta": false
            }, {"name": "group_id", "column": "group_id", "type": "java.lang.String", "hidden": false, "meta": false}],
            "rows": [
                ["Animal Region","Bird District","Cardinal Site","","Cardinal Site","6","2013Oct","TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART","(15+, Female)","USAID","(1009 Demoland USAID Owl IM)","Demoland Owl IP","11","DISCORDANT","RESOLVED","HfiOUYEPgLK","H9Q2jDZ76ih","TbYpjxM5j6w","dd978a42a0fa04a0441e88bac3e394b8"],
                ["Animal Region","Bird District","Cardinal Site","","Cardinal Site","6","2013Oct","TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART","(15+, Female)","USAID","(1030 Demoland USAID Perch IM)","Demoland Perch IP","3","DISCORDANT","RESOLVED","HfiOUYEPgLK","H9Q2jDZ76ih","TbYpjxM5j6w","dd978a42a0fa04a0441e88bac3e394b8"],
                ["Animal Region","Bird District","Cardinal Site","","Cardinal Site","6","2013Oct","TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART","(15+, Female)","","(00000 De-duplication adjustment)","","-2","DISCORDANT","RESOLVED","HfiOUYEPgLK","H9Q2jDZ76ih","TbYpjxM5j6w","dd978a42a0fa04a0441e88bac3e394b8"],
                ["Animal Region", "Fish District", "Shark Site", "", "Shark Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "HHS/CDC", "(8888 Demoland CDC IM)", "Demoland Demoland CDC IP", "900", "DISCORDANT", "RESOLVED", "xV7zFfsR803", "qeS0bazg6IW", "HllvX50cXC0", "7131421c62830b7ff22af0326b7d7801"],
                ["Animal Region", "Fish District", "Shark Site", "", "Shark Site", "6", "2013Oct", "VMMC_CIRC (N, DSD): Voluntary Circumcised", "(default)", "", "(default)", "", "25", "DISCORDANT", "RESOLVED", "xV7zFfsR803", "qeS0bazg6IW", "HllvX50cXC0", "7131421c62830b7ff22af0326b7d7801"],
                ["Animal Region","Bird District","Cardinal Site","","Cardinal Site","6","2013Oct","TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART","(15+, Female)","","(00000 De-duplication adjustment)","","0","DISCORDANT","RESOLVED","xV7zFfsR803","qeS0bazg6IW","HllvX50cXC0","7131421c62830b7ff22af0326b7d7801"],
                ["Animal Region", "Insect District", "Worm Site", "", "Worm Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "USAID", "(9999 Demoland USAID IM)", "Demoland Demoland USAID IP", "375", "DISCORDANT", "RESOLVED", "ixwjYOMeIZ4", "OuudMtJsh2z", "HllvX50cXC0", "3c4ad772963c3d6ad57a50ee5e8f0bfe"],
                ["Animal Region", "Insect District", "Worm Site", "", "Worm Site", "6", "2013Oct", "TX_CURR (N, DSD): Receiving ART", "(default)", "HHS/CDC", "(2025 Demoland CDC Worm IM)", "Demoland Worm IP", "23", "DISCORDANT", "RESOLVED", "ixwjYOMeIZ4", "OuudMtJsh2z", "HllvX50cXC0", "3c4ad772963c3d6ad57a50ee5e8f0bfe"],
                ["Animal Region","Bird District","Cardinal Site","","Cardinal Site","6","2013Oct","TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART","(15+, Female)","","(00000 De-duplication adjustment)","","-23","DISCORDANT","RESOLVED","ixwjYOMeIZ4","OuudMtJsh2z","HllvX50cXC0","3c4ad772963c3d6ad57a50ee5e8f0bfe"]
            ],
            "width": 19,
            "height": 3
        }
    };

    window.fixtures = {
        get: function (fixtureName) {
            if (fixtures[fixtureName]) {
                return angular.copy(fixtures[fixtureName]);
            }
            throw new Error('Fixture named "' + fixtureName + '" does not exist');
        }
    };

}(window));
