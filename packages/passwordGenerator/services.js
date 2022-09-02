'use strict';

const DEFAULT_LENGTH = 8; 

/**
 * Execute the password generation using the provided character length
 * @param {int} len
 * @returns {String}
 */
function generate(len) {
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
  let res = "";
  let length = 8;

  if (len && Number.isInteger(len) && (len > 8 && len <= 64)) {
    length = len;
  }

  for (let i = 0, n = chars.length; i < length; ++i) {
      res += chars.charAt(Math.floor(Math.random() * n));
  }
  return res;
}

/**
 * Parses the query and normalizes it
 * @param {String} query
 * @returns {int}
 */
function parseAndNormalize(query) {
  const terms = ["randompassword", "randompw","pass","password","random password","random pw","generate password","pwd"];
  
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
