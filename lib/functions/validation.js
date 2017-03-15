/**
 * Created by Oleksii Fedianin on 31.01.2017.
 */

"use strict";

let validator = require('validator');
// var Regex = require("regex");
var test = /^http:\/\//;

/**
 * //creating identificated key for every query that recording in db
 * @param obj
 * @returns {{response: isValidate, code, message}}
 */
exports.validate = function validator(obj) {
	let response = {
		"isValidate": false
	};
	if (obj.getService() === 'http') {
		if (obj.getContentType() !== 'application/json') {
			response.code = 415;
			response.message = {message: "Please select 'application/json' method"};
		} else if (!obj.getDestination()) {
			response.code = 400;
			response.message = {message: "Have you 'destination' parameter?"};
		} else if (!test.test(obj.getDestination())) {
			response.code = 400;
			response.message = {message: "Destination should start from 'http' or 'https'"};
		} else if (!obj.getData()) {
			response.code = 400;
			response.message = {message: "Have you 'data' parameter?"};
		} else if (obj.getService() !== "http" && obj.getService() !== "mail" && obj.getService() !== "sms") {
			response.code = 400;
			response.message = {message: "Parameter 'service' should be http, mail or sms"};
		} else if (obj.getService() === "http" && !obj.getPayload()) {
			response.code = 400;
			response.message = {message: "Method of sending data (payload) is undefined"};
		} else {
			response.isValidate = true;
			response.code = 200;
		}
	} else if (obj.getService() === 'mail') {

	} else if (obj.getService() === 'sms') {

	}
	return response;
}
