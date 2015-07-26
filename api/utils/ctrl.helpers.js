'use strict';

var moment = require('moment');

var ControllerHelpers = module.exports = {};

ControllerHelpers.respWrapper = function (err, body) {
  return {
    success: !err,
    timestamp: moment().utc().format(),
    body: body,
    error: err
  };
};
