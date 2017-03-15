/**
 * Created by Teddycat on 26.01.2017.
 */
params = {
    common: {
        sendMail: {
            service: 'Gmail',
            user: 'leszeknodek@gmail.com',
            password: 'zxcvbn90',
            logger: true,
            debug: true
        },
    },
    standard: {
        template: "standard"
    },
    personal: {
        template: "personal"
    },
    picture: {
        template: "picture"

    },
}

module.exports = params;
