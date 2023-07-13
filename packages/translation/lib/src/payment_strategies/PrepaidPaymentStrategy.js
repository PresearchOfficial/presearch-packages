"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BasePaidPaymentStrategy = _interopRequireDefault(require("./BasePaidPaymentStrategy"));

var _core = require("../core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PrepaidPaymentStrategy extends _BasePaidPaymentStrategy.default {
  /**
   * @param {BaseServiceClient} serviceClient
   * @param {ConcurrencyManager} concurrencyManager
   * @param {number} blockOffset
   * @param {number} callAllowance
   */
  constructor(serviceClient, blockOffset = 240, callAllowance = 1) {
    super(serviceClient, blockOffset, callAllowance);
    this._encodingUtils = new _core.EncodingUtils();
    this._concurrencyManager = serviceClient.concurrencyManager;
  }
  /**
   * @returns {Promise<[{'snet-payment-type': string}, {'snet-payment-channel-id': string}, {'snet-payment-channel-nonce': string}, {'snet-prepaid-auth-token-bin': *}]>}
   */


  async getPaymentMetadata(preselectChannelId) {
    const channel = await this._selectChannel(preselectChannelId);

    const concurrentCallsPrice = this._getPrice();

    const token = await this._concurrencyManager.getToken(channel, concurrentCallsPrice);

    const tokenBytes = this._encodingUtils.utfStringToBytes(token);

    const metadata = [{
      'snet-payment-type': 'prepaid-call'
    }, {
      'snet-payment-channel-id': `${channel.channelId}`
    }, {
      'snet-payment-channel-nonce': `${channel.state.nonce}`
    }, {
      'snet-prepaid-auth-token-bin': tokenBytes
    }];
    return metadata;
  }
  /**
   * @returns {Promise<String>} concurrencyToken
   */


  async getConcurrencyToken(channel) {
    const concurrentCallsPrice = this._getPrice();

    const token = await this._concurrencyManager.getToken(channel, concurrentCallsPrice);
    return token;
  }
  /**
   * total price for all the service calls
   * @returns {number}
   * @private
   */


  _getPrice() {
    return this._serviceClient._pricePerServiceCall.toNumber() * this._concurrencyManager.concurrentCalls;
  }

}

var _default = PrepaidPaymentStrategy;
exports.default = _default;