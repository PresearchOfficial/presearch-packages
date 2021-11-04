'use strict';
//todo if duplicates, the result is arbitary but this is not what we want
const bs = require('binary-search');
const fs = require('fs').promises;
const {waitUntil} = require('async-wait-until');

//we are limited by the API and also javascript native precision unless we use a big number module
const MAX = 1000000000;
const MIN = 0.00000001;
const DECIMAL_PLACES = 8;
const files = { loaded: false };
const DATA_DIR = 'data';

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

const fieldCompare = field => (object, search) => object[field] < search ? -1 : (object[field] > search ? 1 : 0);

const searchFile = async (file, search, field) => {
	const result = {
		found: false,
		item: {}
	};
	if(!Array.isArray(file) || file.length === 0) return result;
	const i = bs(file, search, fieldCompare(field));
	if(i >= 0) {
		result.found = true;
		result.item = file[i];
	}
	return result;
};

const findCurrency = async search => {
	await waitUntil(() => files.loaded);
	const [cryptoSymbol, cryptoName, fiatSymbol, fiatName] = await Promise.all([
		searchFile(files.cryptoSymbols, search, 'symbol'),
		searchFile(files.cryptoNames, search, 'name'),
		searchFile(files.fiatSymbols, search, 'symbol'),
		searchFile(files.fiatNames, search, 'name')
	]);

	//prioritize symbols first
	const result = fiatSymbol.found ? fiatSymbol :
		cryptoSymbol.found ? cryptoSymbol :
		fiatName.found ? fiatName : cryptoName; //found could be true or false

	if(result.found) {
		const metadata = await searchFile(files.metadata, result.item.id, 'id');
		result.item.display = metadata.item.display;
	}
	return result; 
};

const parseFile = async file => JSON.parse(file);
const loadAndParse = async name => await parseFile(await fs.readFile(`${__dirname}/${DATA_DIR}/${name}.json`, 'utf8'));

async function loadFiles() {
	try{
		[files.cryptoNames, files.cryptoSymbols, files.fiatNames, files.fiatSymbols, files.metadata] = await Promise.all([
			loadAndParse('crypto_names'),
			loadAndParse('crypto_symbols'),
			loadAndParse('fiat_names'),
			loadAndParse('fiat_symbols'),
			loadAndParse('currency_metadata')
		]);
	} catch(error) {
		//time for an empty array
	}
	files.loaded = true;
};

module.exports = (function(){
	loadFiles();
	return {getQty, findCurrency, fieldCompare, MAX, MIN};
})();