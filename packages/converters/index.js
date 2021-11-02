'use strict';
const { temperatureConverter } = require('./temperatureConverter');
const { lengthConverter } = require("./lengthConverter")

async function converters(query, API_KEY) {

	return temperatureConverter();
}


async function trigger(query) {
	if (query) {
		if (query === "length converter") return true;
	}
	return false;
}

module.exports = { converters, trigger };