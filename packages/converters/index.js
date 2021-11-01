'use strict';
const { temperatureConverter } = require('./temperatureConverter');

async function converters(query, API_KEY) {

	return temperatureConverter();
}


async function trigger(query) {
	if (query) {
		if (query === "temperature converter") return true;
	}
	return false;
}

module.exports = { converters, trigger };