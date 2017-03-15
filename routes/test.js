/**
 * Created by alex on 05.02.17.
 */
"use strict";
var express = require('express');
var router = express.Router();
router.post('/', function (req, res) {

    res.statusCode = 200;
    res.end();

});

module.exports = router;