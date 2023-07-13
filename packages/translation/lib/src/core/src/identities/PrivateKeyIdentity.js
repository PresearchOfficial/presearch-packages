"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ethereumjsTx = _interopRequireDefault(require("ethereumjs-tx"));

var _logger = _interopRequireDefault(require("../utils/logger"));

var _blockchainEvents = _interopRequireDefault(require("../utils/blockchainEvents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @implements Identity
 */
class PrivateKeyIdentity {
  /**
   * @param {Config} config
   * @param {Web3} web3
   */
  constructor(config, web3) {
    this._web3 = web3;
    this._pk = config.privateKey;

    this._setupAccount();
  }

  get address() {
    return this._web3.eth.defaultAccount;
  }

  async getAddress() {
    return this._web3.eth.defaultAccount;
  }

  async signData(sha3Message) {
    const {
      signature
    } = this._web3.eth.accounts.sign(sha3Message, this._pk);

    return signature;
  }

  async sendTransaction(transactionObject) {
    const signedTransaction = this._signTransaction(transactionObject);

    return new Promise((resolve, reject) => {
      const method = this._web3.eth.sendSignedTransaction(signedTransaction);

      method.once(_blockchainEvents.default.CONFIRMATION, async (_confirmationNumber, receipt) => {
        console.log('blockchain confirmation count', _confirmationNumber);
        console.log('blockchain confirmation receipt status', receipt.status);

        if (receipt.status) {
          resolve(receipt);
        } else {
          reject(receipt);
        }

        await method.off();
      });
      method.on(_blockchainEvents.default.ERROR, error => {
        console.log('blockchain error', error);
        reject(error);
      });
      method.once(_blockchainEvents.default.TRANSACTION_HASH, hash => {
        console.log('waiting for blockchain txn', hash);
      });
      method.once(_blockchainEvents.default.RECEIPT, receipt => {
        console.log('blockchain receipt', receipt.status);
      });
    });
  }

  _signTransaction(txObject) {
    const transaction = new _ethereumjsTx.default(txObject);
    const privateKey = Buffer.from(this._pk.slice(2), 'hex');
    transaction.sign(privateKey);
    const serializedTransaction = transaction.serialize();
    return `0x${serializedTransaction.toString('hex')}`;
  }

  _setupAccount() {
    const account = this._web3.eth.accounts.privateKeyToAccount(this._pk);

    this._web3.eth.accounts.wallet.add(account);

    this._web3.eth.defaultAccount = account.address;
  }

}

var _default = PrivateKeyIdentity;
exports.default = _default;