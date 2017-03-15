/**
 * Created by Teddycat on 25.01.2017.
 */
"use strict";

var loops = require('../functions/count.loop');
var request = require('request');
var config = require('../../config/' + require('../../config/config').enviroment + '.config');
var pool = require('../mysql/db.queries');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var kue = require('kue');
//kue.app.listen(3005);//web-interface of kue

exports.executeProcess = function (setRequest) { //export process to db query because of async

	// Launch job process for sending SMS

	let tools = require('../../config/API/' + setRequest.whatKindOfAPI);
	let loopCount = 1;
	let loopExecute = loops.loopValueByCount(1);
	let attemptsAmount = config.attemptsKueCount;
	let stopLoop = ++config.attemptsKueCount;

	let tryingRequest = function (loopExecute, loopCount) { //loop-function working until success or luck of attempts
		loopCount++; //number of loop

		let job = setRequest.jobs.create('queriesDB', { // creating task with datas for query and work with db
			hash: setRequest.hashString, //unique number of process for DB
			timeRequest: setRequest.timeRequest,
			destination: setRequest.req.body.destination,
			params: setRequest.req.body.data.params,
			from: setRequest.req.body.data.params.from,
			subject: setRequest.req.body.data.params.subject,
			message: setRequest.req.body.data.params.message,
			service: setRequest.req.body.data.service,
			provider: tools.common.sendSMS.service,
			user: tools.common.sendSMS.user,
			password: tools.common.sendSMS.password,
		}).priority('high').attempts(attemptsAmount).ttl(loopExecute).save();

		//handle results of job
		job.on('complete', function (result) {
			pool.updateQuery(result, job.data.hash, '2', setRequest.res, setRequest.pool); // 2 means that process was successful

			job.remove(function (err) {
				if (err) {
					throw err;
				}
			});

		}).on('failed', function () {
			if (loopCount == stopLoop) {
				let timeResponse = Math.round(new Date().getTime()); //time when we get response
				var result = {
					timeResponse: timeResponse, //time when we get response
					timeHandle: timeResponse - job.data.timeRequest,
					code: config.responseErrorRequest //time of handling response
				};
				job.remove(function (err) {
					if (err) {
						throw err;
					}
				});
				pool.updateQuery(result, job.data.hash, '0', res); // 0 means that process was successful
			} else {
				tryingRequest(loops.loopValueByCount(loopCount), loopCount);
			}
		});
		// results of job handled
	};
	tryingRequest(loopExecute, loopCount); //start a loop, if not success we should try till the end of attempts

	// START executing que-redis task for work with db
	setRequest.jobs.process('queriesDB', function (job, done) { //recording incoming datas about customer's request, default status is 1 (in progress)

		// START SENDING MESSAG

		let timeResponse = Math.round(new Date().getTime()); //time when we get response
		let result = {
			timeResponse: timeResponse,
			timeHandle: timeResponse - job.data.timeRequest,
			code: 200//time of handling response
		};
		done(null, result);

		//END SENDING MESSAGE
	});
};

