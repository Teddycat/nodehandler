/**
 * Created by Oleksii Fedianin on 23.01.2017.
 */

"use strict";

var config = require('./config/' + process.env.NODE_ENV + '.config');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var test = require('./routes/test');
var mainProcess = require('./routes/server');
app.use(bodyParser.json({extended: true, limit: '5mb'}));

app.use('/', routes);
app.use('/test', test);
app.use('/server', mainProcess);

/**
 * behaviour of application in case of 'dev' environment
 */
if (process.env.NODE_ENV === 'dev') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({message: err.message});
        res.end();
    });
}

/**
 * application' error handler
 */
app.use(function (err, req, res, next) {
	res.statusCode = err.statusCode;
    res.send = err.message;
    res.end();
});

/**
 * launch server
 * @type {http.Server}
 */
let server = app.listen(8083, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

module.exports = app;