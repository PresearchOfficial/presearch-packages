"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _bignumber = require("bignumber.js");

/**
 * @implements PaymentChannelManagementStrategy
 */
class DefaultPaymentChannelManagementStrategy {
  /**
   * @param {SnetSDK} sdkContext
   * @param {number} blockOffset
   * @param {number} callAllowance
   */
  constructor(sdkContext, blockOffset = 0, callAllowance = 1) {
    this._sdkContext = sdkContext;
    this._blockOffset = blockOffset;
    this._callAllowance = callAllowance;
  }

  async selectChannel(serviceClient) {
    const account = this._sdkContext.account;
    await serviceClient.loadOpenChannels();
    await serviceClient.updateChannelStates();
    const paymentChannels = serviceClient.paymentChannels;

    const serviceCallPrice = this._pricePerServiceCall(serviceClient) * this._callAllowance;

    const mpeBalance = await account.escrowBalance();
    const defaultExpiry = await this._defaultChannelExpiry(serviceClient);

    if (paymentChannels.length === 0) {
      if (mpeBalance >= serviceCallPrice) {
        return serviceClient.openChannel(serviceCallPrice, defaultExpiry);
      }

      return serviceClient.depositAndOpenChannel(serviceCallPrice, defaultExpiry);
    }

    const firstFundedValidChannel = (0, _lodash.find)(paymentChannels, paymentChanel => this._hasSufficientFunds(paymentChanel, serviceCallPrice) && this._isValid(paymentChanel, defaultExpiry));

    if (firstFundedValidChannel) {
      return firstFundedValidChannel;
    }

    const firstFundedChannel = (0, _lodash.find)(paymentChannels, paymentChanel => this._hasSufficientFunds(paymentChanel, serviceCallPrice));

    if (firstFundedChannel) {
      await firstFundedChannel.extendExpiry(defaultExpiry);
      return firstFundedChannel;
    }

    const firstValidChannel = (0, _lodash.find)(paymentChannels, paymentChanel => this._isValid(paymentChanel, defaultExpiry));

    if (firstValidChannel) {
      await firstValidChannel.addFunds(serviceCallPrice);
      return firstValidChannel;
    }

    const firstExpiredAndUnfundedChannel = paymentChannels[0];
    await firstExpiredAndUnfundedChannel.extendAndAddFunds(defaultExpiry, serviceCallPrice);
    return firstExpiredAndUnfundedChannel;
  }

  _pricePerServiceCall(serviceClient) {
    const {
      pricing
    } = serviceClient.group;
    const fixedPricing = (0, _lodash.find)(pricing, ({
      price_model
    }) => 'fixed_price' === price_model);
    return new _bignumber.BigNumber(fixedPricing.price_in_cogs);
  }

  _hasSufficientFunds(paymentChannel, amount) {
    return paymentChannel.state.availableAmount >= amount;
  }

  _isValid(paymentChannel, expiry) {
    return paymentChannel.state.expiry > expiry;
  }

  async _defaultChannelExpiry(serviceClient) {
    const currentBlockNumber = await this._sdkContext.web3.eth.getBlockNumber();
    return currentBlockNumber + serviceClient.group.payment_expiration_threshold + this._blockOffset;
  }

}

var _default = DefaultPaymentChannelManagementStrategy;
exports.default = _default;