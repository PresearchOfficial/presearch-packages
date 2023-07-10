// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var translate_pb = require('./translate_pb.js');

function serialize_Input(arg) {
  if (!(arg instanceof translate_pb.Input)) {
    throw new Error('Expected argument of type Input');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Input(buffer_arg) {
  return translate_pb.Input.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Output(arg) {
  if (!(arg instanceof translate_pb.Output)) {
    throw new Error('Expected argument of type Output');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Output(buffer_arg) {
  return translate_pb.Output.deserializeBinary(new Uint8Array(buffer_arg));
}


var RomanceTranslatorService = exports.RomanceTranslatorService = {
  translate: {
    path: '/RomanceTranslator/translate',
    requestStream: false,
    responseStream: false,
    requestType: translate_pb.Input,
    responseType: translate_pb.Output,
    requestSerialize: serialize_Input,
    requestDeserialize: deserialize_Input,
    responseSerialize: serialize_Output,
    responseDeserialize: deserialize_Output,
  },
};

exports.RomanceTranslatorClient = grpc.makeGenericClientConstructor(RomanceTranslatorService);
