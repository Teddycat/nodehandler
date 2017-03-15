/**
 * Created by Oleksii Fedianin on 23.01.2017.
 */

"use strict";

let method = InfoQuery.prototype;
var uuid = require('../functions/uuid');

/**
 *
 * @param req
 * @constructor
 * @returns instance of infoQuery Class
 */

function InfoQuery(req) {
	this._destination = (req.body.destination)? req.body.destination : false;
	this._data = (req.body.data)? req.body.data : false;
	this._contentType = req.headers['content-type'];
	this._service = (req.body.data && req.body.data.service)?req.body.data.service : false;
	this._method = req.method;
	this._provider = (req.body.data && req.body.data.params.provider)?req.body.data.params.provider : false;
	this._payload = (req.body.data && req.body.data.payload)?req.body.data.payload : false;
	this._uuid = uuid.uuid();
	this._timeRequest = Math.round(new Date().getTime());
}

method.getDestination = function() {
	return this._destination;
};

method.getData = function() {
	return this._data;
};

method.getContentType = function() {
	return this._contentType;
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

method.getTimeRequest = function() {
	return this._timeRequest;
};


module.exports = InfoQuery;