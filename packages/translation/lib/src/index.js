"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

require("./utils/logger");

var _NodeSdk = _interopRequireDefault(require("./NodeSdk"));

var _sdkCore = require("./sdk-core");

Object.keys(_sdkCore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _sdkCore[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sdkCore[key];
    }
  });
});

var _payment_strategies = require("./payment_strategies");

Object.keys(_payment_strategies).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _payment_strategies[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _payment_strategies[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _NodeSdk.default;
exports.default = _default;