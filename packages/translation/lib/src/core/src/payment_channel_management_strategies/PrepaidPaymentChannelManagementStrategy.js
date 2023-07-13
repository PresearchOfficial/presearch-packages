"use strict";

var _DefaultPaymentChannelManagementStrategy = _interopRequireDefault(require("./DefaultPaymentChannelManagementStrategy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PrepaidPaymentChannelManagementStrategy extends _DefaultPaymentChannelManagementStrategy.default {
  constructor(sdkContext, blockOffset = 240, callAllowance = 1, concurrencyManager) {
    super(sdkContext, blockOffset, callAllowance);
    this._sdkContext = sdkContext;
    this._blockOffset = blockOffset;
    this._callAllowance = callAllowance;
    this._concurrencyManager = concurrencyManager;
  }

  _priceForConcurrentCalls(serviceClient) {
    return this._pricePerServiceCall(serviceClient) * this._concurrencyManager.concurrentCalls;
  }

  async selectChannel(serviceClient) {
    const {
      account
    } = serviceClient;
    await serviceClient.loadOpenChannels();
    await serviceClient.updateChannelStates();
    const {
      paymentChannels
    } = serviceClient;

    const concurrentCallsPrice = this._priceForConcurrentCalls(serviceClient);

    const extendChannelFund = concurrentCallsPrice * this._callAllowance;
    const mpeBalance = await account.escrowBalance();
    const defaultExpiry = await this._defaultChannelExpiry(serviceClient);
    const offsetExpiry = defaultExpiry + this.blockOffset;
    let paymentChannel;

    if (paymentChannels.length < 1) {
      if (concurrentCallsPrice > mpeBalance) {
        paymentChannel = serviceClient.depositAndOpenChannel(concurrentCallsPrice, offsetExpiry);
      } else {
        paymentChannel = serviceClient.openChannel(concurrentCallsPrice, offsetExpiry);
      }
    } else {
      paymentChannel = paymentChannels[0];
    }

    const hasSufficientFunds = this._hasSufficientFunds(paymentChannel, concurrentCallsPrice);

    const isValid = this._isValid(paymentChannel, defaultExpiry);

    if (hasSufficientFunds && !isValid) {
      await paymentChannel.extendExpiry(offsetExpiry);
    } else if (!hasSufficientFunds && isValid) {
      await paymentChannel.addFunds(extendChannelFund);
    } else if (!hasSufficientFunds && !isValid) {
      await paymentChannel.extendAndAddFunds(offsetExpiry, extendChannelFund);
    }

    return paymentChannel;
  }

}