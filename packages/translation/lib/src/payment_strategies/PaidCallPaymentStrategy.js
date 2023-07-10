import BasePaidPaymentStrategy from './BasePaidPaymentStrategy';

class PaidCallPaymentStrategy extends BasePaidPaymentStrategy {
  /**
   * @param {BaseServiceClient} serviceClient
   * @param {number} blockOffset
   * @param {number} callAllowance
   */
  constructor(serviceClient, blockOffset = 240, callAllowance = 1) {
    super(serviceClient, blockOffset, callAllowance);
  }

  /**
   * @returns {Promise<[{'snet-payment-type': string}, {'snet-payment-channel-id': string}, {'snet-payment-channel-nonce': string}, {'snet-payment-channel-amount': string}, {'snet-payment-channel-signature-bin': Buffer}]>}
   */
  async getPaymentMetadata() {
    const channel = await this._selectChannel();
    const amount = channel.state.currentSignedAmount.toNumber() + this._getPrice();
    const signature = await this._generateSignature(channel.channelId, channel.state.nonce, amount);

    const metadata = [{ 'snet-payment-type': 'escrow' },
      { 'snet-payment-channel-id': `${channel.channelId}` },
      { 'snet-payment-channel-nonce': `${channel.state.nonce}` },
      { 'snet-payment-channel-amount': `${amount}` },
      { 'snet-payment-channel-signature-bin': signature },
    ];

    return metadata;
  }

  async _generateSignature(channelId, nonce, amount) {
    return this._serviceClient.signData({ t: 'string', v: '__MPE_claim_message' },
      { t: 'address', v: this._serviceClient.mpeContract.address },
      { t: 'uint256', v: channelId },
      { t: 'uint256', v: nonce },
      { t: 'uint256', v: amount });
  }

  /**
   * total price for all the service calls
   * @returns {number}
   * @private
   */
  _getPrice() {
    return this._serviceClient._pricePerServiceCall.toNumber();
  }
}

export default PaidCallPaymentStrategy;
