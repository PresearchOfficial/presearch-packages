#!/bin/bash

if [ ! -d "./packages/$1" ]; then
  echo "Creating package: $1"
  mkdir "./packages/$1"
  cd "./packages/$1"
  touch index.js
  npm init
fi

if [ -d "./packages/$1" ]; then
  echo "Package with the same name already exisits, please choose another name"
fi