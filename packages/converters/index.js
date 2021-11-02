'use strict';
const { temperatureConverter } = require('./temperatureConverter');
const { lengthConverter } = require("./lengthConverter")

async function converters(query, API_KEY) {
	if (query === "length converter") return lengthConverter();
	if (query === "temperature converter") return temperatureConverter();
	else return null;
}


async function trigger(query) {
	if (query) {
		if (query === "length converter" || query === "temperature converter") return true;
	}
	return false;
}

module.exports = { converters, trigger };