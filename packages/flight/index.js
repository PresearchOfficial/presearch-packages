'use strict';

const axios = require("axios");

const dayjs = require("dayjs");
const timezonePlugin = require('dayjs/plugin/timezone');
const utcPlugin = require('dayjs/plugin/utc');
const durationPlugin = require('dayjs/plugin/duration');
const localizedFormatPlugin = require('dayjs/plugin/localizedFormat');

const airports = require("./airports.json");
const airlines = require("./airlines.json");

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);
dayjs.extend(durationPlugin);
dayjs.extend(localizedFormatPlugin);

const FLIGHT_API_URL = "https://aeroapi.flightaware.com/aeroapi";

async function flight(query, API_KEY) {
    const data = await getFlight(query, API_KEY);

    if (!data) {
        return { error: "Failed to get flight data"};
    }

    if (data.error) {
        return data;
    }

    return `
    <div id="presearch-flight-package">
        <div class="header">
            <div>
                <span class="flight-airline">
                    ${data.airline}
                </span>
                <span class="flight-number">
                    ${data.number}
                </span>
            </div>
            <div>
                ${data.flights.map((f, index) => '<button data-flight="' + index + '">' + f.date + '</button>').join('')}
            </div>
        </div>
        <div class="main">
            <div class="flight-points">
                <div class="flight-point flight-departure">
                    <div class="flight-point-code"></div>
                    <div class="flight-point-city"></div>
                </div>
                <div class="flight-info">
                    <div class="flight-status"></div>
                    <div class="flight-progress-container">
                        <div class="flight-progress-start">
                        </div>
                        <div class="flight-progress-plain">
                        </div>
                        <div class="flight-progress-end">
                        </div>
                    </div>
                    <div class="flight-duration"></div>
                </div>
                <div class="flight-point flight-arrival">
                    <div class="flight-point-code"></div>
                    <div class="flight-point-city"></div>
                </div>
            </div>
            <div class="flight-details">
                <div class="flight-detail flight-departure">
                    <div>
                        <span class="flight-point-city"></span>
                        <span class="flight-detail-date"></span>
                    </div>
                    <div class="flight-detail-row">
                        <div>
                            <div class="flight-detail-label">Departure</div>
                            <div class="flight-detail-estimated-time"></div>
                            <div class="flight-detail-scheduled-time"></div>
                        </div>
                        <div>
                            <div class="flight-detail-label">Terminal</div>
                            <div class="flight-detail-terminal"></div>
                        </div>
                        <div>
                            <div class="flight-detail-label">Gate</div>
                            <div class="flight-detail-gate"></div>
                        </div>
                    </div>
                </div>
                <div class="flight-detail flight-arrival">
                    <div>
                        <span class="flight-point-city"></span>
                        <span class="flight-detail-date"></span>
                    </div>
                    <div class="flight-detail-row">
                        <div>
                            <div class="flight-detail-label">Arrival</div>
                            <div class="flight-detail-estimated-time"></div>
                            <div class="flight-detail-scheduled-time"></div>
                        </div>
                        <div>
                            <div class="flight-detail-label">Terminal</div>
                            <div class="flight-detail-terminal"></div>
                        </div>
                        <div>
                            <div class="flight-detail-label">Gate</div>
                            <div class="flight-detail-gate"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        (()=> {  
            const data = ${JSON.stringify(data)};

            const selectElement = (selector, handler) => {
                const element = document.querySelector('#presearch-flight-package ' + selector);
                return handler(element);
            };

            const enumerateElements = (selector, handler) => {
                const elements = document.querySelectorAll('#presearch-flight-package ' + selector);
                elements.forEach((element, index) => handler(element, index));
            };

            const setFlight = (selector, flightData) => {
                const setValue = (elementSelector, value) => {
                    enumerateElements(selector + ' ' + elementSelector, (element) => element.innerText = value);
                };

                selectElement(selector + '.flight-detail', (element)=> {
                    element.className = element.className.replaceAll(/ flight-time-status-.*/ig, '');
                    element.classList.add('flight-time-status-' + flightData.status);
                });

                setValue('.flight-point-code', flightData.code);
                setValue('.flight-point-city', flightData.city);
                setValue('.flight-detail-date', flightData.date);
                setValue('.flight-detail-estimated-time', flightData.time);
                setValue('.flight-detail-scheduled-time', flightData.scheduledTime);
                setValue('.flight-detail-terminal', flightData.terminal);
                setValue('.flight-detail-gate', flightData.gate);
            };

            const selectFlight = (index) => {
                selectElement('button[data-flight].active', (btn)=> btn?.classList.remove('active'));
                selectElement('button[data-flight="' + index + '"]', (btn)=> btn?.classList.add('active'));

                const currentFlight = data.flights[index];

                selectElement('.main', (element) => element.className = 'main flight-main-status-' + currentFlight.status);
                selectElement('.flight-status', (element)=> element.innerText = currentFlight.status);
                selectElement('.flight-info', (element)=> element.className = 'flight-info flight-status-' + currentFlight.status);
                selectElement('.flight-duration', (element)=> element.innerText = currentFlight.duration);
                selectElement('.flight-progress-start', (element)=> element.style.flex = currentFlight.progress);
                selectElement('.flight-progress-end', (element)=> element.style.flex = 100 - currentFlight.progress);

                setFlight('.flight-departure', currentFlight.departure);
                setFlight('.flight-arrival', currentFlight.arrival);
            };

            enumerateElements('button[data-flight]', (btn) => {
                btn.addEventListener('click', (e)=> {
                    const flightIndex = parseInt(btn.dataset.flight);
                    selectFlight(flightIndex);
                });
            });
            
            selectFlight(data.selectedIndex);
        })();
    </script>

    <style>
        #presearch-flight-package {
            cursor: default;
            color: #202124;
        }

        #presearch-flight-package button {
            cursor: pointer;
        }
        
        .dark #presearch-flight-package {
            color: #ced5e2;
        }

        #presearch-flight-package .header {
            padding-bottom: 10px;
            border-bottom: 2px solid #e4e4e4;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 5px;
        }

        .dark #presearch-flight-package .header {
            border-bottom: 2px solid #3d3e40;
        }

        #presearch-flight-package .flight-number {
            font-size: 26px;
            margin-right: 10px;
        }
        
        #presearch-flight-package .flight-airline {
            font-size: 26px;
        }

        #presearch-flight-package button[data-flight] {
            padding: 8px 16px;
            border-radius: 10px;
            background-color: transparent;
        }

        #presearch-flight-package button[data-flight].active {
            background-color: #dddddd;
        }
        
        .dark #presearch-flight-package button[data-flight].active {
            background-color: #3d3e40;
        }

        #presearch-flight-package .flight-points {
            display: flex;
            justify-content: space-between;
        }

        #presearch-flight-package .flight-point-code {
            font-size: 32px;
            text-align: center;
        }

        #presearch-flight-package .flight-point-city {
            font-size: 16px;
            color: #9aa0a6;
            text-align: center;
        }

        #presearch-flight-package .flight-info {
            flex-grow: 1;
            margin: 0 20px;
        }

        #presearch-flight-package .flight-status {
            text-transform: uppercase;
            text-align: center;
            font-size: 22px;
            font-weight: 400;
            margin-top: 2px;
        }

        #presearch-flight-package .flight-status-scheduled, 
        #presearch-flight-package .flight-status-landed {
            color: #4eb66e;
        }

        #presearch-flight-package .flight-status-scheduled .flight-progress-start, 
        #presearch-flight-package .flight-status-landed .flight-progress-start {
            background-color: #4eb66e;
        }
        
        #presearch-flight-package .flight-status-scheduled .flight-progress-plain, 
        #presearch-flight-package .flight-status-landed .flight-progress-plain {
            filter: invert(66%) sepia(9%) saturate(2344%) hue-rotate(86deg) brightness(92%) contrast(89%);
        }

        #presearch-flight-package .flight-status-active {
            color: #3AB0FF;
        }
        
        #presearch-flight-package .flight-status-active .flight-progress-start {
            background-color: #3AB0FF;
        }

        #presearch-flight-package .flight-status-active .flight-progress-plain {
            filter: invert(73%) sepia(28%) saturate(7486%) hue-rotate(178deg) brightness(100%) contrast(102%);
        }

        #presearch-flight-package .flight-status-incident, 
        #presearch-flight-package .flight-status-diverted, 
        #presearch-flight-package .flight-status-cancelled,
        #presearch-flight-package .flight-detail-estimated-time {
            color: #FF7F3F;
        }

        #presearch-flight-package .flight-status-incident .flight-progress-start, 
        #presearch-flight-package .flight-status-diverted .flight-progress-start, 
        #presearch-flight-package .flight-status-cancelled .flight-progress-start {
            background-color: #FF7F3F;
        }

        #presearch-flight-package .flight-status-incident .flight-progress-plain, 
        #presearch-flight-package .flight-status-diverted .flight-progress-plain, 
        #presearch-flight-package .flight-status-cancelled .flight-progress-plain {
            filter: invert(72%) sepia(51%) saturate(4550%) hue-rotate(332deg) brightness(101%) contrast(101%);
        }

        #presearch-flight-package .flight-progress-container {
            display: flex;
            align-items: center;
        }

        #presearch-flight-package .flight-progress-start {
            height: 2px;
            flex: 0;
        }

        #presearch-flight-package .flight-progress-plain {
            margin: 0 10px 0 5px;
            width: 30px;
            height: 30px;
            transform: rotate(45deg);
            background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 375.04 375.04' style='enable-background:new 0 0 375.04 375.04;' xml:space='preserve'%3E%3Cg%3E%3Cpath style='fill: black' d='M365.938,8.173c-18.008-16.392-48.41-3.005-62.883,11.475c0,0-33.939,32.109-48.018,44.313 c-3.334,2.89-6.641,1.855-6.641,1.855L95.341,38.898c-6.58-0.938-15.801,2.136-20.494,6.836L61.185,59.392 c-4.703,4.695-3.691,10.982,2.244,13.967l112.941,58.683c0,0,8.709,4.326,3.459,9.326c-18.617,17.73-50.209,49.563-67.314,66.77 c-5.607,5.641-13.006,4.793-13.006,4.793l-52.154-6.371c-6.633-0.475-15.893,2.979-20.596,7.675L3.107,237.893 c-4.697,4.697-3.99,11.502,1.584,15.125l86.676,20.646c5.574,3.621,7.094,5.137,10.713,10.703l19.295,85.343 c3.623,5.569,10.43,6.277,15.127,1.583l23.658-23.663c4.693-4.694,8.156-13.957,7.689-20.579l-6.186-50.286 c0,0-0.918-6.397,2.596-9.958c17.371-17.601,51.955-51.27,70.17-69.719c5.65-5.721,8.043,1.451,8.043,1.451l58.281,112.134 c2.982,5.94,9.275,6.954,13.973,2.258l13.658-13.668c4.691-4.698,7.779-13.919,6.85-20.492L309.36,130.072 c0,0-1.113-5.204,2.023-8.592c11.238-12.143,44.842-48.672,44.842-48.672C370.692,58.334,384.83,25.368,365.938,8.173z'/%3E%3C/g%3E%3C/svg%3E%0A");
            background-repeat: no-repeat no-repeat;
            background-position: center center;
            background-size: cover;
        }

        #presearch-flight-package .flight-progress-end {
            height: 2px;
            background-color: #bebbbb;
            flex: 100;
        }

        .dark #presearch-flight-package .flight-progress-end {
            background-color: gray;
        }

        #presearch-flight-package .flight-duration {
            text-align: center;
            font-size: 16px;
            color: #9aa0a6;
        }
        
        #presearch-flight-package .flight-details {
            display: flex;
            margin-top: 10px;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }

        #presearch-flight-package .flight-detail {
            flex: 1;
        }

        #presearch-flight-package .flight-detail-row {
            display: flex;
        }

        #presearch-flight-package .flight-detail-row > div {
            margin-right: 20px;
        }

        #presearch-flight-package .flight-detail-label {
            color: #7e8184
        }
        
        .dark #presearch-flight-package .flight-detail-label {
            color: #9aa0a6;
        }

        #presearch-flight-package .flight-detail-row > div > div:not(.flight-detail-label) {
            font-size: 22px;
        }
        
        #presearch-flight-package .flight-detail-scheduled-time {
            color: #4eb66e;
            font-size: 22px;
            width: 100px;
        }
        
        #presearch-flight-package .flight-detail-estimated-time {
            display: none;
            width: 100px;
        }
        
        #presearch-flight-package .flight-detail:not(.flight-time-status-intime) .flight-detail-scheduled-time {
            color: #9aa0a6;
            font-size: 14px !important;
            text-decoration: line-through;
        }
        
        #presearch-flight-package .flight-detail:not(.flight-time-status-intime) .flight-detail-estimated-time {
            color: #4eb66e;
            font-size: 22px;
            display: block;
        }

        #presearch-flight-package .flight-detail.flight-time-status-delayed .flight-detail-estimated-time {
            color: #FF7F3F !important;
        }

        #presearch-flight-package .flight-main-status-cancelled .flight-detail-row > div > div:not(.flight-detail-label) {
            color: #9aa0a6 !important;
            text-decoration: line-through;
        }

        #presearch-flight-package .flight-detail .flight-point-city {
            display: none;
        }

        #presearch-flight-package .flight-detail .flight-point-city::after {
            content: ' ·'
        }
        
        @media only screen and (max-width: 600px) {
            #presearch-flight-package .flight-detail .flight-point-city {
                display: inline;
                color: inherit;
                font-weight: bold;
            }
        }

        @media only screen and (min-width: 768px) {
            #presearch-flight-package {
                width: 554px;
            }
        }
        
        @media only screen and (min-width: 1024px) {
            #presearch-flight-package {
                width: 644px;
            }
        }

    </style>`;
}

