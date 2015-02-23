# datim-dedupe
[![Build Status](https://travis-ci.org/dhis2/datim-dedupe.svg)](https://travis-ci.org/dhis2/datim-dedupe)
[![Coverage Status](https://coveralls.io/repos/dhis2/datim-dedupe/badge.svg)](https://coveralls.io/r/dhis2/datim-dedupe)
[![Code Climate](https://codeclimate.com/github/dhis2/datim-dedupe/badges/gpa.svg)](https://codeclimate.com/github/dhis2/datim-dedupe)

[![Dependency Status](https://www.versioneye.com/user/projects/54b7fc03fd43d3feab000146/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54b7fc03fd43d3feab000146)
[![Dependency Status](https://www.versioneye.com/user/projects/54b7fb06fd43d311050000a9/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54b7fb06fd43d311050000a9)

Deduplication app for DATIM

##Installing the app into your DHIS2

####Step 1: Create the sql view
The sql query to install the function needed to get de-dedupe data from the server can be found here https://raw.githubusercontent.com/dhis2/datim-dedupe/master/sql/dedupe_plpgsql.sql

####Step 2: Create a system setting
In order for the app to know which SQL view to ask for the data you need to add a system setting. The system setting should have the following name `keyDedupeSqlViewId`

The value for this system setting is as shown below. This is a basic javascript object with the property name id and the sql view uid as its value.
```json
{
	"id": "AuL6zTSLxNc"
}
```

To set the system setting using curl you can do:

```bash
curl "https://test.datim.org/api/systemSettings/keyDedupeSqlViewId" -d '{"id": "AuL6zTSLxNc"}' -H "Content-Type:text/plain" -X POST -u user:pw -v
```

####Step 3: Install the datim-dedupe app
You will find the latest version of the dedupe app here http://dhis2.github.io/pepfar-releases/. Download the zipfile and install it into dhis2 using the app management app you will find in the app menu. 

That should be all.


## Contribute

### Setup the dhis.json config file
To get started clone the repository and add a `dhis.json` file to the root of the project.
This will help gulp determine where your dhis2 instance is running and will make it easier
to deploy the app. Additionally it will also update the webapp manifest for you so you do not
have to install the app.

The dhis.json file should look something like the following.
The `dhisBaseUrl` is the url for the manifest. This is the address you use in your browser.
The `dhisDeployDirectory` is the directory on disk where the app should be copied to. (Note the last folder being the app folder. This folder is the app installation folder as defined in the dhis app management settings module + the name of the app.)

```json
{
    "dhisBaseUrl": "http://localhost:8080/dhis",
    "dhisDeployDirectory": "/usr/local/apache-tomcat-8.0.5/webapps/dhis/apps/datim-dedupe/"
}
```

### Install the dependencies

Run the following command to install the nodejs dependencies (This requires you to have nodejs installed)
```bash
npm install
```

Install the bower dependencies
```bash
bower install
```

Run the gulp build command to see if everything is installed correctly
```bash
gulp build
```

After running `gulp copy-to-dev` your app should be available at `http://localhost:8080/dhis/datim-dedupe` if your settings are the same as above.

Happy hacking!
