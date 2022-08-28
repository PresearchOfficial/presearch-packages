'use strict';

// global variables
var airlineIndex = -1;
var flightNo = -1;

// require helper functions
const airlines = require('./airlines.json');
const airports = require('./airports.json');
const {getFlightStatus, getLegs} = require('./helper');

async function flight(query, API_KEY) {
	try {
		var result = await getFlightStatus(airlines[airlineIndex].iata, flightNo);
		result = result.result;
		if(!result || result.meta.count < 1) return undefined;
		
		// get no of halts of this flight
		const legsCount = Object.keys(result.data[0].legs).length;
		
		// do not process if halts is more then 1
		if((legsCount - 1) > 1) return undefined;

		const data = result.data[0];
		
		// departure airport
		var departingAirport = airports[data.flightPoints[0].iataCode].municipality || airports[data.flightPoints[0].iataCode].name;
		if((departingAirport.split(' '))[1] == 'Airport') departingAirport = (departingAirport.split(' '))[0];
		
		// arrival airport
		var arrivalAirport = airports[data.flightPoints[1].iataCode].municipality || airports[data.flightPoints[1].iataCode].name;
		if((arrivalAirport.split(' '))[1] == 'Airport') arrivalAirport = (arrivalAirport.split(' '))[0];
		
		// flight code and number
		const flightCodeNo = data.flightDesignator.carrierCode + ' ' + data.flightDesignator.flightNumber;

		const legs = getLegs(data, flightCodeNo, legsCount, airports);

		return `
		<div id="presearchPackage">
			<div class="head">
				<h2>${airlines[airlineIndex].name} ${flightCodeNo}</h2>
				<p class="grey">${departingAirport} to ${arrivalAirport}</p>
			</div>
			<div class="body">
				<div class="legs">
					${legs}
					<hr style="border: none;border-top: 1px solid grey;">
				</div>
			</div>
		</div>
		<style>
			/* styles for dark mode should have .dark before */
			.flexrow{
				display: flex;
				flex-flow: row;
				justify-content: space-between;
				align-items: center;
			}
			.dark #presearchPackage {
				color: white;
			}
			.dark #presearchPackage .grey{
				color: #bababa;
			}
			.dark #presearchPackage .green{
				color: #4eb66e;
			}
			#presearchPackage .hidden{
				display: none;
			}
			#presearchPackage .grey{
				color: #525252;
			}
			#presearchPackage .green{
				color: #007d26;
			}
			#presearchPackage .greenbg{
				background:#4eb66e;
			}
			#presearchPackage .body .leg{cursor:pointer;}
			#presearchPackage .body .leg .basic-details{
				border-top: 1px solid grey;
				margin: 15px 0;
				padding-top: 15px;
				width: 100%;
			}
			.arrow svg{
				fill: currentColor;
				height: 32px;
				width: 70px;
			}
			.leg .more-details{
				transition: max-height 0.3s ease 0s;
				padding: 15px;
				border: 1px solid grey;
				border-radius: 8px;
			}
			.acode{
				font-size: 2.5em;
			}
			.leg .more-details .column1 .distance-line{
				width: 80%;
				background-color: grey;
				height: 1px;
				margin: 0 20px;
				position: relative;
			}
			.leg .more-details .column1 .distance-line .flight-duration{
				position: absolute;
				left: 50%;
				top: -25px;
				font-size: 16px;
				color: lightgrey;
			}
			.leg .more-details .column1 .distance-line .airplane{
				width: 100%;
				position: absolute;
				top: -11px;
				display: flex;
			}
			.leg .more-details .column1 .distance-line .airplane p{
				display: block;
				height: 3px;
				align-self: center;
			}
			.leg .more-details .arrival-airport{
				width: 50%;
				padding-left: 15px;
				border-left: 1px solid grey;
			}
			.leg .more-details div div table{
				margin: 10px 0;
			}
			.leg .more-details div div table td{
				padding-right: 2em;
			}
			.leg .more-details div div table tr:nth-child(2) td{
				font-size:2em;
			}
			.leg .more-details .column3{
				border-top: 1px solid grey;
				margin-top: 10px;
				padding-top: 8px;
				text-align: right;
			}
		</style>
		`;
	} catch (error) {
		return undefined;
	}
}

function validateFlightNo(query){
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

	return airlineIndex > -1;
}

async function trigger(query) {
	return validateFlightNo(query);
}

module.exports = { flight, trigger };