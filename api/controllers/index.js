'use strict';

var express = require('express');
var router  = express.Router();

var users = require('./user.controller');
var games = require('./game.controller');

router.use('/users', users);
router.use('/games', games);

module.exports = router;
