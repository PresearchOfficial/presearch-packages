'use strict';

const axios = require("axios");

const dayjs = require("dayjs");
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const localizedFormat = require('dayjs/plugin/localizedFormat');
 
const airports = require("./airports.json");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const FLIGHT_API_URL = "http://api.aviationstack.com/v1";

async function flight(query, API_KEY) {
    const data = await getFlight(query, API_KEY);

    if (!data) {
        return null;
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

                selectElement(selector + '.flight-detail', (element)=>{
                    element.classList.remove('flight-not-in-time');
                    if (!flightData.inTime) {
                        element.classList.add('flight-not-in-time');
                    }
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
                
                selectElement('.flight-status', (element)=> element.innerText = currentFlight.status);
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
            
            selectFlight(0);
        })();
    </script>

    <style>
        #presearch-flight-package {
            cursor: pointer;
            color: #202124;
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
            color: #4eb66e;
            font-weight: 400;
            margin-top: 2px;
        }

        #presearch-flight-package .flight-progress-container {
            display: flex;
            align-items: center;
        }

        #presearch-flight-package .flight-progress-start {
            height: 2px;
            background-color: #4eb66e;
            flex: 0;
        }

        #presearch-flight-package .flight-progress-plain {
            margin: 0 10px 0 5px;
            width: 30px;
            height: 30px;
            transform: rotate(45deg);
            background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 375.04 375.04' style='enable-background:new 0 0 375.04 375.04;' xml:space='preserve'%3E%3Cg%3E%3Cpath style='fill: %234eb66e' d='M365.938,8.173c-18.008-16.392-48.41-3.005-62.883,11.475c0,0-33.939,32.109-48.018,44.313 c-3.334,2.89-6.641,1.855-6.641,1.855L95.341,38.898c-6.58-0.938-15.801,2.136-20.494,6.836L61.185,59.392 c-4.703,4.695-3.691,10.982,2.244,13.967l112.941,58.683c0,0,8.709,4.326,3.459,9.326c-18.617,17.73-50.209,49.563-67.314,66.77 c-5.607,5.641-13.006,4.793-13.006,4.793l-52.154-6.371c-6.633-0.475-15.893,2.979-20.596,7.675L3.107,237.893 c-4.697,4.697-3.99,11.502,1.584,15.125l86.676,20.646c5.574,3.621,7.094,5.137,10.713,10.703l19.295,85.343 c3.623,5.569,10.43,6.277,15.127,1.583l23.658-23.663c4.693-4.694,8.156-13.957,7.689-20.579l-6.186-50.286 c0,0-0.918-6.397,2.596-9.958c17.371-17.601,51.955-51.27,70.17-69.719c5.65-5.721,8.043,1.451,8.043,1.451l58.281,112.134 c2.982,5.94,9.275,6.954,13.973,2.258l13.658-13.668c4.691-4.698,7.779-13.919,6.85-20.492L309.36,130.072 c0,0-1.113-5.204,2.023-8.592c11.238-12.143,44.842-48.672,44.842-48.672C370.692,58.334,384.83,25.368,365.938,8.173z'/%3E%3C/g%3E%3C/svg%3E%0A");
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
        
        #presearch-flight-package .flight-not-in-time .flight-detail-scheduled-time {
            color: #9aa0a6;
            font-size: 14px !important;
            text-decoration: line-through;
        }
        
        #presearch-flight-package .flight-not-in-time .flight-detail-estimated-time {
            color: #4eb66e;
            font-size: 22px;
            display: block;
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

async function getFlight(query, API_KEY) {
    const flightNo = extractFlightNo(query);

    if (!flightNo) {
        return null;
    }

    try {
        const flightUrl = `${FLIGHT_API_URL}/flights`;
        const { data } = await axios.get(flightUrl, {
            params: {
                "access_key": API_KEY,
                "flight_iata": flightNo
            }
        });

        const flights = data.data;

        if (!(flights?.length)) {
            return null;
        }

        const flightInfo = flights[0];

        const toAirportInfo = (airport) => {
            const dateTime = dayjs.tz(airport.actual || airport.estimated || airport.scheduled, airport.timezone);
            const isInTime = dateTime.utc().isSame(dayjs.tz(airport.estimated, airport.timezone).utc(), 'minute');

            return {
                code: airport.iata,
                date: dateTime.format('ddd, MMM D'),
                city: airports[airport.iata].city_name,
                terminal: airport.terminal || '-',
                gate: airport.gate || '-',
                time: dateTime.format('h:mm A'),
                scheduledTime: dayjs.tz(airport.scheduled, airport.timezone).format('h:mm A'),
                inTime: isInTime 
            }
        };

        return {
            airline: flightInfo.airline.name,
            number: `${flightInfo.airline.iata} ${flightInfo.flight.number}`,

            flights: flights.map(f => {
                const departureDate = dayjs.tz(f.departure.actual || f.departure.estimated, f.departure.timezone);
                const arrivalDate = dayjs.tz(f.arrival.actual || f.arrival.estimated, f.arrival.timezone);

                const durationHours = arrivalDate.diff(departureDate, 'h');
                const durationMins = arrivalDate.diff(departureDate, 'm');

                const duration = `${durationHours ? (durationHours + 'h') : ''} ${durationMins % 60}m`;

                let progress = 0;

                switch (f.flight_status) {
                    case 'active':
                        const inAirMins = dayjs.tz(dayjs(), f.departure.timezone).utc().diff(departureDate.utc(), 'm');
                        console.log(inAirMins);
                        progress = Math.round(inAirMins * 100 / durationMins);
                        progress = progress > 100 ? 100 : progress;
                        break;
                    case 'landed':
                        progress = 100;
                        break;
                }

                return {
                    date: dayjs(f.flight_date, 'YYYY-MM-DD').format('ddd, MMM D'),
                    status: f.flight_status,
                    departure: toAirportInfo(f.departure),
                    arrival: toAirportInfo(f.arrival),
                    duration: duration,
                    progress: progress
                };
            }).reverse()
        };
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

function extractFlightNo(query) {
    const regexString = new RegExp(/^flight ([a-zA-Z]{2,3}\d{1,4})$/);

    const matches = query.match(regexString);
    return !!matches && matches.length === 2 ? matches[1].toUpperCase() : null;
}

async function trigger(query) {
    query = query ? query.toLowerCase() : "";
    return !!extractFlightNo(query);
}

module.exports = { flight, trigger };