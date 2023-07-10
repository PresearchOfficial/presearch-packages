import grpc from 'grpc';
import services from '../proto/state_service_grpc_pb';
import { logger, EncodingUtils } from '../sdk-core';

class FreeCallPaymentStrategy {
  constructor(serviceClient) {
    this._serviceClient = serviceClient;
    this._freeCallStateServiceClient = this._generateFreeCallStateServiceClient();
    this._encodingUtils = new EncodingUtils();
  }

  /**
   * Check if there is any freecalls left for x service.
   * @returns {Promise<boolean>}
   */
  async isFreeCallAvailable() {
    try {
      const freeCallsAvailableReply = await this._getFreeCallsAvailable();
      // Bypassing free calls if the token is empty
      const freeCallsAvailable = freeCallsAvailableReply ? freeCallsAvailableReply.getFreeCallsAvailable() : 0;
      console.log('freeCallsAvailable', freeCallsAvailable);
      return freeCallsAvailable > 0;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }

  /**
   * generate free call payment metadata
   * @returns {Promise<({'snet-free-call-auth-token-bin': FreeCallConfig.tokenToMakeFreeCall}|{'snet-free-call-token-expiry-block': *}|{'snet-payment-type': string}|{'snet-free-call-user-id': *}|{'snet-current-block-number': *})[]>}
   */
  async getPaymentMetadata() {
    console.log('get payment metadat');
    const { email, tokenToMakeFreeCall, tokenExpiryDateBlock } = this._serviceClient.getFreeCallConfig();
    const currentBlockNumber = await this._serviceClient.getCurrentBlockNumber();
    const signature = await this._generateSignature(currentBlockNumber);
    const tokenBytes = this._encodingUtils.hexStringToBytes(tokenToMakeFreeCall);
    const metadata = [
      { 'snet-free-call-auth-token-bin': tokenBytes },
      { 'snet-free-call-token-expiry-block': `${tokenExpiryDateBlock}` },
      { 'snet-payment-type': 'free-call' },
      { 'snet-free-call-user-id': email },
      { 'snet-current-block-number': `${currentBlockNumber}` },
      { 'snet-payment-channel-signature-bin': signature }];

    return metadata;
  }

  /**
   * fetch the free calls available data from daemon
   * @returns {Promise<FreeCallStateReply>}
   * @private
   */
  async _getFreeCallsAvailable() {
    const freeCallStateRequest = await this._getFreeCallStateRequest();
    if(!freeCallStateRequest) {
      // Bypassing free calls if the token is empty
      return undefined;
    }
    return new Promise((resolve, reject) => {
      this._freeCallStateServiceClient.getFreeCallsAvailable(freeCallStateRequest, (error, responseMessage) => {
        if(error) {
          console.log('freecalls error', error);
          reject(error);
        } else {
          resolve(responseMessage);
        }
      });
    });
  }

  /**
   *
   * @returns {Promise<Bytes<Signature>>>}
   * @private
   */
  async _generateSignature(currentBlockNumber) {
    const { orgId, serviceId, groupId } = this._serviceClient.getServiceDetails();
    const { email, tokenToMakeFreeCall, tokenExpiryDateBlock } = this._serviceClient.getFreeCallConfig();
    if(tokenExpiryDateBlock === 0 || !email || email.length === 0) {
      throw Error('invalid entries');
    }
    const enhancedToken = /^0x/.test(tokenToMakeFreeCall.toLowerCase())
      ? tokenToMakeFreeCall.substring(2, tokenToMakeFreeCall.length) : tokenToMakeFreeCall;
    return this._serviceClient.signData(
      { t: 'string', v: '__prefix_free_trial' },
      { t: 'string', v: email },
      { t: 'string', v: orgId },
      { t: 'string', v: serviceId },
      { t: 'string', v: groupId },
      { t: 'uint256', v: currentBlockNumber },
      { t: 'bytes', v: enhancedToken },
    );
  }

  /**
   * create the request for the freecall state service grpc
   * @returns {FreeCallStateRequest}
   * @private
   */
  async _getFreeCallStateRequest() {
    const Request = this._freeCallStateServiceClient.getFreeCallsAvailable.requestType;
    const request = new Request();

    const {
      userId, tokenForFreeCall, tokenExpiryDateBlock, signature, currentBlockNumber,
    } = await this._getFreeCallStateRequestProperties();

    //  if the token for freecall is empty, then user is taken to paid call directly
    if(!tokenForFreeCall) {
      return undefined;
    }

    const tokenBytes = this._encodingUtils.hexStringToBytes(tokenForFreeCall);
    request.setUserId(userId);
    request.setTokenForFreeCall(tokenBytes);
    request.setTokenExpiryDateBlock(tokenExpiryDateBlock);
    request.setSignature(signature);
    request.setCurrentBlock(currentBlockNumber);
    return request;
  }

  async _getFreeCallStateRequestProperties() {
    const { email, tokenToMakeFreeCall, tokenExpiryDateBlock } = this._serviceClient.getFreeCallConfig();
    const currentBlockNumber = await this._serviceClient.getCurrentBlockNumber();
    const signature = await this._generateSignature(currentBlockNumber);
    return {
      userId: email, tokenForFreeCall: tokenToMakeFreeCall, tokenExpiryDateBlock, signature, currentBlockNumber,
    };
  }

  /**
   * create the grpc client for free call state service
   * @returns {module:grpc.Client}
   * @private
   */
  _generateFreeCallStateServiceClient() {
    const serviceEndpoint = this._serviceClient._getServiceEndpoint();
    const grpcCredentials = this._getGrpcCredentials(serviceEndpoint);
    return new services.FreeCallStateServiceClient(serviceEndpoint.host, grpcCredentials);
  }

  /**
   * generate options for the grpc call for respective protocol
   * @param {{host:String, protocol:String}} serviceEndpoint
   * @returns {*} grpcOptions
   * @private
   */
  _getGrpcCredentials(serviceEndpoint) {
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

export default FreeCallPaymentStrategy;
