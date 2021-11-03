'use strict';
const { temperatureConverter } = require('./temperatureConverter');
const { lengthConverter } = require("./lengthConverter")

async function converters(query, API_KEY) {
	//need to take number and unit from query (not done yet)
	const queryUnitValue = 20;
	// const queryUnit = "feet";
	const queryUnit = 1;

	if (query === "temperature converter") return temperatureConverter(queryUnitValue, queryUnit);
	if (query === "length converter") return lengthConverter(queryUnitValue, "feet");
	else return null;
}


async function trigger(query) {
	if (query) {
		//need to match number and unit from query (not done yet)
		if (query === "temperature converter" || query === "length converter") return true;
	}
	return false;
}

module.exports = { converters, trigger };