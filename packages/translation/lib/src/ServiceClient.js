import grpc, { InterceptingCall } from 'grpc';
import { BaseServiceClient, logger } from './sdk-core';
import { PaymentChannelStateServiceClient } from './proto/state_service_grpc_pb';
import ConcurrencyManager from './ConcurrencyManager';

class ServiceClient extends BaseServiceClient {
  /**
   * @param {SnetSDK} sdk
   * @param {String} orgId
   * @param {String} serviceId
   * @param {MPEContract} mpeContract
   * @param {ServiceMetadata} metadata
   * @param {Group} group
   * @param {GRPCClient} ServiceStub - GRPC service client constructor
   * @param {DefaultPaymentChannelManagementStrategy} paymentChannelManagementStrategy
   * @param {ServiceClientOptions} [options={}]
   */
  constructor(sdk, orgId, serviceId, mpeContract, metadata, group, ServiceStub, paymentChannelManagementStrategy, options) {
    super(sdk, orgId, serviceId, mpeContract, metadata, group, paymentChannelManagementStrategy, options);
    this._grpcService = this._constructGrpcService(ServiceStub);
    this._concurrencyManager = new ConcurrencyManager(paymentChannelManagementStrategy.concurrentCalls || 1, this);
  }

  /**
   * @type {GRPCClient}
   */
  get service() {
    return this._grpcService;
  }

  get concurrencyManager() {
    return this._concurrencyManager;
  }

  async getConcurrencyTokenAndChannelId() {
    return this._paymentChannelManagementStrategy.getConcurrencyTokenAndChannelId(this);
  }

  setConcurrencyTokenAndChannelId(token, channelId) {
    this.concurrencyManager.token = token
    this._paymentChannelManagementStrategy.channelId = channelId
  }

  _getChannelStateRequestMethodDescriptor() {
    return this.paymentChannelStateServiceClient.getChannelState.requestType;
  }

  _constructGrpcService(ServiceStub) {
    logger.debug('Creating service client', { tags: ['gRPC'] });
    const serviceEndpoint = this._getServiceEndpoint();
    const grpcChannelCredentials = this._getGrpcChannelCredentials(serviceEndpoint);
    const grpcOptions = this._generateGrpcOptions();
    logger.debug(`Service pointing to ${serviceEndpoint.host}, `, { tags: ['gRPC'] });
    return new ServiceStub(serviceEndpoint.host, grpcChannelCredentials, grpcOptions);
  }

  _generateGrpcOptions() {
    if(this._options.disableBlockchainOperations) {
      return {};
    }

    return {
      interceptors: [this._generateInterceptor()],
    };
  }

  _generateInterceptor() {
    return (options, nextCall) => {
      const requester = {
        start: async (metadata, listener, next) => {
          if(!this._paymentChannelManagementStrategy) {
            next(metadata, listener);
            return;
          }
          const paymentMetadata = await this._fetchPaymentMetadata();
          paymentMetadata.forEach((paymentMeta) => {
            Object.entries(paymentMeta).forEach(([key, value]) => {
              metadata.add(key, value);
            });
          });
          next(metadata, listener);
        },
      };
      return new InterceptingCall(nextCall(options), requester);
    };
  }

  _generatePaymentChannelStateServiceClient() {
    logger.debug('Creating PaymentChannelStateService client', { tags: ['gRPC'] });
    const serviceEndpoint = this._getServiceEndpoint();
    const grpcChannelCredentials = this._getGrpcChannelCredentials(serviceEndpoint);
    logger.debug(`PaymentChannelStateService pointing to ${serviceEndpoint.host}, `, { tags: ['gRPC'] });
    return new PaymentChannelStateServiceClient(serviceEndpoint.host, grpcChannelCredentials);
  }

  _getGrpcChannelCredentials(serviceEndpoint) {
    if(serviceEndpoint.protocol === 'https:') {
      logger.debug('Channel credential created for https', { tags: ['gRPC'] });
      return grpc.credentials.createSsl();
    }

    if(serviceEndpoint.protocol === 'http:') {
      logger.debug('Channel credential created for http', { tags: ['gRPC'] });
      return grpc.credentials.createInsecure();
    }

    const errorMessage = `Protocol: ${serviceEndpoint.protocol} not supported`;
    logger.error(errorMessage, { tags: ['gRPC'] });
    throw new Error(errorMessage);
  }
}

export default ServiceClient;
