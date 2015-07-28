'use strict';

var express = require('express');
var router  = express.Router();
var log     = require(global.ROOT_DIR + '/config/logger').subLog('user');

log.debug('user controller');

var utils       = require('../utils');
var userService = require('../services').users;

var respWrapper = utils.ctrlHelpers.respWrapper;

// get user summary
//
router.get('/:id', function(req, res) {
  var id = req.params.id;

  userService.getByUserId(id)
    .then(function (data) {
      res.json(respWrapper(null, data));
    })
    .catch(function (err) {
      var errMsg = {
        name: err.name,
        statusCode: err.statusCode,
        message: err.message
      };
      log.error(errMsg);
      res.json(respWrapper(errMsg));
    });
});

// get friends of the user
//
router.get('/:id/friends', function(req, res) {
  var id = req.params.id;

  userService.getFriendList(id)
    .then(function (data) {
      res.json(respWrapper(null, data));
    })
    .catch(function (err) {
      var errMsg = {
        name: err.name,
        statusCode: err.statusCode,
        message: err.message
      };
      log.error(errMsg);
      res.json(respWrapper(errMsg));
    });
});

// get games owned by the user
//
router.get('/:id/games', function(req, res) {
  var id = req.params.id;

  userService.getGames(id)
    .then(function (data) {
      res.json(respWrapper(null, data));
    })
    .catch(function (err) {
      var errMsg = {
        name: err.name,
        statusCode: err.statusCode,
        message: err.message
      };
      log.error(errMsg);
      res.json(respWrapper(errMsg));
    });
});

module.exports = router;
