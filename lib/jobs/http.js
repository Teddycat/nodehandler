/**
 * Created by Teddycat on 25.01.2017.
 */
"use strict";

var request = require('request');
var config = require('../../config/' + process.env.NODE_ENV + '.config');
var db = require('../mysql/db.queries');

var kue = require('kue'), jobs = kue.createQueue({
	prefix: 'jobs',
	redis: {
		port: config.redis.port,
		host: config.redis.host,
		auth: config.redis.auth,
	}
});

kue.app.listen(3005);

/**
 * Handling of request (1-5 attempts)
 * @param newQuery
 * @returns {string}
 */
exports.executeFastJob = function (newQuery, process) { //export process to db query because of async

	let job = jobs.create('firstAttempt', { // creating task with datas for query and work with db
		uuid: newQuery.getUuid(),
		timeRequest: newQuery.getTimeRequest(),
		destination: newQuery.getDestination(),
		contentQuery: newQuery.getData,
		method: "POST"
	}).priority('high').attempts(config.attemptsPeriod1).ttl(config.periodRequest1).save();

	job.on('complete', function (result) { //one of attempts was successful
		let requestData = {
			timeResponse: Math.round(new Date().getTime()), //time when we get response
			uuid: job.data.uuid,
			status: 2,
			attempt: 2,
			responseCode: result
		};
		db.updateAttemptRequest1(requestData, function (response) {
			if (response) {
				process(true);
			} else {
				process(false);
			}
		});

		job.remove(function (err) {
			if (err) {
				throw err;
			}
		});

	}).on('failed', function () {
		let requestData = {
			timeResponse: Math.round(new Date().getTime()), //time when we get response
			uuid: job.data.uuid,
			status: 1,
			attempt: 2,
			responseCode: 999
		};
		job.remove(function (err) {
			if (err) {
				throw err;
			}
		});
		db.updateAttemptRequest1(requestData, function (response) {
			if (response) {
				process(true);
			} else {
				process(false);
			}
		});
	});

	//<editor-fold desc="Executing que-redis task for work with db">
	jobs.process('firstAttempt', function (job, done) { //recording incoming datas about customer's request, default status is 1 (in progress)
		let options = { //collect parameters for request
			url: job.data.destination,
			method: job.data.method,
			headers: {'Content-Type': job.data.type},
			form: job.data.contentQuery
		};

		// START REQUEST
		request(options, function (error, response) {

			if (!error && response.statusCode == 200) {
				console.log("request");
				done(null, response.statusCode);
			} else {
				console.log("no");
			}
		});
	});
	//</editor-fold>
};

exports.executeLazyJob = function (newQuery, process) { //export process to db query because of async

	let job = jobs.create('firstAttempt', { // creating task with datas for query and work with db
		uuid: newQuery.getUuid(),
		destination: newQuery.getDestination(),
		contentQuery: newQuery.getData(),
		type: newQuery.getPayload(),
		attempt: newQuery.getAttempts(),
		method: "POST"
	}).priority('high').attempts(config.attemptsPeriod1).ttl(config.periodRequest1).save();

	job.on('complete', function (result) { //one of attempts was successful
		let requestData = {
			timeResponse: Math.round(new Date().getTime()), //time when we get response
			uuid: job.data.uuid,
			status: 2,
			attempt: 2,
			responseCode: result
		};
		db.updateAttemptRequest1(requestData, function (response) {
			if (response) {
				process(true);
			} else {
				process(false);
			}
		});

		job.remove(function (err) {
			if (err) {
				throw err;
			}
		});

	}).on('failed', function () {
		let requestData = {
			timeResponse: Math.round(new Date().getTime()), //time when we get response
			uuid: job.data.uuid,
			status: 1,
			attempt: ++job.data.attempt,
			responseCode: 999
		};
		job.remove(function (err) {
			if (err) {
				throw err;
			}
		});
		db.updateAttemptRequest1(requestData, function (response) {
			if (response) {
				process(true);
			} else {
				process(false);
			}
		});
	});

	//<editor-fold desc="Executing que-redis task for work with db">
	jobs.process('firstAttempt', function (job, done) { //recording incoming datas about customer's request, default status is 1 (in progress)
		let options = { //collect parameters for request
			url: job.data.destination,
			method: job.data.method,
			headers: {'Content-Type': job.data.type},
			form: job.data.contentQuery
		};

		// START REQUEST
		request(options, function (error, response) {
			if (!error && response.statusCode == 200) {
				console.log("request");
				done(null, response.statusCode);
			} else {
				console.log("no");
			}
		});
	});
	//</editor-fold>
};