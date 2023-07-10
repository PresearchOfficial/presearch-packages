// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
'use strict';
var grpc = require('grpc');
var token_service_pb = require('./token_service_pb.js');

function serialize_escrow_TokenReply(arg) {
  if (!(arg instanceof token_service_pb.TokenReply)) {
    throw new Error('Expected argument of type escrow.TokenReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_escrow_TokenReply(buffer_arg) {
  return token_service_pb.TokenReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_escrow_TokenRequest(arg) {
  if (!(arg instanceof token_service_pb.TokenRequest)) {
    throw new Error('Expected argument of type escrow.TokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_escrow_TokenRequest(buffer_arg) {
  return token_service_pb.TokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// It is expected that the user would call the GetChannelState to Determine the Current state of the Channel
// Based on the usage forecast, the user/client will have to sign for an amount L + U , where L is the last amount Signed
// and U is the amount based on expected usage.
// Please be aware that the Signing up an amount upfront ( Pre Paid) does come with a risk and hence the
// user must exercise caution on the amount signed specially with new service providers.
// If there is no need of making concurrent calls then you may consider pay per mode.
// Using a Token, the Client can now make concurrent calls, which was not supported previously with the pay per mode.
// However the pay per mode is a lot secure than the pre-paid mode.
var TokenServiceService = exports.TokenServiceService = {
  // GetToken method checks the Signature sent and returns a Token
// 1) The Signature is valid and has to be signed in the below format
// "__MPE_claim_message"+MpeContractAddress+ChannelID+ChannelNonce+SignedAmount
// Signature is to let the Service Provider make a claim
// 2) Signed amount >= Last amount Signed.
//  if Signed amount == Last Signed amount , then check if planned_amount < used_amount
//  if Signed amount > Last Signed amount , then update the planned amount = Signed Amount
// GetToken method in a way behaves as a renew Token too!.
getToken: {
    path: '/escrow.TokenService/GetToken',
    requestStream: false,
    responseStream: false,
    requestType: token_service_pb.TokenRequest,
    responseType: token_service_pb.TokenReply,
    requestSerialize: serialize_escrow_TokenRequest,
    requestDeserialize: deserialize_escrow_TokenRequest,
    responseSerialize: serialize_escrow_TokenReply,
    responseDeserialize: deserialize_escrow_TokenReply,
  },
};

exports.TokenServiceClient = grpc.makeGenericClientConstructor(TokenServiceService);
