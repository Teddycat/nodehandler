/**
 * Created by Oleksii Fedianin on 03.02.2017.
 */

/**
 * Created by Oleksii Fedianin on 23.01.2017.
 */

"use strict";

let method = failedRequests.prototype;
var uuid = require('../functions/uuid');

/**
 *
 * @param req
 * @constructor
 * @returns instance of infoQuery Class
 */

function failedRequests(datas) {
	this._destination = datas.destination ;
	this._data = datas.data;
	this._status = datas.status;
	this._service = datas.service;
	this._method = datas.method;
	this._provider = (datas.provider)?datas.provider : false;
	this._payload = (datas.payload)?datas.payload : false;
	this._uuid = datas.uuid;
	this._attempts = datas.attempts;
}

method.getDestination = function() {
	return this._destination;
};

method.getData = function() {
	return this._data;
};

method.getStatus = function() {
	return this._status;
};

method.getService = function() {
	return this._service;
};

method.getMethod = function() {
	return this._method;
};

method.getProvider = function() {
	return this._provider;
};

method.getPayload = function() {
	return this._payload;
};

method.getUuid = function() {
	return this._uuid;
};

method.getAttempts = function() {
	return this._attempts;
};


module.exports = failedRequests;