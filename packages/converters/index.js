'use strict';
const { temperatureConverter } = require('./temperatureConverter');
const { lengthConverter } = require("./lengthConverter")

async function converters(query, API_KEY) {

	// const lengthMeasures = ["feet", "meters", "inches", "cm", "yards", "kilometers", "miles"]
	// const temperatureMeasures = ["fahrenheit", "celsius", "kelvin"]

	const queryUnitValue = 25;
	const queryUnitIndex = 1;

	if (query === "temperature converter") return temperatureConverter(queryUnitValue, queryUnitIndex);
	if (query === "length converter") return lengthConverter(queryUnitValue, queryUnitIndex);
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