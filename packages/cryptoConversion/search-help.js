'use strict';
//todo if duplicates, the result is arbitary but this is not what we want
const bs = require('binary-search');
const fs = require('fs').promises;

//we are limited by the API and also javascript native precision
//unless we use a big number module
const MAX = 1000000000;
const MIN = 0.00000001;
const DECIMAL_PLACES = 8;
const files = {};

//todo allow different number formats
/* Note:
* (1) returns 1 if a qty is not found
* (2) 42 is the symbol of a crypto, so if a number is the only value, then don't consider it a qty
* (3) string needs to be trimmed first
* (4) zero/negative numbers do not count as a valid qty
*/
const getQty = string => {
	const firstWord = string.substr(0, string.indexOf(' '));
    const num = Number(firstWord);

	if(num > 0 && firstWord.search(/[^0-9.e+-]/) === -1) {
        if(num > MAX) return MAX;
        if(num < MIN) return MIN;
        return Number(num.toFixed(DECIMAL_PLACES));
	}

	return 1;
};

const fieldCompare = field => {
    return (object, search) => {
        return object[field] < search ? -1 : (
            object[field] > search ? 1 : 0
        );
    };
};

const searchFile = async (file, search, field) => {
	const result = {
		found: false,
		item: {}
	};

	const i = bs(file, search, fieldCompare(field));
	if(i >= 0) {
		result.found = true;
		result.item = file[i];
	}

	return result;
};

const findCurrency = async search => {
	const [cryptoSymbol, cryptoName, cryptoSlug, fiatSymbol, fiatName] = await Promise.all([
		searchFile(files.cryptoSymbols, search, 'symbol'),
		searchFile(files.cryptoNames, search, 'name'),
		searchFile(files.cryptoSlugs, search, 'slug'),
		searchFile(files.fiatSymbols, search, 'symbol'),
		searchFile(files.fiatNames, search, 'name')
	]);

	//todo test overlaps
	//prioritize symbols first
	if(fiatSymbol.found) return fiatSymbol;
	if(cryptoSymbol.found) return cryptoSymbol;
	if(fiatName.found) return fiatName;
	if(cryptoName.found) return cryptoName;
	return cryptoSlug; //found could be true or false
};

async function parseFile(file) {
	return JSON.parse(file);
};

async function loadAndParse(name) {
	return await parseFile(await fs.readFile(`${__dirname}/${name}.json`, 'utf8'));
};

/* Note:
* (1) Must be called (with await) before you use findCurrency
*/
async function loadFiles() {
	[files.cryptoNames, files.cryptoSlugs, files.cryptoSymbols, files.fiatNames, files.fiatSymbols] = await Promise.all([
		loadAndParse('crypto_names'),
		loadAndParse('crypto_slugs'),
		loadAndParse('crypto_symbols'),
		loadAndParse('fiat_names'),
		loadAndParse('fiat_symbols')
	]);
};

module.exports = {getQty, fieldCompare, searchFile, findCurrency, loadFiles, MAX, MIN};