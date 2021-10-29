'use strict';
const axios = require("axios");
//todo if duplicates, the result is arbitary but this is not what we want
const bs = require("binary-search");

const names = require("./crypto_names.json");
const slugs = require("./crypto_slugs.json");
const symbols = require("./crypto_symbols.json");

const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1/tools/price-conversion";

//during the trigger, we remember the cryptos we find (for performance)
let leftCrypto = {};
let rightCrypto = {};

async function cryptoConversion(query, API_KEY) {
	try {
		if(!API_KEY) return;
		query = query.toLowerCase();

		//todo implement data caching to minimize number of api calls
		//todo retry with exponential backoff?
		const headers = { Accept: "application/json", "Accept-Encoding": "gzip", "X-CMC_PRO_API_KEY": API_KEY };

		// here you need to return HTML code for your package. You can use <style> and <script> tags
		// you need to keep <div id="presearchPackage"> here, you can remove everything else
		return `
		<div id="presearchPackage">
			<span class="mycolor">${leftCrypto.display} to ${rightCrypto.display}</span>
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

const rankCompare = (field) => {
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

	let i = bs(file, search, rankCompare(field));
	if(i >= 0) {
		result.found = true;
		result.item = file[i];
	}

	return result;
};

const findCrypto = (search) => {
	//todo test overlaps
	//prioritize symbols first
	let result = searchFile(symbols, search, "symbol");
	if(result.found === true) return result;

	result = searchFile(names, search, "name");
	if(result.found === true) return result;

	result = searchFile(slugs, search, "slug");
	return result;
};

async function trigger(query) {
	try {
		query = query.toLowerCase();
		const words = query.split(" to ");
		//todo allow user to specify quantity
		if(!words || words.length != 2) return false;

		let left = words[0];
		let right = words[1];

		let result = findCrypto(left);
		if(result.found === false) return false;
		leftCrypto = result.item;

		result = findCrypto(right);
		if(result.found === false) return false;
		rightCrypto = result.item;

		return true;
	} catch(error) {
		console.log(error);
		return false;
	}
}

module.exports = { cryptoConversion, trigger };