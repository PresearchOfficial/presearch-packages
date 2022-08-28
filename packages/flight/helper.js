const config = require('./config.json');

const Amadeus = require('amadeus');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

async function getFlightStatus(iata, flightNo, date = dayjs().format("YYYY-MM-DD")){
    const amadeus = new Amadeus(config.amadeus_test);
    return await amadeus.schedule.flights.get({
		carrierCode: iata.toUpperCase(),
		flightNumber: flightNo,
		scheduledDepartureDate: date
	});
}

function getLegs(data, flightCodeNo, legsCount, airports){
	var legs = '';
	for(var i = 0; i < legsCount; i++){
		const boardAirportCode = data.legs[i].boardPointIataCode;
		const boardAirport = (airports[data.legs[i].boardPointIataCode].municipality || airports[data.legs[i].boardPointIataCode].name).replace(' Airport','');
		const offAirportCode = data.legs[i].offPointIataCode;
		const offAirport = (airports[data.legs[i].offPointIataCode].municipality || airports[data.legs[i].offPointIataCode].name).replace(' Airport','');
		
		const duration = data.legs[i].scheduledLegDuration;
        var rawSTD = data.flightPoints[0].departure.timings[0].value;
        var rawSTA = data.flightPoints[1].arrival.timings[0].value;
		var STD = rawSTD.replace(/.{6}$/,'');
		var STA = rawSTA.replace(/.{6}$/,'');

        if(legsCount === 2){
            if(i === 0){
                STA = dayjs(dayjs(STD).add(dayjs.duration(duration).$ms , 'millisecond'));
            }else{
                STD = dayjs(dayjs(STA).subtract(dayjs.duration(duration).$ms, 'millisecond'));
            }
        }

		var flightPosition = 0;
		if(dayjs().subtract(dayjs(rawSTD)) < 0) flightPosition = 0;
		else if(dayjs().subtract(dayjs(rawSTA)) > 0) flightPosition = 100;
		else flightPosition = ((dayjs().subtract(dayjs(rawSTD))) * 100) / dayjs.duration(duration).$ms;

		legs += `
		<div class="leg" onclick="document.querySelector('#leg${i}svg').style.transform += 'rotate(180deg)';var el = document.querySelector('#leg${i}'); el.className == 'more-details' ? el.className += ' hidden' : el.classList.remove('hidden')">
			<div class="basic-details flexrow">
				<div class="flight-timing">
					<h2>${dayjs(STD).format("hh:mm A")}</h2>
					<span class="green" style="border:1px solid #4eb56d; padding:0 5px; border-radius:4px;">Departure</span>
				</div>
				<div style="text-align: center;">
					<h2>${flightCodeNo}</h2>
					<p>${boardAirport} ${boardAirportCode}</p>
				</div>
				<div class="arrow">
					<svg id="leg${i}svg" ${i==0 ? 'style="transform: rotate(180deg);"':''} focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
				</div>
			</div>
			<div class="more-details${i==1 ? ' hidden':''}" id="leg${i}">
				<div class="column1 flexrow">
					<div class="acode"> ${boardAirportCode} </div>
					<div class="distance-line">
						<p class="grey flight-duration"> ${dayjs.duration(duration).format('H[h] mm[m]')} </p>
						<div class="airplane green">
							<p  class="greenbg" style="width:${flightPosition}%;"></p>
							<svg style="fill:#4eb66e;width: 25px;transform: rotate(90deg);height: 25px;" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.18 9"></path><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path></svg>
						</div>
					</div>
					<div class="acode"> ${offAirportCode} </div>
				</div>
				<div class="flexrow" style="margin: 20px 0;">
					<div class="departing-airport">
						<h2>${boardAirport.split(' ').slice(0,2).join(' ')} · ${dayjs(STD).format('ddd, MMM DD')}</h2>
						<table>
							<tr class="grey">
								<td>Schedule Departure</td>
								<td>Terminal</td>
								<td>Gate</td>
							</tr>
							<tr>
								<td  class="green">${dayjs(STD).format("hh:mm a")}</td>
								<td>-</td>
								<td>-</td>
							</tr>
						</table>
					</div>
					<div class="arrival-airport">
						<h2>${offAirport.split(' ').slice(0,2).join(' ')} · ${dayjs(STA).format('ddd, MMM DD')}</h2>
						<table>
							<tr class="grey">
								<td>Schedule Arrival</td>
								<td>Terminal</td>
								<td>Gate</td>
							</tr>
							<tr>
								<td  class="green">${dayjs(STA).format("hh:mm a")}</td>
								<td>-</td>
								<td>-</td>
							</tr>
						</table>
					</div>
				</div>
				<div class="column3 flexrow">
					<p class="grey">Showing local airport time</p>
					<p class="grey">Source: <a href="http://amadeus.com">Amadeus</a></p>
				</div>
			</div>
		</div>`
	}
    return legs;
}

module.exports = {getFlightStatus, getLegs};