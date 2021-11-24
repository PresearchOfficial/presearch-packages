'use strict';
var Typo = require("typo-js");
const spell = require('spell-checker-js');
const { identity } = require("mathjs");

var dictionary = new Typo("en_US");
spell.load('en')

async function DidYouMean(query, API_KEY) {

	let suggestionListForQuery;

	if (query && query.split(" ").length === 1) {
		query = query ? query.toLowerCase() : "";
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
	} else {
		return null;
	}

	return `
	<div id="presearchPackage">
	<div class="container">
		<span class="title">Did You Mean: </span>
		${suggestionListForQuery && suggestionListForQuery.map((word, index) => (
		`<span key="${index}" class="tag">${word}</span>`
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