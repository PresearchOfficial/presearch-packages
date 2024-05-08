'use strict';

const DEFAULT_LENGTH = 8;
const MIN_LENGTH = 8;
const MAX_LENGTH = 64;

/**
 * Execute the password generation using the provided options
 * @param {options} {length, number, symbols, uppercase, exclude}
 * @returns {String}
 */
function generate(options) {
  const nums = "0123456789";
  const symbols = "!@#$%^&*()_+~|}{[]:;?><,./-=";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let pool = lowercase + (options.uppercase ? uppercase : '') + (options.numbers ? nums : '') + (options.symbols ? symbols : '');

  // excludes characters from the pool
  var i = options.exclude.length ?? 0;
  while (i--) {
    pool = pool.replace(options.exclude[i], '');
  }


  let res = "";
  let length = options.length && (options.length > MIN_LENGTH && options.length <= MAX_LENGTH) ? options.length : DEFAULT_LENGTH;

  for (let i = 0, n = pool.length; i < length; ++i) {
    res += pool.charAt(Math.floor(Math.random() * n));
  }
  return res;
}


/**
 * Parses the query and normalizes it
 * @param {String} query
 * @returns {options} {length, number, symbols, uppercase, exclude}
*/
function parseAndNormalize(query) {
  const terms = ["randompassword", "randompw", "pass", "password", "random password", "random pw", "generate password", "pwd"];
  const queryToLowerCase = query.toLowerCase();

  let exclude = [];
  let length = DEFAULT_LENGTH;
  let numbers = !queryToLowerCase.includes("nn") && !queryToLowerCase.includes("no-numbers");
  let symbols = !queryToLowerCase.includes("ns") && !queryToLowerCase.includes("no-symbols");
  let uppercase = !queryToLowerCase.includes("nu") && !queryToLowerCase.includes("no-uppercase");

  for (let term of terms) {
    const termLowerCase = term.toLowerCase();

    if (queryToLowerCase.startsWith(termLowerCase)) {
      const queryArray = queryToLowerCase.trim().split(" ");


      if (queryArray.length >= 2) {
        const num = parseInt(queryArray[1]) || undefined;
        if (num !== undefined) {
          length = num;
        }
      }

      if (queryArray.length >= 3) {
        for (const char of queryArray[2]) {
          exclude.push(char);
        }
      }

      return { length, numbers, symbols, uppercase, exclude };

    }
  }
  return undefined;

}

module.exports = { DEFAULT_LENGTH, parseAndNormalize, generate };
