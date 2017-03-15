/**
 * Created by Oleksii Fedianin on 23.01.2017.
 */

"use strict";

var express = require('express');
var router = express.Router();
var config = require('../config/' + process.env.NODE_ENV + '.config');
var app = express();
var bodyParser = require('body-parser');
var validator = require('../lib/functions/validation');
var requestClass = require("../lib/Classes/requestFactory");
var failedRequestClass = require("../lib/Classes/failedRequestsFactory");
var db = require('../lib/mysql/db.queries');
var cron = require('node-cron');

app.use(bodyParser.json({extended: true})); // parser for POST JSON data

/**
 * launch cron
 */
cron.schedule('* * * * *', function () {

	console.log('running a task every minute');
});

db.getFailedRequests(function (response) {

	if (response) {
for (let i = 0; i<response.length; i++) {
	let failedRequests = new failedRequestClass(response[i]);
	let requestService = require('../lib/jobs/' + failedRequests.getService());
	requestService.executeLazyJob(failedRequests, function(process) {
		console.log(process);
	});

	failedRequests = null;
}
	} else {
//TODO handle db-error
	}
})

router.post('/', function (req, res) {
	let newQuery = new requestClass(req);
	function process(callback) {
		if (callback.isValidate) { console.log(callback)
			db.saveRequest(newQuery, function (response) {
				if (response) {
					res.end();
					let requestService = require('../lib/jobs/' + newQuery.getService());
					requestService.executeFastJob(newQuery, function(process) {
						console.log(process);
					});
				} else {
					res.statusCode = 503;
					res.end();
				}
			})
		} else { console.log(15)
			res.statusCode = callback.code;
			res.send(callback.message);
			res.end();
		}
	}

	process(validator.validate(newQuery));
});

router.get('/', function (req, res) {
	res.statusCode = 405;
	res.send({message: "Not correct method, you have to use 'POST'"})
	res.end();
});

module.exports = router;