'use strict';
const axios = require('axios');
const {getQty, findCurrency} = require('./search-help.js');

const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion';

//During the trigger, we remember the currencies we find (for performance).
//Each object needs to have .id and .display
let leftQty = 1;
let leftCurrency = {};
let rightCurrency = {};

async function cryptoConversion(query, API_KEY) {
	try {
		if(!API_KEY) return;

		//todo implement data caching to minimize number of api calls
		//todo retry with exponential backoff?
		const headers = { Accept: 'application/json', 'Accept-Encoding': 'gzip', 'X-CMC_PRO_API_KEY': API_KEY };

        const response = await axios.get(CMC_API_URL + `?amount=${leftQty}&id=${leftCurrency.id}&convert_id=${rightCurrency.id}`,
		  { headers });

		//todo format price
		const price = response.data.data.quote[rightCurrency.id].price;

		// here you need to return HTML code for your package. You can use <style> and <script> tags
		// you need to keep <div id='presearchPackage'> here, you can remove everything else
		return `
		<div id='presearchPackage'>
			<span class='mycolor'>${leftQty} ${leftCurrency.display} = ${price} ${rightCurrency.display}</span>
		</div>
		<style>
			.dark #presearchPackage .mycolor {
				color: yellow;
			}
			#presearchPackage .mycolor {
				color: green;
				cursor: pointer;
			}
		</style>
		<script>
			document.querySelector('.mycolor').addEventListener('click', () => alert('clicked!'));
		</script>
		`;
	} catch(error) {
		return;
	}
}

async function trigger(query) {
	try {
		//initialize
		leftQty = 1;
		leftCurrency = {};
		rightCurrency = {};

		query = query.toLowerCase().trim();
		const words = query.split(' to ');
		//todo handle punctuation?
		if(!words || words.length != 2) return false;

		let left = words[0];
		let right = words[1];

		leftQty = getQty(left);

		//check for a match with qty first because some coins have
		//all numbers for their symbol (like 42 coin)
		let result = await findCurrency(left);
		if(!result.found) {
			let nonQtyWords = left.split(' ');
			nonQtyWords.shift();
			result = await findCurrency(nonQtyWords.join(' '));
			if(!result.found) return false;
		}

		leftCurrency = result.item;

		result = await findCurrency(right);
		if(!result.found) return false;

		rightCurrency = result.item;
		return true;
	} catch(error) {
		return false;
	}
}

module.exports = { cryptoConversion, trigger };