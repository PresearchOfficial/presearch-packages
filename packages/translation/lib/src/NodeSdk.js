import SnetSDK, { PrivateKeyIdentity } from './sdk-core';
import ServiceClient from './ServiceClient';

class NodeSdk extends SnetSDK {
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
    const serviceClient = new ServiceClient(this, orgId, serviceId, this._mpeContract, serviceMetadata, group, ServiceStub, paymentStrategy, options);
    return serviceClient;
  }

  _createIdentity() {
    return new PrivateKeyIdentity(this._config, this._web3);
  }
}

export default NodeSdk;
