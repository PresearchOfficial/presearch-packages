// GENERATED CODE -- DO NOT EDIT!

/* eslint-disable */
'use strict';

var grpc = require('grpc');

var state_service_pb = require('./state_service_pb.js');

function serialize_escrow_ChannelStateReply(arg) {
  if (!(arg instanceof state_service_pb.ChannelStateReply)) {
    throw new Error('Expected argument of type escrow.ChannelStateReply');
  }

  return Buffer.from(arg.serializeBinary());
}

function deserialize_escrow_ChannelStateReply(buffer_arg) {
  return state_service_pb.ChannelStateReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_escrow_ChannelStateRequest(arg) {
  if (!(arg instanceof state_service_pb.ChannelStateRequest)) {
    throw new Error('Expected argument of type escrow.ChannelStateRequest');
  }

  return Buffer.from(arg.serializeBinary());
}

function deserialize_escrow_ChannelStateRequest(buffer_arg) {
  return state_service_pb.ChannelStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_escrow_FreeCallStateReply(arg) {
  if (!(arg instanceof state_service_pb.FreeCallStateReply)) {
    throw new Error('Expected argument of type escrow.FreeCallStateReply');
  }

  return Buffer.from(arg.serializeBinary());
}

function deserialize_escrow_FreeCallStateReply(buffer_arg) {
  return state_service_pb.FreeCallStateReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_escrow_FreeCallStateRequest(arg) {
  if (!(arg instanceof state_service_pb.FreeCallStateRequest)) {
    throw new Error('Expected argument of type escrow.FreeCallStateRequest');
  }

  return Buffer.from(arg.serializeBinary());
}

function deserialize_escrow_FreeCallStateRequest(buffer_arg) {
  return state_service_pb.FreeCallStateRequest.deserializeBinary(new Uint8Array(buffer_arg));
} // PaymentChannelStateService contains methods to get the MultiPartyEscrow
// payment channel state.
// channel_id, channel_nonce, value and amount fields below in fact are
// Solidity uint256 values. Which are big-endian integers, see
// https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#formal-specification-of-the-encoding
// These values may be or may be not padded by zeros, service supports both
// options.


var PaymentChannelStateServiceService = exports.PaymentChannelStateServiceService = {
  // GetChannelState method returns a channel state by channel id.
  getChannelState: {
    path: '/escrow.PaymentChannelStateService/GetChannelState',
    requestStream: false,
    responseStream: false,
    requestType: state_service_pb.ChannelStateRequest,
    responseType: state_service_pb.ChannelStateReply,
    requestSerialize: serialize_escrow_ChannelStateRequest,
    requestDeserialize: deserialize_escrow_ChannelStateRequest,
    responseSerialize: serialize_escrow_ChannelStateReply,
    responseDeserialize: deserialize_escrow_ChannelStateReply
  }
};
exports.PaymentChannelStateServiceClient = grpc.makeGenericClientConstructor(PaymentChannelStateServiceService); // Used to determine free calls available for a given user.

var FreeCallStateServiceService = exports.FreeCallStateServiceService = {
  getFreeCallsAvailable: {
    path: '/escrow.FreeCallStateService/GetFreeCallsAvailable',
    requestStream: false,
    responseStream: false,
    requestType: state_service_pb.FreeCallStateRequest,
    responseType: state_service_pb.FreeCallStateReply,
    requestSerialize: serialize_escrow_FreeCallStateRequest,
    requestDeserialize: deserialize_escrow_FreeCallStateRequest,
    responseSerialize: serialize_escrow_FreeCallStateReply,
    responseDeserialize: deserialize_escrow_FreeCallStateReply
  }
};
exports.FreeCallStateServiceClient = grpc.makeGenericClientConstructor(FreeCallStateServiceService);