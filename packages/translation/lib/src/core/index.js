"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  logger: true,
  EncodingUtils: true,
  blockChainEvents: true,
  BaseServiceClient: true,
  PaymentChannel: true
};
Object.defineProperty(exports, "logger", {
  enumerable: true,
  get: function () {
    return _logger.default;
  }
});
Object.defineProperty(exports, "EncodingUtils", {
  enumerable: true,
  get: function () {
    return _encodingUtils.default;
  }
});
Object.defineProperty(exports, "blockChainEvents", {
  enumerable: true,
  get: function () {
    return _blockchainEvents.default;
  }
});
Object.defineProperty(exports, "BaseServiceClient", {
  enumerable: true,
  get: function () {
    return _BaseServiceClient.default;
  }
});
Object.defineProperty(exports, "PaymentChannel", {
  enumerable: true,
  get: function () {
    return _PaymentChannel.default;
  }
});
exports.default = void 0;

var _sdk = _interopRequireDefault(require("./src/sdk"));

var _logger = _interopRequireDefault(require("./src/utils/logger"));

var _encodingUtils = _interopRequireDefault(require("./src/utils/encodingUtils"));

var _blockchainEvents = _interopRequireDefault(require("./src/utils/blockchainEvents"));

var _BaseServiceClient = _interopRequireDefault(require("./src/BaseServiceClient"));

var _PaymentChannel = _interopRequireDefault(require("./src/PaymentChannel"));

var _identities = require("./src/identities");

Object.keys(_identities).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _identities[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _identities[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _sdk.default;
exports.default = _default;