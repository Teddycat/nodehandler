/**
 * Created by Teddycat on 23.01.2017.
 */

var uuidV4 = require('uuid/v4');

/**
 * @returns identifier for every request
 */
exports.uuid = function makeUuid() {
    return uuidV4();
};

