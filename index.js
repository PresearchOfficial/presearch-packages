'use strict';

const fs = require('fs');

const moduleExports = {};

fs.readdir(`${__dirname}/packages`, (err, dirs) => {
  if (!err) {
    dirs.map(dir => moduleExports[dir] = require(`${__dirname}/packages/${dir}`))
  }
  else {
    throw err;
  }
});

module.exports = moduleExports;
