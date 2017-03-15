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
            method: '',
            params: setRequest.req.body.data.params,
            from: setRequest.req.body.data.params.from,
            subject: setRequest.req.body.data.params.subject,
            message: setRequest.req.body.data.params.message,
            service: setRequest.req.body.data.service,
            provider: tools.common.sendMail.service,
            user: tools.common.sendMail.user,
            password: tools.common.sendMail.password,
            logger: tools.common.sendMail.logger,
            debug: tools.common.sendMail.debug
        }).priority('normal').attempts(attemptsAmount).ttl(loopExecute).save();

        //handle results of job
        job.on('complete', function (result) {
            pool.updateQuery(result, job.data.hash, '2', setRequest.res, setRequest.pool); // 2 means that process was successful

            job.remove(function (err) {
                if (err) throw err;
            });

        }).on('failed', function () {
            if (loopCount == stopLoop) {
                let timeResponse = Math.round(new Date().getTime()); //time when we get response
                var result = {
                    timeResponse: timeResponse, //time when we get response
                    timeHandle: timeResponse - job.data.timeRequest,
                    code: config.responseErrorRequest //time of handling response
                }
                job.remove(function (err) {
                    if (err) throw err;
                });
                pool.updateQuery(result, job.data.hash, '0', res); // 0 means that process was successful
            } else {
                tryingRequest(loops.loopValueByCount(loopCount), loopCount);
            }
        });
        // results of job handled
    }
    tryingRequest(loopExecute, loopCount); //start a loop, if not success we should try till the end of attempts

    // START executing que-redis task for work with db
	setRequest.jobs.process('queriesDB', function (job, done) { //recording incoming datas about customer's request, default status is 1 (in progress)
		console.log("HERERERE");
        // START SENDING MESSAGE
        let options = {
            viewEngine: {
                extname: '.hbs',
                layoutsDir: 'views/email/',
                defaultLayout: 'templates/template',
                partialsDir: 'views/partials/'
            },
            viewPath: 'views/email/',
            extName: '.hbs'
        };

        let transporter = nodemailer.createTransport({
            pool: true,
            service: job.data.provider,
            auth: {
                user: job.data.user,
                pass: job.data.password
            },
            logger: job.data.logger, // log to console
            debug: job.data.debug // include SMTP traffic in the logs
        }, {
            from: job.data.from,
        });

        transporter.use('compile', hbs(options));

        transporter.sendMail({
            from: job.data.from,
            to: job.data.destination,
            subject: job.data.subject,
            template: job.data.service,
            context: job.data.params
        }, function (error, res) {
            console.log(res);
            if(!error) {
	            transporter.close();
	            let timeResponse = Math.round(new Date().getTime()); //time when we get response
	            let response = {
		            timeResponse: timeResponse,
		            timeHandle: timeResponse - job.data.timeRequest,
		            code: 200//time of handling response
	            }
	            done(null, response);
            }

        });




        //END SENDING MESSAGE
    });
}