const express = require('express'),
 app = express(),
 requestProxy = require("express-request-proxy");

const credentials = process.env.DHIS_USERNAME + ":" + process.env.DHIS_PASSWORD;

app.use(express.static('./dev'));

app.all("/api/*", requestProxy({
    url: process.env.DHIS_BASEURL + '/*',
    headers: {
        Authorization: "Basic " + new Buffer(credentials).toString("base64")
    }
}));

app.listen(8000);