const toAirport = (flight, suffix, altsuffix) => {
    const actualTime = flight['actual_' + suffix] || flight['actual_' + altsuffix];
    const estimatedTime = flight['estimated_' + suffix] || flight['estimated_' + altsuffix];
    const scheduledTime = flight['scheduled_' + suffix] || flight['scheduled_' + altsuffix];

    const airportCode = (suffix === 'out' ? flight.origin : flight.destination).code_iata;
    const delay = suffix === 'out' ? flight.departure_delay : flight.arrival_delay;
    const terminal = suffix === 'out' ? flight.terminal_origin : flight.terminal_destination;
    const gate = suffix === 'out' ? flight.gate_origin : flight.gate_destination;

    const airport = airports[airportCode];

    const dateTime = dayjs(actualTime || estimatedTime || scheduledTime).tz(airport.timezone);
    const status = delay === 0 ? 'intime' : delay > 0 ? 'delayed' : 'early';

    return {
        code: airportCode,
        date: dateTime.format('ddd, MMM D'),
        city: airport.city_name,
        terminal: terminal || '-',
        gate: gate || '-',
        time: dateTime.format('h:mm A'),
        scheduledTime: dayjs(scheduledTime).tz(airport.timezone).format('h:mm A'),
        status: status
    }
};

const toAirline = (flight) => {
    let airline = airlines[`${flight.operator_iata}:${flight.operator_icao}`];

    if (!airline && flight.codeshares?.length !== 0) {
        const airlineCodeRegex = /^[a-zA-Z]{1,3}/;

        const codeshares = flight.codeshares.map((cs, index) => {
            const icao = cs.match(airlineCodeRegex)[0];
            const iata = (flight.codeshares_iata[index] || '').match(airlineCodeRegex)[0];
            return airlines[`${iata}:${icao}`];
        });

        airline = codeshares.find(cs => !!cs);
    }

    return airline;
};

