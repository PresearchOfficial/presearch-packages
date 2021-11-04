'use strict';
const axios = require('axios');
const {getQty, findCurrency} = require('./search-help.js');
const {createHTML} = require ('./display-help.js');

const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion';

//During the trigger, we remember the currencies we find (for performance).
//In the files, each object needs to have .id and .display
let leftCurrency = {};
let rightCurrency = {};

async function cryptoConversion(query, API_KEY) {
	try {
		if(!API_KEY || !leftCurrency.qty || !leftCurrency.id || !rightCurrency.id) return;

		//todo implement data caching to minimize number of api calls
		//todo retry with exponential backoff?
		const headers = { Accept: 'application/json', 'Accept-Encoding': 'gzip', 'X-CMC_PRO_API_KEY': API_KEY };
        const response = await axios.get(CMC_API_URL + `?amount=${leftCurrency.qty}&id=${leftCurrency.id}&convert_id=${rightCurrency.id}`, {headers});
		//todo format price
		rightCurrency.price = response.data.data.quote[rightCurrency.id].price;

		return createHTML(leftCurrency, rightCurrency);
	} catch(error) {
		return;
	}
}

async function trigger(query) {
	try {
		//todo disable fiat to fiat? it is handled by another package
		leftCurrency = {};
		rightCurrency = {};
		query = query.toLowerCase().trim();
		const words = query.split(' to '); //todo in, into, '='? ignore the word the, a, an?
		//todo handle punctuation? condense extra spaces
		//todo converting to itself?
		if(!words || words.length !== 2) return false;

		const leftSearch = words[0];
		const rightSearch = words[1];
		//todo this should let us know if the qty was found or if it is using default as 1,
		//that way it can be more accurate
		const leftQty = getQty(leftSearch);
		let [rightResult, leftResult] = await Promise.all([
			findCurrency(rightSearch),
			//check for a match with qty first because some coins have
			//all numbers for their symbol (like 42 coin)
			findCurrency(leftSearch)
		]);

		if(!rightResult.found) return false;
		rightCurrency = rightResult.item;

		if(leftResult.found) {
			leftCurrency = leftResult.item;
			leftCurrency.qty = 1;
		} else {
			//try again with the qty separate from the search string
			let nonQtyWords = leftSearch.split(' ');
			nonQtyWords.shift();
			leftResult = await findCurrency(nonQtyWords.join(' '));
			if(leftResult.found) {
				leftCurrency = leftResult.item;
				leftCurrency.qty = leftQty;
			}
		}

		return leftResult.found;
	} catch(error) {
		return false;
	}
}

module.exports = {cryptoConversion, trigger};