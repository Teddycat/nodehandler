/**
 * Created by Teddycat on 26.01.2017.
 */
var func = require('../../lib/functions/uuid');

params = {
    common: {
        sendSMS: {
            service: 'SMS Provider',
            user: 'someone',
            password: 'zxcvbn90',
            logger: true,
            debug: true
        },
    },
    standard: {
        text: "req.data.message"
    },
    random: {
        text: func.hash()
    },
}

module.exports = params;
