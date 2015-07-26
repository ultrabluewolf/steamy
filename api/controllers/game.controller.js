'use strict';

var express = require('express');
var router  = express.Router();
//var moment  = require('moment');
var log     = require(global.ROOT_DIR + '/config/logger').subLog('game');

log.debug('game controller');

var utils       = require('../utils');
var gameService = require('../services').games;

var respWrapper = utils.ctrlHelpers.respWrapper;

// get news for game
//
router.get('/:id/news', function(req, res) {
  var id = req.params.id;

  gameService.getNews(id)
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
