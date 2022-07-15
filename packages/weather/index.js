'use strict';
const axios = require("axios");
const dayjs = require("dayjs");

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/onecall";
const GEOLOCATION_DIRECT_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
const GEOLOCATION_REVERSE_API_URL = "http://api.openweathermap.org/geo/1.0/reverse";

async function weather(query, API_KEY) {
    const location = await getLocation(query, API_KEY);
    const data = await getWeather({
        latitude: location.latitude,
        longitude: location.longitude,
        exclude: 'minutely,hourly'
    }, API_KEY);

    console.log(data);

    const createDayMainInfo = function (current) {
        const degrees = "now" in current.temp ? current.temp.now : current.temp.day;
        return `<img alt="weather icon" style="margin-top: 20px" class="icon" src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" />
            <div class="temperature">
                <div>
                     <span class="degrees-main" data-degrees="${degrees}">${Math.round(degrees)}°</span>
                     <span class="switch">
                         <button class="superscript active units" data-units="F">F</button>
                         <span class="superscript">|</span>
                         <button class="superscript units" data-units="C">C</button>
                    </span>
                 </div>
                <div class="day">
                     <span class="degrees-min" data-degrees="${current.temp.min}"> ${Math.round(current.temp.min)}°</span>
                     <span class="degrees-max" data-degrees="${current.temp.max}"> ${Math.round(current.temp.max)}°</span>
                 </div>
             </div>`;
    }

    const createDayDetailInfo = function (current) {
        return '<div class="title">' + current.weather[0].description + '</div>' +
            '<div class="description">Humidity <span>' + current.humidity + '%</span></div>' +
            '<div class="description">Precipitation<span>' + ((current.pop || 0) * 100) + '%</span></div>' +
            '<div class="description">Wind<span data-speed="'+current.wind_speed+'">' + current.wind_speed + 'mph</span></div>';
    };

    const createForecast = function (daily) {
        return daily.map((day, index) => {
            return `<button class="day-forecast ${!index ? 'active' : ''}" >
            <div style="text-align: center">
                ${dayjs(day.dt * 1000).format('ddd')}
            </div>
            <img alt="weather icon" class="icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
            <div style="text-align: center">
            <span data-degrees="${day.temp.min}">
            ${Math.round(day.temp.min)}°
            </span>
            <span data-degrees="${day.temp.max}" style="margin-left: 5px; opacity: 0.7">
            ${Math.round(day.temp.max)}°
            </span>
            </div>
        </button> `;
        }).join('');
    };

    const currentWeather = { ...data.current, temp: { ...data.daily[0].temp, now: data.current.temp }, pop: data.daily[0].pop };

    return `
        <div id = "presearchPackage" >
            <div class="container">
                <div class="inner-container">
                    <div class="weather">
                        <div class="main">
                            ${createDayMainInfo(currentWeather)}
                        </div>
                        <div class="details">
                            <div class="details-header">
                                <div class="city">
                                    ${location.name}, ${location.country}
                                </div>
                                <div class="date">
                                    ${dayjs(data.current.dt * 1000).format('dddd, MMMM D')}
                                </div>
                                <div class="time">
                                    ${dayjs(data.current.dt * 1000).format('h:mm A')}
                                </div>
                            </div>
                            <div class="details-description">
                                ${createDayDetailInfo(currentWeather)}
                            </div>
                        </div>
                    </div>
                    <div class="forecast-container" >
                        ${createForecast(data.daily)}
                    </div>
                </div>
            </div>
    </div>
<style>
    .dark #presearchPackage {
        color: #ced5e2;
    }
    
    #presearchPackage {
         margin-bottom: 30px;
    }

    #presearchPackage .container {
        border-radius: 5px;
    }

    #presearchPackage .container .inner-container {
        border-radius: 10px;
    }

    #presearchPackage .container .inner-container .weather {
        display: flex;
    }

    #presearchPackage .container .inner-container .icon {
        object-fit: cover;
        width: 100px;
        height: 70px;
    }

    #presearchPackage .container .inner-container .weather .main {
        margin-right: 40px;
        display: flex;
        justify-content: flex-start;
    }

    #presearchPackage .container .inner-container .weather .main .temperature {
        font-size: 52px;
        margin-top: 15px;
    }

    #presearchPackage .container .inner-container .weather .main .switch .superscript {
        margin: -5px;
    }

    #presearchPackage .container .inner-container .weather .main .switch button {
        all: unset;
        opacity: 0.6;
    }

    #presearchPackage .container .inner-container .weather .main .switch button.active {
        opacity: 1;
    }

    #presearchPackage .container .inner-container .weather .main .temperature .superscript {
        position: relative;
        top: -25px;
        font-size: 35%;
    }

    #presearchPackage .container .inner-container .weather .main .temperature .day {
        font-size: 16px;
        font-weight: bold;
        margin-left: 5px;
        margin-top: 10px;
    }

    #presearchPackage .container .inner-container .weather .main .temperature .day .superscript {
        position: relative;
        top: -5px;
        margin-left: -3px;
        font-size: 50%;
        margin-right: 3px;
    }

    #presearchPackage .container .inner-container .weather .main .temperature .superscript.degrees {
        margin-left: -10px;
        margin-right: 10px;
    }

    #presearchPackage .container .inner-container .details {
        flex-grow: 1;
    }

    #presearchPackage .container .inner-container .details-header {
        flex-grow: 1;
        display: flex;
        border-bottom: 2px solid #dddddd;
        padding-bottom: 5px;
    }

    .dark #presearchPackage .container .inner-container .details-header {
        border-bottom: 2px solid #3d3e40;
    }

    #presearchPackage .container .inner-container .details .details-description>.title {
        font-size: 20px;
        margin-bottom: 5px;
        margin-top: 10px;
        text-transform: capitalize; 
    }

    #presearchPackage .container .inner-container .details .details-description>.description {
        font-size: 14px;
        margin-bottom: 2px;
        width: 180px;
        opacity: 0.8;
    }

    #presearchPackage .container .inner-container .details .details-description span {
        float: right;
    }

    #presearchPackage .container .inner-container .details .city {
        flex-grow: 1;
        align-self: flex-start;

        font-size: 18px;
        font-weight: 400;
    }

    #presearchPackage .container .inner-container .details .date {
        margin-left: 10px;
        margin-right: 10px;
    }

    #presearchPackage .container .inner-container .details .time {
        font-weight: bold;
    }

    #presearchPackage {
        cursor: pointer;
        font-family: sans-serif;
    }
    #presearchPackage .forecast-container {
        display: flex; 
        margin-top: 20px;
    }

    #presearchPackage .day-forecast {
        unset: all;
        border-radius: 5px;
        padding: 5px;
    }
    
    .dark #presearchPackage .day-forecast.active {
        background-color: #3d3e40;
    }

    #presearchPackage .day-forecast.active {
        border-radius: 5px;
        padding: 5px;
        background-color: #dddddd;
    }

</style>

<script>
    const data = ${JSON.stringify(data)};
    let units ="F";

    const createDayDetailInfo = ${createDayDetailInfo.toString()};

    const forecastButtons = document.querySelectorAll('button.day-forecast');

    const refreshUnits = function(newUnits){
        if(newUnits){
            units = newUnits;
        }

        const degreesElements = document.querySelectorAll('[data-degrees]');

        degreesElements.forEach((element, index) => {
            if (units === "C") {
                element.innerText = Math.round((parseFloat(element.dataset.degrees) - 32) * 5 / 9) + '°';
            }
            else {
                element.innerText = Math.round(element.dataset.degrees) + '°';
            }
        });

        const speedElements = document.querySelectorAll('[data-speed]');

        speedElements.forEach((element, index) => {
            if (units === "C") {
                element.innerText = (parseFloat(element.dataset.speed) * 0.44704).toFixed(2) + 'm/s';
            }
            else {
                element.innerText = element.dataset.speed + 'mph';
            }
        });
    };

    forecastButtons.forEach((btn, index) => {
        btn.dataset.index = index;
        btn.addEventListener('click', e => {
            const activeBtn = document.querySelector('button.day-forecast.active');
            activeBtn?.classList.remove('active');

            btn.classList.add('active');

            const dayData = data.daily[btn.dataset.index]

            let degreeElement = document.querySelector('.weather .degrees-main');
            degreeElement.dataset.degrees = dayData.temp.day;
            
            degreeElement = document.querySelector('.weather .degrees-min');
            degreeElement.dataset.degrees = dayData.temp.min;
            
            degreeElement = document.querySelector('.weather .degrees-max');
            degreeElement.dataset.degrees = dayData.temp.max;


            let imageElement = document.querySelector('.weather img');
            imageElement.src = "http://openweathermap.org/img/wn/"+dayData.weather[0].icon+"@2x.png";

            container = document.querySelector('#presearchPackage .details-description');
            container.innerHTML = createDayDetailInfo(dayData);

            refreshUnits();
        });
    });

    const unitButtons = document.querySelectorAll('button.units');
    unitButtons.forEach((btn, index) => {
        btn.addEventListener('click', e => {
            console.log('clicked');
            const activeBtn = document.querySelector('button.units.active');
            activeBtn?.classList.remove('active');
            btn.classList.add('active');

            refreshUnits(btn.dataset.units);
        });
    });

</script>
    `;
}

