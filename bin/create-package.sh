#!/bin/bash

if [ ! -d "./packages/$1" ]; then
  echo "Creating package: $1"
  mkdir "./packages/$1"
  cd "./packages/$1"
  touch index.js
  printf "'use strict';\n\nasync function $1(query) {\n\tconst stuff = 'foo';\n\treturn \`<span>Some markup</span>\`;\n}\n\nasync function trigger(query) {\n\treturn query === 'foo' ? true : false;\n}\n\nmodule.exports = { $1, trigger };" > index.js
  npm init
fi

if [ -d "./packages/$1" ]; then
  echo "Package with the same name already exisits, please choose another name"
fi
