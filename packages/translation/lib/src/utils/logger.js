"use strict";

var _winston = require("winston");

var _sdkCore = require("../sdk-core");

const combinedFormat = _winston.format.combine(_winston.format.timestamp(), _winston.format.json());

const errorLogger = new _winston.transports.File({
  format: combinedFormat,
  filename: './logs/error.log',
  level: 'error'
});
const combinedLogger = new _winston.transports.File({
  format: combinedFormat,
  filename: './logs/combined.log',
  level: 'info'
});

_sdkCore.logger.add(combinedLogger).add(errorLogger);