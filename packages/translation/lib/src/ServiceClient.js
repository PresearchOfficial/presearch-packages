"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _grpc = _interopRequireWildcard(require("grpc"));

var _sdkCore = require("./sdk-core");

var _state_service_grpc_pb = require("./proto/state_service_grpc_pb");

var _ConcurrencyManager = _interopRequireDefault(require("./ConcurrencyManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class ServiceClient extends _sdkCore.BaseServiceClient {
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
    this._concurrencyManager = new _ConcurrencyManager.default(paymentChannelManagementStrategy.concurrentCalls || 1, this);
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
    this.concurrencyManager.token = token;
    this._paymentChannelManagementStrategy.channelId = channelId;
  }

  _getChannelStateRequestMethodDescriptor() {
    return this.paymentChannelStateServiceClient.getChannelState.requestType;
  }

  _constructGrpcService(ServiceStub) {
    _sdkCore.logger.debug('Creating service client', {
      tags: ['gRPC']
    });

    const serviceEndpoint = this._getServiceEndpoint();

    const grpcChannelCredentials = this._getGrpcChannelCredentials(serviceEndpoint);

    const grpcOptions = this._generateGrpcOptions();

    _sdkCore.logger.debug(`Service pointing to ${serviceEndpoint.host}, `, {
      tags: ['gRPC']
    });

    return new ServiceStub(serviceEndpoint.host, grpcChannelCredentials, grpcOptions);
  }

  _generateGrpcOptions() {
    if (this._options.disableBlockchainOperations) {
      return {};
    }

    return {
      interceptors: [this._generateInterceptor()]
    };
  }

  _generateInterceptor() {
    return (options, nextCall) => {
      const requester = {
        start: async (metadata, listener, next) => {
          if (!this._paymentChannelManagementStrategy) {
            next(metadata, listener);
            return;
          }

          const paymentMetadata = await this._fetchPaymentMetadata();
          paymentMetadata.forEach(paymentMeta => {
            Object.entries(paymentMeta).forEach(([key, value]) => {
              metadata.add(key, value);
            });
          });
          next(metadata, listener);
        }
      };
      return new _grpc.InterceptingCall(nextCall(options), requester);
    };
  }

  _generatePaymentChannelStateServiceClient() {
    _sdkCore.logger.debug('Creating PaymentChannelStateService client', {
      tags: ['gRPC']
    });

    const serviceEndpoint = this._getServiceEndpoint();

    const grpcChannelCredentials = this._getGrpcChannelCredentials(serviceEndpoint);

    _sdkCore.logger.debug(`PaymentChannelStateService pointing to ${serviceEndpoint.host}, `, {
      tags: ['gRPC']
    });

    return new _state_service_grpc_pb.PaymentChannelStateServiceClient(serviceEndpoint.host, grpcChannelCredentials);
  }

  _getGrpcChannelCredentials(serviceEndpoint) {
    if (serviceEndpoint.protocol === 'https:') {
      _sdkCore.logger.debug('Channel credential created for https', {
        tags: ['gRPC']
      });

      return _grpc.default.credentials.createSsl();
    }

    if (serviceEndpoint.protocol === 'http:') {
      _sdkCore.logger.debug('Channel credential created for http', {
        tags: ['gRPC']
      });

      return _grpc.default.credentials.createInsecure();
    }

    const errorMessage = `Protocol: ${serviceEndpoint.protocol} not supported`;

    _sdkCore.logger.error(errorMessage, {
      tags: ['gRPC']
    });

    throw new Error(errorMessage);
  }

}

var _default = ServiceClient;
exports.default = _default;