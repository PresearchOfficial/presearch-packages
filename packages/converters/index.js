'use strict';
const { temperatureConverter } = require('./temperatureConverter');
const { lengthConverter } = require("./lengthConverter")

async function converters(query) {
	//need to take number and unit from query (not done yet)
	let queryUnit;
	let queryUnitValue;

	if (query === "temperature converter")
		queryUnit = "fahrenheit";
	if (query == "length converter")
		queryUnit = "feet";

	queryUnitValue = 20;


	if (query === "temperature converter") return temperatureConverter(queryUnitValue, queryUnit);
	if (query === "length converter") return lengthConverter(queryUnitValue, queryUnit);
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