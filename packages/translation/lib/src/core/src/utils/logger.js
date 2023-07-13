"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = require("winston");

const logger = (0, _winston.createLogger)({
  format: _winston.format.simple(),
  level: process.env.DEBUG ? 'silly' : 'info',
  transports: [new _winston.transports.Console({
    level: 'debug'
  })]
});
var _default = logger;
exports.default = _default;