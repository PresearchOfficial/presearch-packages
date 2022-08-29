'use strict';

// global variables
var airlineIndex = -1;
var flightNo = -1;
var airportCode = null;

// Usefull json data
const airlines = require('./airlines.json');
const airports = require('./airports.json');

// require helper functions
const {getAirportDetails} = require('./airportDetails');
const {getLiveStatus} = require('./liveStatus');
const { style } = require('./helper');

async function flight(query, API_KEY) {
	if (airportCode !== null) {
		const airportDetails = getAirportDetails(airportCode, airports);
		return airportDetails + style;
	} else if (flightNo !== -1){
		const status = getLiveStatus(flightNo, airlineIndex, airlines, airports);
		return status + style;
	}
}

function checkQuery(query){
	// Show airport details if airport code is queried
	const airportCodeMatch = query.toLowerCase().match(/^(airport )?[a-z]{3}( airport)?$/i);
	if(airportCodeMatch){
		airportCode = query.replace("airport",'').trim();
		return true;
	}

	// regex for matching flight no with ICAO
	const match = query.match(/^([A-Z]{3}) ?([0-9][0-9A-Z]{1,})$/i);

	if (match && match.length > 1){

		var subject = match[1].toUpperCase();
		// Get airline index from arlines array if requested query matches with ICAO
		airlineIndex = airlines.findIndex(e => e.icao == subject);

		// store flight no
		airlineIndex > -1 ? flightNo = match[2] : 0 ;

	}

	// If ICAO not in query then check for IATA
	if (airlineIndex === -1) { 
		
		// regex for matching flight no with IATA
		const match = query.match(/^([0-9A-Z]{2}) ?([0-9][0-9A-Z]{1,})$/i);

		if (!match || match.length < 2) return false;

		var subject = match[1].toUpperCase();
		// Get airline index from arlines array if requested query matches with IATA
		airlineIndex = airlines.findIndex(e => e.iata == subject);

		// store flight no globally
		airlineIndex > -1 ? flightNo = match[2] : 0 ;
	}

	// return live status of flight if found airlineIndex
	if(airlineIndex > -1) return true;

}

async function trigger(query) {
	return checkQuery(query);
}

module.exports = { flight, trigger };