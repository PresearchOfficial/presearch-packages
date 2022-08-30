'use strict';

// global variables
var AIRLINEINDEX = -1;
var FLIGHTNO = -1;
var AIRPORTCODE = null;
var DESTINATIONS = null;

// Usefull json data
const airlines = require('./airlines.json');
const airports = require('./airports.json');

// require helper functions
const {getAirportDetails} = require('./airportDetails');
const {getPopularDestinations} = require('./popularDestinations');
const {getLiveStatus} = require('./liveStatus');
const { style } = require('./helper');

async function flight(query, API_KEY) {
	if (AIRPORTCODE !== null) {
		
		// Show airport details if airport code is queried
		const airportDetails = getAirportDetails(AIRPORTCODE, airports);
		if(airportDetails) return airportDetails + style;

	} else if (DESTINATIONS !== null){
		
		// show popular destinations
		const pd = await getPopularDestinations(DESTINATIONS, airports);
		if(pd) return pd + style;

	} else if (FLIGHTNO !== -1){

		// Show live status of flight
		const status = await getLiveStatus(FLIGHTNO, AIRLINEINDEX, airlines, airports);
		if(status) return status + style;

	}
	return undefined;
}

function checkQuery(query){
	// Show airport details if airport code is queried
	const airportcodeMatch = query.toLowerCase().match(/^(airport )?[a-z]{3}( airport)?$/i);
	if(airportcodeMatch){
		AIRPORTCODE = query.replace("airport",'').trim();
		return true;
	}

	// show popular destinations
	const destinationsMatch = query.toLowerCase().match(/^flights from ([a-z]{1,})$/i);
	if(destinationsMatch && destinationsMatch.length === 2){
		DESTINATIONS = destinationsMatch[1];
		return true;
	}

	// regex for matching flight no with ICAO
	const match = query.match(/^([A-Z]{3}) ?([0-9][0-9A-Z]{1,})$/i);

	if (match && match.length > 1){

		var subject = match[1].toUpperCase();
		// Get airline index from arlines array if requested query matches with ICAO
		AIRLINEINDEX = airlines.findIndex(e => e.icao == subject);

		// store flight no
		AIRLINEINDEX > -1 ? FLIGHTNO = match[2] : 0 ;

	}

	// If ICAO not in query then check for IATA
	if (AIRLINEINDEX === -1) { 
		
		// regex for matching flight no with IATA
		const match = query.match(/^([0-9A-Z]{2}) ?([0-9][0-9A-Z]{1,})$/i);

		if (!match || match.length < 2) return false;

		var subject = match[1].toUpperCase();
		// Get airline index from arlines array if requested query matches with IATA
		AIRLINEINDEX = airlines.findIndex(e => e.iata == subject);

		// store flight no globally
		AIRLINEINDEX > -1 ? FLIGHTNO = match[2] : 0 ;
	}

	// return live status of flight if found airlineindex
	if(AIRLINEINDEX > -1) return true;

}

async function trigger(query) {
	return checkQuery(query);
}

module.exports = { flight, trigger };