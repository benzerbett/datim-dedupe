# datim-dedupe
[![Build Status](https://travis-ci.org/dhis2/datim-dedupe.svg)](https://travis-ci.org/dhis2/datim-dedupe)
[![Coverage Status](https://coveralls.io/repos/dhis2/datim-dedupe/badge.svg)](https://coveralls.io/r/dhis2/datim-dedupe)
[![Code Climate](https://codeclimate.com/github/dhis2/datim-dedupe/badges/gpa.svg)](https://codeclimate.com/github/dhis2/datim-dedupe)

[![Dependency Status](https://www.versioneye.com/user/projects/54b7fc03fd43d3feab000146/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54b7fc03fd43d3feab000146)
[![Dependency Status](https://www.versioneye.com/user/projects/54b7fb06fd43d311050000a9/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54b7fb06fd43d311050000a9)

Deduplication app for DATIM

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
```
npm install
```

Install the bower dependencies
```
bower install
```

Run the gulp build command to see if everything is installed correctly
```
gulp build
```

After running `gulp copy-to-dev` your app should be available at `http://localhost:8080/dhis/datim-dedupe` if your settings are the same as above.

Happy hacking!