function toContract(flights) {
    flights = flights.reverse();

    const flightInfo = flights.find(x => dayjs(x.scheduled_out || x.scheduled_off).isSame(dayjs().utc(), 'day') ||
                                        dayjs(x.scheduled_in || x.scheduled_on).isSame(dayjs().utc(), 'day')) ||
                       flights.find(x => dayjs(x.scheduled_out || x.scheduled_off).isAfter(dayjs().utc(), 'day')) || 
                       flights[0];

    let airline = toAirline(flightInfo);

    return {
        airline: airline?.airline_name || flightInfo.operator_iata,
        number: `${airline?.iata_code || flightInfo.operator_iata} ${flightInfo.flight_number}`,
        selectedIndex: flights.indexOf(flightInfo),

        flights: flights.map(f => {
            const duration = dayjs.duration(f.filed_ete, 'seconds');
            const durationHours = duration.hours();
            const durationMins = duration.minutes();

            const durationText = `${durationHours ? (durationHours + 'h') : ''} ${durationMins % 60}m`;

            const status = f.blocked ? 'incident' :
                f.diverted ? 'diverted' :
                f.cancelled ? 'cancelled' :
                f.progress_percent === 0 ? 'scheduled' :
                f.progress_percent === 100 ? 'landed' :
                f.progress_percent < 100 ? 'active' : 'unknown';

            return {
                date: dayjs(f.scheduled_out || f.scheduled_off).format('ddd, MMM D'),
                status: status,
                departure: toAirport(f, 'out'),
                arrival: toAirport(f, 'in'),
                duration: durationText,
                progress: f.progress_percent
            };
        })
    };
}

