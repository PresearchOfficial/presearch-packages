'use strict';
const { temperatureConverter } = require('./temperatureConverter');
const { lengthConverter } = require("./lengthConverter")

const lengthMeasurements = ["feet", "meters", "inches", "cm", "yards", "kilometers", "miles"]
const temperatureMeasurements = ["fahrenheit", "celsius", "kelvin"]

async function converters(query) {

	let queryUnit;
	let queryUnitValue;
	let converter;

	let queryWords = query.split(" ")

	queryWords.map((element) => {
		if (element - element === 0)
			if (!queryUnit)
				queryUnitValue = element
		if (lengthMeasurements.includes(element)) {
			if (!(converter && queryUnit)) {
				converter = "length converter"
				queryUnit = element
			}
		}
		if (temperatureMeasurements.includes(element)) {
			converter = "temperature converter"
			queryUnit = element
		}
		if (queryUnit && queryUnitValue && converter)
			return;

	})

	if (queryWords.length < 2) return null
	if (!(queryUnit && queryUnitValue && converter)) return null
	if (converter === "temperature converter") return temperatureConverter(queryUnitValue, queryUnit);
	if (converter === "length converter") return lengthConverter(queryUnitValue, queryUnit);
	else return null;
}


async function trigger(query) {
	let queryUnit;
	let queryUnitValue;
	let converter;

	let queryWords = query.split(" ")

	queryWords.map((element) => {
		if (element - element === 0)
			if (!queryUnit)
				queryUnitValue = element
		if (lengthMeasurements.includes(element)) {
			if (!(converter && queryUnit)) {
				converter = "length converter"
				queryUnit = element
			}
		}
		if (temperatureMeasurements.includes(element)) {
			converter = "temperature converter"
			queryUnit = element
		}
		if (queryUnit && queryUnitValue && converter)
			return;

	})

	if (queryUnit && queryUnitValue && converter) return true
	return false
}



module.exports = { converters, trigger };