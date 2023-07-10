"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ethjs = _interopRequireDefault(require("ethjs"));

var _ethereumUtils = require("../utils/ethereumUtils");

var _logger = _interopRequireDefault(require("../utils/logger"));

var _blockchainEvents = _interopRequireDefault(require("../utils/blockchainEvents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @implements Identity
 */
class MetaMaskIdentity {
  /**
   * @param {Config} config
   * @param {Web3} web3
   */
  constructor(config, web3) {
    this._eth = new _ethjs.default(config.web3Provider);
    this._web3 = web3;
    this.setupAccount();
  }

  async getAddress() {
    const {
      ethereum
    } = window;
    const accounts = await ethereum.request({
      method: _ethereumUtils.ethereumMethods.REQUEST_ACCOUNTS
    });
    return accounts[0];
  }

  async signData(sha3Message) {
    const address = await this.getAddress();
    return this._eth.personal_sign(sha3Message, address);
  }

  async sendTransaction(transactionObject) {
    return new Promise((resolve, reject) => {
      const method = this._web3.eth.sendTransaction(transactionObject).on(_blockchainEvents.default.ERROR, error => {
        _logger.default.error(`Couldn't send transaction. ${error}`);

        reject(error);
      }).once(_blockchainEvents.default.CONFIRMATION, async (_confirmationNumber, receipt) => {
        if (receipt.status) {
          resolve(receipt);
        } else {
          reject(receipt);
        }

        await method.off();
      });
    });
  }

  async setupAccount() {
    const {
      ethereum
    } = window;

    if (typeof ethereum !== 'undefined') {
      const accounts = await ethereum.request({
        method: _ethereumUtils.ethereumMethods.REQUEST_ACCOUNTS
      });
      this._web3.eth.defaultAccount = accounts[0];
    } else {
      _logger.default.error('Metamask is not installed');
    }
  }

}

var _default = MetaMaskIdentity;
exports.default = _default;