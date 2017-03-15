/**
 * Created by Oleksii Fedianin on 23.01.2017.
 */

"use strict";

let config = {
    dbLimitConnect: 10,
    attemptsPeriod1: 5,
    responseErrorDb: 503,
    responseErrorRequest: 405,
    responseWrongRequest: 400,
    errorPayload: 413,

    database: {
        host: 'localhost',
        user: 'root',
        password: '111111',
        database: 'node'
    },
    redis: {
        port: 6379,
        host: '127.0.0.1',
        auth: ''
    },

    periodRequest1: 50,
    attemptRequestLoop2: 50,
    attemptRequestLoop3: 50,
    attemptRequestLoop4: 50,
    attemptRequestLoop5: 50,
    loopAmount: 5,

    };

module.exports = config;