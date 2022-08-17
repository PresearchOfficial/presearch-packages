'use strict';

const DEFAULT_LENGTH = 12; 
const terms = require("./trigger-terms.json");

/**
 * Execute the lorem ipsum generation using the provided word length
 * @param {int} len
 * @returns {String}
 */
function generate(len) {
	const words = ["ad", "adipisicing", "aliqua", "aliquip", "amet", "anim", "aute", "cillum", "commodo", "consectetur", "consequat", "culpa", "cupidatat", "deserunt", "do", "dolor", "dolore", "duis", "ea", "eiusmod", "elit", "enim", "esse", "est", "et", "eu", "ex", "excepteur", "exercitation", "fugiat", "id", "in", "incididunt", "ipsum", "irure", "labore", "laboris", "laborum", "Lorem", "magna", "minim", "mollit", "nisi", "non", "nostrud", "nulla", "occaecat", "officia", "pariatur", "proident", "qui", "quis", "reprehenderit", "sint", "sit", "sunt", "tempor", "ullamco", "ut", "velit", "veniam", "voluptate"];
    let res = "";
    let length = DEFAULT_LENGTH;

  if (len && Number.isInteger(len) && (len > DEFAULT_LENGTH && len <= 1000)) {
    length = len;
  }

    for (let i = 0; i < length; i++) {
        const pos = Math.floor(Math.random() * (words.length - 1));
        res += words[pos] + " ";
    }

    return res.charAt(0).toUpperCase() + res.slice(1).trim() + ".";
}

/**
 * Parses the query and normalizes it
 * @param {String} query
 * @returns {int}
 */
function parseAndNormalize(query) {
  for (let term of terms) {
    if (query.startsWith(term.toLowerCase())) {
      const queryArray = query.trim().split(" ");
      const lastQueryString = queryArray[queryArray.length - 1];
      const num = parseInt(lastQueryString) || undefined;
      if (num !== undefined) {
        return num;
      }
      return DEFAULT_LENGTH;
    }
  }
  return undefined;
}

module.exports = { DEFAULT_LENGTH, parseAndNormalize, generate };
