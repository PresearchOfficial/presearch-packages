'use strict';
var Typo = require("typo-js");
const spell = require('spell-checker-js');
const { identity } = require("mathjs");

var dictionary = new Typo("en_US");
spell.load('en')

async function DidYouMean(query, API_KEY) {

	return `
	<div id="presearchPackage">
		<span class="myColor">Did You Mean</span>
	</div>
	<style>
		.dark #presearchPackage .myColor {
			color: yellow;
		}
		#presearchPackage .myColor {
			color: green;
			cursor: pointer;
		}
	</style>
	<script>
		document.querySelector(".myColor").addEventListener("click", () => alert("clicked!"));
	</script>
	`;
}

async function trigger(query) {
	if (query && query.split(" ").length === 1) {
		query = query ? query.toLowerCase() : "";
		const check = spell.check(query)
		console.log(check[0])
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