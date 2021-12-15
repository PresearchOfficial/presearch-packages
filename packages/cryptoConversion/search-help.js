'use strict';

const bs = require('binary-search');
const fs = require('fs').promises;
const { waitUntil } = require('async-wait-until');

// we are limited by the API and also javascript native precision unless we use a big number module
const MAX = 1000000000;
const MIN = 0.00000001;
const DECIMAL_PLACES = 8;
let loaded = false;
const files = {};
const DATA_DIR = 'data';

/* Note:
* (1) returns false if a valid qty is not found
* (2) 42 is the symbol of a crypto, so if a number is the only value, then don't consider it a qty
* (3) string needs to be trimmed first
* (4) zero/negative numbers do not count as a valid qty
*/
const parseQty = (string) => {
    // I would like to parse the number based on a user's locale, for now just remove commas
    const firstWord = string.substr(0, string.indexOf(' ')).replace(/,/g, '');
    const num = Number(firstWord);
    if (num > 0 && firstWord.search(/[^0-9.e+-]/) === -1) {
        if (num > MAX) return MAX;
        if (num < MIN) return MIN;
        return Number(num.toFixed(DECIMAL_PLACES));
    }
    return false;
};

const getQty = (string) => {
    const result = parseQty(string);
    if (result === false) {
        return { qty: 1, found: false };
    }
    return { qty: result, found: true };
};

const fieldCompare = (field) => (object, search) => (object[field] < search ? -1 : (object[field] > search ? 1 : 0));
const fieldEquate = (field) => (a, b) => a[field] === b[field];

// this is needed in case cryptos have duplicate names, we want to prioritize based on rank (market cap)
const firstOccurrence = (a, v, compare, equate) => {
    let found = bs(a, v, compare);
    // i'm assuming a small amount of duplicates
    let i = found - 1;
    while (i >= 0) {
        if (equate(a[found], a[i])) {
            found = i;
            i -= 1;
        } else {
            break;
        }
    }
    return found;
};

const searchFile = async (file, search, field) => {
    const result = {
        found: false,
        item: {}
    };
    if (file.length === 0) return result;

    const i = firstOccurrence(file, search, fieldCompare(field), fieldEquate(field));
    if (i >= 0) {
        result.found = true;
        result.item = file[i];
    }
    return result;
};

const findCurrency = async (search) => {
    await waitUntil(() => loaded, { timeout: 1000, intervalBetweenAttempts: 25 });
    const [cryptoSymbol, cryptoName, fiatSymbol, fiatName] = await Promise.all([
        searchFile(files.cryptoSymbols, search, 'symbol'),
        searchFile(files.cryptoNames, search, 'name'),
        searchFile(files.fiatSymbols, search, 'symbol'),
        searchFile(files.fiatNames, search, 'name')
    ]);

    // prioritize symbols first
    const result = fiatSymbol.found ? fiatSymbol
        : cryptoSymbol.found ? cryptoSymbol
            : fiatName.found ? fiatName : cryptoName; // found could be true or false

    if (result.found) {
        const metadata = await searchFile(files.metadata, result.item.id, 'id');
        result.found = metadata.found;
        result.item.display = metadata.item.display;
    }
    return result;
};

const parseFile = async (file) => JSON.parse(file);
const loadAndParse = async (name) => parseFile(await fs.readFile(`${__dirname}/${DATA_DIR}/${name}.json`, 'utf8'));

async function loadFiles() {
    try {
        [files.cryptoNames, files.cryptoSymbols, files.fiatNames, files.fiatSymbols, files.metadata] = await Promise.all([
            loadAndParse('crypto_names'),
            loadAndParse('crypto_symbols'),
            loadAndParse('fiat_names'),
            loadAndParse('fiat_symbols'),
            loadAndParse('currency_metadata')
        ]);
    } catch (error) {
        // it will fail later
    }
    loaded = true;
}

module.exports = (function initSearchHelp() {
    loadFiles(); // async
    return {
        // for real use - getQty, findCurrency
        // for unit tests only - firstOccurrence, fieldCompare, MAX, MIN, files
        getQty, findCurrency, firstOccurrence, fieldCompare, MAX, MIN, files
    };
}());
