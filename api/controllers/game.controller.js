'use strict';

var express = require('express');
var router  = express.Router();
var log     = require('../../config/logger').subLog('game');

log.debug('game controller');

var utils       = require('../utils');
var Game        = require('../models').Game;
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

// find appid for queried title
//
router.get('/find', function (req, res) {

  Game.getByTitle(req.query.title)
    .then(function (game) {
      return res.json(respWrapper(null, game));
    })
    .catch(function (err) {
      gameService.toAppId(req.query.title)
        .then(function (data) {
          
          if (req.query.title === data.game_title) {
            var game = new Game(data.app_id, data.game_title);
            game.save().then(function () {
              log.info('stored', game);
            });
          }

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

});

//
//
router.get('/:id', function(req, res) {
  var id = req.params.id;

  gameService.get(id)
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

router.get('/', function (req, res) {
  Game.all().then(function (games) {
    res.json(respWrapper(null, games));
  });
});

// router.post('/', function (req, res) {
//   var appId = req.body.app_id;
//   var gameTitle = req.body.game_title;
  
//   if (!appId || !gameTitle) {
//     return res.status(400).json(respWrapper('app_id and game_title are required!'));
//   }

//   var game = new Game(appId, gameTitle);
  
//   game.save().then(function (game) {
//     res.json(respWrapper(null, game));
//   });
// });

module.exports = router;
