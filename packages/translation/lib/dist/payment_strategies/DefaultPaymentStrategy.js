"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _FreeCallPaymentStrategy = _interopRequireDefault(require("./FreeCallPaymentStrategy"));

var _PrepaidPaymentStrategy = _interopRequireDefault(require("./PrepaidPaymentStrategy"));

var _PaidCallPaymentStrategy = _interopRequireDefault(require("./PaidCallPaymentStrategy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DefaultPaymentStrategy {
  /**
   * Initializing the payment strategy
   * @param {number} concurrentCalls
   */
  constructor(concurrentCalls = 1) {
    this._concurrentCalls = concurrentCalls;
    this._channelId = undefined;
  }

  get concurrentCalls() {
    return this._concurrentCalls;
  }

  set channelId(value) {
    this._channelId = value;
  }
  /**
   * map the metadata for the gRPC call
   * @param {BaseServiceClient} serviceClient
   * @returns {Promise<({'snet-payment-type': string}|{'snet-payment-channel-id': string}|{'snet-payment-channel-nonce': string}|{'snet-payment-channel-amount': string}|{'snet-payment-channel-signature-bin': Buffer})[]>}
   */


  async getPaymentMetadata(serviceClient) {
    const freeCallPaymentStrategy = new _FreeCallPaymentStrategy.default(serviceClient);
    const isFreeCallsAvailable = await freeCallPaymentStrategy.isFreeCallAvailable();
    let metadata;

    if (isFreeCallsAvailable) {
      metadata = await freeCallPaymentStrategy.getPaymentMetadata();
    } else if (serviceClient.concurrencyFlag) {
      const paymentStrategy = new _PrepaidPaymentStrategy.default(serviceClient);
      metadata = await paymentStrategy.getPaymentMetadata(this._channelId);
    } else {
      const paymentStrategy = new _PaidCallPaymentStrategy.default(serviceClient);
      metadata = await paymentStrategy.getPaymentMetadata();
    }

    return metadata;
  }
  /**
   * retrieve the concurrency token and the channelID from the daemon
   * @param {ServiceClient} serviceClient
   * @returns {Promise<{channelId: BigNumber, concurrencyToken: String}>}
   */


  async getConcurrencyTokenAndChannelId(serviceClient) {
    const paymentStrategy = new _PrepaidPaymentStrategy.default(serviceClient);
    const channel = await paymentStrategy._selectChannel();
    const concurrencyToken = await paymentStrategy.getConcurrencyToken(channel);
    return {
      channelId: channel.channelId,
      concurrencyToken
    };
  }

}

var _default = DefaultPaymentStrategy;
exports.default = _default;