async function getWeather(options, API_KEY) {
    const { latitude, longitude } = options;

    const { data } = await axios.get(WEATHER_API_URL, {
        params: {
            appid: API_KEY,
            lat: latitude,
            lon: longitude,
            units: 'imperial',
            exclude: 'minutely,hourly'
        }
    });
    return data;
}

async function getLocation(query, API_KEY) {
    const place = query.toLowerCase()
        .split(' ')
        .filter(x => x && ["in", "weather"].every(y => y != x))
        .join(' ');

    if (place && ["local", "today", "near"].every(x => place.indexOf(x) === -1)) {
        try {
            console.log("searching for place", place);
            const location = await axios.get(GEOLOCATION_DIRECT_API_URL, {
                params: {
                    appid: API_KEY,
                    q: place,
                    limit: 1
                }
            });

            console.log("got location", location.data);
            if (location && location.data && location.data.length > 0) {
                return {
                    latitude: location.data[0].lat,
                    longitude: location.data[0].lon,
                    name: location.data[0].name,
                    country: location.data[0].country
                };
            }
        }
        catch { }
    }

    const info = await axios.get("http://ipinfo.io/");
    const [latitude, longitude] = info.data.loc.split(',');

    const { data } = await axios.get(GEOLOCATION_REVERSE_API_URL, {
        params: {
            appid: API_KEY,
            lat: latitude,
            lon: longitude,
            limit: 1
        }
    });

    console.log(data);
    return {
        latitude: data[0].lat,
        longitude: data[0].lon,
        name: data[0].name,
        country: data[0].country
    };
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
async function trigger(query) {
    if (query) {
        // convert query to lower case, to trigger the package with queries like 'Random number', 'RANDOM NUMBER' etc.
        query = query ? query.toLowerCase() : "";
        if (query.indexOf("weather") !== -1) return true;
    }
    // you need to return false when the query should not trigger your package
    return false;
}

module.exports = { weather, trigger };