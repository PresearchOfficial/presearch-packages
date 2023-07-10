"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sdkCore = _interopRequireWildcard(require("./sdk-core"));

var _ServiceClient = _interopRequireDefault(require("./ServiceClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class NodeSdk extends _sdkCore.default {
  /**
   * @param {string} orgId
   * @param {string} serviceId
   * @param {GRPCClient} ServiceStub GRPC service client constructor
   * @param {string} [groupName]
   * @param {PaymentChannelManagementStrategy} [paymentChannelManagementStrategy=DefaultPaymentChannelManagementStrategy]
   * @param {ServiceClientOptions} [options]
   * @param {number} concurrentCalls
   * @returns {Promise<ServiceClient>}
   */
  async createServiceClient(orgId, serviceId, ServiceStub, groupName = null, paymentChannelManagementStrategy = null, options = {}, concurrentCalls = 1) {
    const serviceMetadata = await this._metadataProvider.metadata(orgId, serviceId);
    const group = await this._serviceGroup(serviceMetadata, orgId, serviceId, groupName);

    const paymentStrategy = this._constructStrategy(paymentChannelManagementStrategy, concurrentCalls || 1);

    const serviceClient = new _ServiceClient.default(this, orgId, serviceId, this._mpeContract, serviceMetadata, group, ServiceStub, paymentStrategy, options);
    return serviceClient;
  }

  _createIdentity() {
    return new _sdkCore.PrivateKeyIdentity(this._config, this._web3);
  }

}

var _default = NodeSdk;
exports.default = _default;