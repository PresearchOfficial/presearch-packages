'use strict';
const wn = require('wordnetjs');

async function dict(query) {
  let word = query.replace('define', '');
  return wn.lookup(word.trim());
}

async function trigger(query) {
  return query.includes('define');
}

module.exports = { dict, trigger };