async function getFlight(query, API_KEY) {
    const flightNo = extractFlightNo(query);

    if (!flightNo) {
        return { error: "Failed to extract flight number "}
    }

    try {
        const flightUrl = `${FLIGHT_API_URL}/flights/${flightNo}`;
        const dateFormat = 'YYYY-MM-DDTHH:mm:ss';

        const { data } = await axios.get(flightUrl, {
            headers: {
                'x-apikey': API_KEY
            },
            params: {
                start: dayjs().utc().startOf('day').subtract(1, 'day')
                    .format(dateFormat) + 'Z',
                end: dayjs().utc().endOf('day').add(1, 'day')
                    .format(dateFormat) + 'Z',
            }
        });

        const flights = data.flights;

        if (!(flights?.length)) {
            return { error: "There's no flight data for this flight"};
        }

        return toContract(flights);
    }
    catch (error) {
        return { error };
    }
}

function extractFlightNo(query) {
    const regexString = new RegExp(/^(flight )?([a-zA-Z]{2,3}\d{1,4}[a-zA-Z]?)$/);

    const matches = query.match(regexString);
    return !!matches && matches.length === 3 ? matches[2].toUpperCase() : null;
}

async function trigger(query) {
    query = query ? query.toLowerCase() : "";
    return !!extractFlightNo(query);
}

module.exports = { flight, trigger };