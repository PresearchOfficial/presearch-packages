'use strict';
const mathjs = require('mathjs');

async function math(query) {
  return mathjs.eval(query);
}

async function trigger(query) {
  try {
    mathjs.eval(query);
    return true;
  }
  catch (error) {
    return false;
  }
}

module.exports = { math, trigger };
