'use strict';
const axios = require("axios");
//todo if duplicates, the result is arbitary but this is not what we want
const bs = require("binary-search");

//todo async load files?
const cryptoNames = require("./crypto_names.json");
const cryptoSlugs = require("./crypto_slugs.json");
const cryptoSymbols = require("./crypto_symbols.json");
const fiatNames = require("./fiat_names.json");
const fiatSymbols = require("./fiat_symbols.json");

const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1/tools/price-conversion";

//during the trigger, we remember the currencies we find (for performance)
//each object needs to have .id and .display
let leftCurrency = {};
let leftQty = 1;
let rightCurrency = {};

async function cryptoConversion(query, API_KEY) {
	try {
		if(!API_KEY) return;
		query = query.toLowerCase();

		//todo implement data caching to minimize number of api calls
		//todo retry with exponential backoff?
		const headers = { Accept: "application/json", "Accept-Encoding": "gzip", "X-CMC_PRO_API_KEY": API_KEY };

        const response = await axios.get(CMC_API_URL + `?amount=${leftQty}&id=${leftCurrency.id}&convert_id=${rightCurrency.id}`,
		  { headers });

		//todo format price
		const price = response.data.data.quote[rightCurrency.id].price;

		// here you need to return HTML code for your package. You can use <style> and <script> tags
		// you need to keep <div id="presearchPackage"> here, you can remove everything else
		return `
		<div id="presearchPackage">
			<span class="mycolor">${leftQty} ${leftCurrency.display} = ${price} ${rightCurrency.display}</span>
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
			document.querySelector(".mycolor").addEventListener("click", () => alert("clicked!"));
		</script>
		`;
	} catch(error) {
		return null;
	}
}

const fieldCompare = (field) => {
    return (element, search) => {
        return element[field] < search ? -1 : (
            element[field] > search ? 1 : 0
        );
    };
};

const searchFile = (file, search, field) => {
	let result = {
		found: false,
		item: {}
	};

	let i = bs(file, search, fieldCompare(field));
	if(i >= 0) {
		result.found = true;
		result.item = file[i];
	}

	return result;
};

const findCurrency = (search) => {
	//todo test overlaps
	//prioritize symbols first
	let result = searchFile(cryptoSymbols, search, "symbol");
	if(result.found === true) return result;

	result = searchFile(cryptoNames, search, "name");
	if(result.found === true) return result;

	result = searchFile(cryptoSlugs, search, "slug");
	if(result.found === true) return result;

	result = searchFile(fiatSymbols, search, "symbol");
	if(result.found === true) return result;

	result = searchFile(fiatNames, search, "name");
	return result;
};

async function trigger(query) {
	try {
		query = query.toLowerCase();
		const words = query.split(" to ");
		//todo allow user to specify quantity
		//todo handle punctuation
		if(!words || words.length != 2) return false;

		let left = words[0];
		let right = words[1];

		let result = findCurrency(left);
		if(result.found === false) return false;
		leftCurrency = result.item;

		result = findCurrency(right);
		if(result.found === false) return false;
		rightCurrency = result.item;

		return true;
	} catch(error) {
		console.log(error);
		return false;
	}
}

module.exports = { cryptoConversion, trigger };