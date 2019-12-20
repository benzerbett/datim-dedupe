const express = require('express');
const app = express();
const requestProxy = require("express-request-proxy");

app.use(express.static('./dev'));

const credentials = process.env.DHIS_USERNAME + ":" + process.env.DHIS_PASSWORD;

app.all("/api/*", requestProxy({
    url: process.env.DHIS_BASEURL + '/*',
    headers: {
        Authorization: "Basic " + new Buffer(credentials).toString("base64")
    }
}));

// app.all("/api/*", (req,res,next)=>{
//     let f = requestProxy({
//         url: process.env.DHIS_BASEURL + '/api/me',
//         headers: {
//             Authorization: "Basic " + new Buffer(credentials).toString("base64")
//         }
//     });
//     f(req,res,next);
// });


app.listen(8000);