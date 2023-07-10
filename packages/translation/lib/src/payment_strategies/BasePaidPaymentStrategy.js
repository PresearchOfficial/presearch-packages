import { logger } from '../sdk-core';

class BasePaidPaymentStrategy {
  /**
   * @param {BaseServiceClient} serviceClient
   * @param {number} blockOffset
   * @param {number} callAllowance
   */
  constructor(serviceClient, blockOffset = 240, callAllowance = 1) {
    this._serviceClient = serviceClient;
    this._blockOffset = blockOffset;
    this._callAllowance = callAllowance;
  }

  /**
   * @returns {Promise<PaymentChannel>}
   * @protected
   */
  async _selectChannel(preselectChannelId) {
    const { account } = this._serviceClient;
    await this._serviceClient.loadOpenChannels();
    await this._serviceClient.updateChannelStates();
    const { paymentChannels } = this._serviceClient;
    const serviceCallPrice = this._getPrice();
    const extendedChannelFund = serviceCallPrice * this._callAllowance;
    const mpeBalance = await account.escrowBalance();
    const defaultExpiration = await this._serviceClient.defaultChannelExpiration();
    const extendedExpiry = defaultExpiration + this._blockOffset;

    if(preselectChannelId) {
      const foundPreselectChannel = paymentChannels.find(el => el.channelId === preselectChannelId);
      if(foundPreselectChannel) {
        return foundPreselectChannel;
      }
    }

    let selectedPaymentChannel;
    if(paymentChannels.length < 1) {
      if(serviceCallPrice > mpeBalance) {
        selectedPaymentChannel = await this._serviceClient.depositAndOpenChannel(serviceCallPrice, extendedExpiry);
      } else {
        selectedPaymentChannel = await this._serviceClient.openChannel(serviceCallPrice, extendedExpiry);
      }
    } else {
      selectedPaymentChannel = paymentChannels[0];
    }
    const hasSufficientFunds = this._doesChannelHaveSufficientFunds(selectedPaymentChannel, serviceCallPrice);
    const isValid = this._isValidChannel(selectedPaymentChannel, defaultExpiration);
    if(hasSufficientFunds && !isValid) {
      await selectedPaymentChannel.extendExpiry(extendedExpiry);
    } else if(!hasSufficientFunds && isValid) {
      await selectedPaymentChannel.addFunds(extendedChannelFund);
    } else if(!hasSufficientFunds && !isValid) {
      await selectedPaymentChannel.extendAndAddFunds(extendedExpiry, extendedChannelFund);
    }
    return selectedPaymentChannel;
  }

  _getPrice() {
    logger.error('_getPrice must be implemented in the sub classes');
  }

  /**
   * @param {PaymentChannel} channel
   * @param {number} requiredAmount
   * @returns {boolean}
   * @private
   */
  _doesChannelHaveSufficientFunds(channel, requiredAmount) {
    return channel.state.availableAmount >= requiredAmount;
  }

  /**
   *
   * @param {PaymentChannel} channel
   * @param {number} expiry
   * @returns {boolean}
   * @private
   */
  _isValidChannel(channel, expiry) {
    return channel.state.expiry >= expiry;
  }
}

export default BasePaidPaymentStrategy;
