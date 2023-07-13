"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBNString = toBNString;

var _bignumber = require("bignumber.js");

function toBNString(value) {
  return new _bignumber.BigNumber(value).toFixed();
}