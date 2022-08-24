'use strict';

const axios = require("axios");
const dayjs = require("dayjs");
const airports = require("./airports.json");

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
                    <div class="flight-progress"></div>
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

        #presearch-flight-package .flight-progress {
            border: 1px solid #bebbbb;
            margin: 3px 0;
        }

        .dark #presearch-flight-package .flight-progress {
            border: 1px solid gray;
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
            const dateTime = dayjs(airport.actual || airport.estimated || airport.scheduled);
            return {
                code: airport.iata,
                date: dateTime.format('ddd, MMM D'),
                city: airports[airport.iata].city_name,
                terminal: airport.terminal || '-',
                gate: airport.gate || '-',
                time: dateTime.format('h:mm A'),
                scheduledTime: dayjs(airport.scheduled).format('h:mm A'),
                inTime: dateTime.isSame(airport.estimated, 'minute')
            }
        };

        return {
            airline: flightInfo.airline.name,
            number: `${flightInfo.airline.iata} ${flightInfo.flight.number}`,

            flights: flights.map(f => {
                const departureDate = dayjs(f.departure.actual || f.departure.estimated);
                const arrivalDate = dayjs(f.arrival.actual || f.arrival.estimated);

                const durationHours = arrivalDate.diff(departureDate, 'h');
                const durationMins = arrivalDate.diff(departureDate, 'm') % 60;

                const duration = `${durationHours ? (durationHours + 'h') : ''} ${durationMins}m`;

                return {
                    date: dayjs(f.flight_date, 'YYYY-MM-DD').format('ddd, MMM D'),
                    status: f.flight_status,
                    departure: toAirportInfo(f.departure),
                    arrival: toAirportInfo(f.arrival),
                    duration: duration
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