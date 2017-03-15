/**
 * Created by Oleksii Fedianin on 23.01.2017.
 */

"use strict";

var config = require('../../config/' + process.env.NODE_ENV + '.config');
var mysql = require('mysql');
var promises = require('promises');

var pool = mysql.createPool({
	connectionLimit: config.dbLimitConnect,
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	database: config.database.database
});

/**
 * trying to save in DB parameters of outside request
 * @param setRequest
 * @param response
 */

exports.saveRequest = function (setRequest, response) {
	let query = "INSERT INTO records (destination, data, uuid, time_request, provider, method, payload, service, status, attempts) VALUES (" + pool.escape(setRequest.getDestination()) + ", "
		+ pool.escape(JSON.stringify(setRequest.getData())) + " , '"
		+ setRequest.getUuid() + "', "
		+ setRequest.getTimeRequest() + ", "
		+ pool.escape(setRequest.getProvider()) + ", "
		+ pool.escape(setRequest.getMethod()) + ", "
		+ pool.escape(setRequest.getPayload()) + ", "
		+ pool.escape(setRequest.getService()) + ",  1, 1)";
	pool.query(query, function (err) {
		if (err) {
			response(false);
		} else {
			response(true);
		}
	});
};

exports.updateAttemptRequest1 = function (result, response) {
	pool.query("UPDATE records SET status=" + result.status + ", time_response='" + result.timeResponse + "', attempts=" + result.attempt + ", result=" + result.responseCode + "  WHERE uuid='" + result.uuid + "'",
		function (err) {
			if (err) {
				response(err.message);
			} else {
				response(true);
			}
		});
}

exports.getFailedRequests = function (failed) {
	pool.query(
		"SELECT * FROM records WHERE status='1' AND attempts BETWEEN 1 AND 7",
		function (err, results) {
			failed(results);
		}
	);
}

