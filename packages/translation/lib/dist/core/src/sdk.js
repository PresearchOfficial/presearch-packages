"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _web = _interopRequireDefault(require("web3"));

var _lodash = require("lodash");

var _Account = _interopRequireDefault(require("./Account"));
var DefaultPaymentStrategy = _interopRequireDefault(require("../../payment_strategies")).DefaultPaymentStrategy;

var _MPEContract = _interopRequireDefault(require("./MPEContract"));

var _logger = _interopRequireDefault(require("./utils/logger"));

var _IPFSMetadataProvider = _interopRequireDefault(require("./IPFSMetadataProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_CONFIG = {
  defaultGasLimit: 210000,
  defaultGasPrice: 4700000,
  ipfsEndpoint: 'http://ipfs.singularitynet.io:80'
};

class SnetSDK {
  /**
   * @param {Config} config
   * @param {MetadataProvider} metadataProvider
   */
  constructor(config, metadataProvider = undefined) {
    this._config = { ...DEFAULT_CONFIG,
      ...config
    };
    const options = {
      defaultGas: this._config.defaultGasLimit,
      defaultGasPrice: this._config.defaultGasPrice
    };
    this._networkId = config.networkId;
    this._web3 = new _web.default(config.web3Provider, null, options);

    const identity = this._createIdentity();

    this._mpeContract = new _MPEContract.default(this._web3, this._networkId);
    this._account = new _Account.default(this._web3, this._networkId, this._mpeContract, identity);
    this._metadataProvider = metadataProvider || new _IPFSMetadataProvider.default(this._web3, this._networkId, this._config.ipfsEndpoint);
  }
  /**
   * @type {Account}
   */


  get account() {
    return this._account;
  }
  /**
   * @type {Web3}
   */


  get web3() {
    return this._web3;
  }

  set paymentChannelManagementStrategy(paymentChannelManagementStrategy) {
    this._paymentChannelManagementStrategy = paymentChannelManagementStrategy;
  }

  async _serviceGroup(serviceMetadata, orgId, serviceId, groupName = undefined) {
    const group = this._findGroup(serviceMetadata.groups, groupName);

    if (!group) {
      const errorMessage = `Group[name: ${groupName}] not found for orgId: ${orgId} and serviceId: ${serviceId}`;

      _logger.default.error(errorMessage);

      throw new Error(errorMessage);
    }

    return group;
  }

  _findGroup(groups, groupName) {
    if (!groupName) {
      return (0, _lodash.first)(groups);
    }

    return (0, _lodash.find)(groups, ({
      group_name
    }) => group_name === groupName);
  }

  _constructStrategy(paymentChannelManagementStrategy, concurrentCalls = 1) {
    if (paymentChannelManagementStrategy) {
      return paymentChannelManagementStrategy;
    }

    if (this._paymentChannelManagementStrategy) {
      return this._paymentChannelManagementStrategy;
    }

    _logger.default.debug('PaymentChannelManagementStrategy not provided, using DefaultPaymentChannelManagementStrategy'); // return new DefaultPaymentChannelManagementStrategy(this);


    return new DefaultPaymentStrategy(concurrentCalls);
  }

  _createIdentity() {
    _logger.default.error('_createIdentity must be implemented in the sub classes');
  }

}

var _default = SnetSDK;
exports.default = _default;
exports.SnetSDK = SnetSDK;