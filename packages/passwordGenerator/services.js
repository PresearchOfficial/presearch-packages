'use strict';

const DEFAULT_LENGTH = 8;
const MIN_LENGTH = 8;
const MAX_LENGTH = 64;

const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+~|}{[]:;?><,./-=";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const TERMS = ["randompassword", "randompw", "pass", "password", "random password", "random pw", "generate password", "pwd", "random pwd"];
const EXCLUDE_TERMS = ["no-numbers", "no-symbols", "no-uppercase", "nn", "ns", "nu"];

/**
  * Create the pool of characters based on the options to generate the password
  * @param {options} {number, symbols, uppercase, exclude}
  * @returns {String}
 */
function createPool(options) {
  let pool = LOWERCASE;
  if (options.uppercase) pool += UPPERCASE;
  if (options.numbers) pool += NUMBERS;
  if (options.symbols) pool += SYMBOLS;

  // excludes characters from the pool
  let i = options.exclude.length ?? 0;
  while (i--) {
    pool = pool.replace(options.exclude[i], '');
  }

  return pool;
}

/**
 * Execute the password generation using the provided options
 * @param {options} {length, number, symbols, uppercase, exclude}
 * @returns {String}
 */
function generate(options) {
  let pool = createPool(options);

  let res = "";
  let length = options.length && (options.length > MIN_LENGTH && options.length <= MAX_LENGTH) ? options.length : DEFAULT_LENGTH;

  for (let i = 0, n = pool.length; i < length; ++i) {
    res += pool.charAt(Math.floor(Math.random() * n));
  }
  return res;
}

/**
 * Parses the query and normalizes it
 * @param {String} queryLowerCase
 * @returns {options} {length, number, symbols, uppercase, exclude}
*/
function parseAndNormalize(query) {
  const queryLowerCase = query.toLowerCase();

  const numbers = !queryLowerCase.includes("nn") && !queryLowerCase.includes("no-numbers");
  const symbols = !queryLowerCase.includes("ns") && !queryLowerCase.includes("no-symbols");
  const uppercase = !queryLowerCase.includes("nu") && !queryLowerCase.includes("no-uppercase");

  let exclude = [];
  let length = DEFAULT_LENGTH;


  for (let term of TERMS) {
    const termLowerCase = term.toLowerCase();

    if (queryLowerCase.startsWith(termLowerCase)) {
      const queryWithoutTerm = queryLowerCase.replace(termLowerCase, '');
      const queryArray = queryWithoutTerm.trim().split(' ');

      const num = parseInt(queryArray[0]) || undefined;
      if (num !== undefined) {
        length = num;
      }

      if (queryArray.length >= 2 && !EXCLUDE_TERMS.includes(queryArray[1])) {
        for (const char of queryArray[1]) {
          exclude.push(char);
        }
      }

      return { length, numbers, symbols, uppercase, exclude };
    }
  }
  return undefined;
}

module.exports = { DEFAULT_LENGTH, parseAndNormalize, generate };
