'use strict';

var express = require('express');
var router  = express.Router();

var users = require('./user.controller');

router.use('/users', users);

module.exports = router;
