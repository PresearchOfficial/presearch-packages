'use strict';
var Typo = require("typo-js");
const spell = require('spell-checker-js');
const coin_list = require("./coin_list.json");
const common_mistakes = require("./common-mistakes.json")

var dictionary = new Typo("en_US");
spell.load('en')

async function DidYouMean(query) {

	let suggestionListForQuery = [];
	query = query ? query.toLowerCase() : "";

	if (query && query.split(" ").length === 1) {
		//try to resolve from common mistakes
		//common mistake check
		for (let word of common_mistakes) {
			if (word.mistake.toLowerCase() === query && word.suggestion) {
				suggestionListForQuery.push(word.suggestion);
				break;
			}
		}
		//check again and try to get suggestion from external package(typo-js,spell-checker-js)
		if (suggestionListForQuery.length === 0) {
			const check = spell.check(query)
			if (check[0]) {
				var arrayOfSuggestions = dictionary.suggest(check[0]);
				if (arrayOfSuggestions.length > 0) {
					suggestionListForQuery = arrayOfSuggestions
				} else {
					return null
				}
			} else {
				return null
			}
		}
	} else {
		return null;
	}

	return `
	<div id="presearchPackage">
	<div class="container">
		<span class="title">Did You Mean: </span>
		${suggestionListForQuery && suggestionListForQuery.map((word, index) => (
		`<a href=${`https://testnet-engine.presearch.org/search?q=${word}`} key="${index}" class="tag">${word}</a>`
	)).join("")
		}
	</div>
	</div>
	<style>
	#presearchPackage .container {
		margin-bottom: 25px;
	}
	#presearchPackage .title {
		color: red;
	}
	#presearchPackage .tag {
		color: black;
		padding:5px;
		cursor: pointer;
		border-style: solid;
		border-color:rgba(243,244,246,var(--tw-bg-opacity));
		border-width: 2px;
		border-radius: 10px;
		margin-right: 5px;
  		margin-left: 5px;
	}
	.dark #presearchPackage .title {
		color: red;
	}
	.dark #presearchPackage .tag {
		color: rgba(243,244,246,var(--tw-bg-opacity));;
		border-color:rgba(25,25,25,var(--tw-bg-opacity));
	}
	#presearchPackage .tag:hover {
		background-color:  rgba(243,244,246,var(--tw-bg-opacity));
	  }
	.dark #presearchPackage .tag:hover {
		background-color:  rgba(25,25,25,var(--tw-bg-opacity));
	  }
	</style>
	<script>
		
	</script>
	`;
}

async function trigger(query) {
	if (query && query.split(" ").length === 1) {

		query = query ? query.toLowerCase() : "";
		//for avoid coin name consider as wrong word name
		for (let coin of coin_list) {
			if (coin.name.toLowerCase() === query || coin.symbol.toLowerCase() === query || coin.slug.toLowerCase() === query) return false;
		}
		//common mistake check
		for (let word of common_mistakes) {
			if (word.mistake.toLowerCase() === query && word.suggestion) return true;
		}
		//first check using typo-js
		if (dictionary.check(query))
			return false
		//second check using spell-checker-js
		const check = spell.check(query)
		if (check[0]) {
			var arrayOfSuggestions = dictionary.suggest(check[0]);
			if (arrayOfSuggestions.length > 0) {
				return true
			}
		}
	}

	return false;
}

module.exports = { DidYouMean, trigger };