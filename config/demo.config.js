/**
 * Created by Teddycat on 16.01.2017.
 */

"use strict";

var config = {
    url: 'http://my.site.com',
    hashLength: 27,
    dbLimitConnect: 10,
    attemptsKueCount: 8,
    responseErrorDb: 503,
    responseErrorRequest: 405,

    database: {
        host: 'localhost',
        user: 'node',
        password: 'rsQyeDnl0h5xnsuqy8m8',
        database: 'node'
    },

    redis: {
        port: 6379,
        host: '127.0.0.1',
        auth: ''
    },

    attemptRequestLoop1: 60,
    attemptRequestLoop2: 900,
    attemptRequestLoop3: 3600,
    attemptRequestLoop4: 21600,
    attemptRequestLoop5: 43200
}

module.exports = config;