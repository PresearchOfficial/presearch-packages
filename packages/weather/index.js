"use strict";
const axios = require("axios");
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=24.8702571&lon=67.0338954&exclude=minutely`;
const WEATHER_API_URL_2 = `https://api.openweathermap.org/data/2.5/forecast?lat=24.8702571&lon=67.0338954&cnt=${8}&id=524901`;
// var WEATHER_API_URL_2 = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=24.8702571&lon=67.0338954&cnt=${7}`;

async function weather(query, API_KEY) {
  console.log(query, "-", API_KEY);

  const headers = { Accept: "application/json", "X-CMC_PRO_API_KEY": API_KEY };

  let [weatherData] = await Promise.all([
    axios
      .get(`${WEATHER_API_URL}&appid=${API_KEY}`, { headers })
      .catch((error) => ({ error })),
  ]);
  let [weatherData2] = await Promise.all([
    axios
      .get(`${WEATHER_API_URL_2}&appid=${API_KEY}`, { headers })
      .catch((error) => ({ error })),
  ]);
  weatherData2 = weatherData2.data;
  weatherData = weatherData.data;
  console.log(weatherData, weatherData2);

  Date.prototype.timeNow = function () {
    return (
      (this.getHours() < 10 ? "0" : "") +
      this.getHours() +
      ":" +
      (this.getMinutes() < 10 ? "0" : "") +
      this.getMinutes() +
      ":" +
      (this.getSeconds() < 10 ? "0" : "") +
      this.getSeconds()
    );
  };

  // returns a random integer between 0 and 9
  // here you need to return HTML code for your package. You can use <style> and <script> tags
  // you need to keep <div id="presearchPackage"> here, you can remove everything else
  return `
  <div class="background">
  <div class="box">
      <div class="box1">
          <div class="weather-box">
              <div class="left">
                  <img src="/assets/images/moon.png" class="moon">
              </div>
              <div class="main-right">
                  <div class="right">
                      <h1>${(weatherData.current.temp - 273.15).toFixed()}°</h1>
                      <div class="h2">
                          <h2>F | <strong class="C"> C</strong></h2>
                      </div>
                  </div>
                  <div class="right2">
                      <h3>18°</h3>
                      <h3 class="degree">10°</h3>
                  </div>
              </div>
          </div>
          <div class="weather-details">
              <div class="country">
                  <div class="left-side">
                      <span>${weatherData2.city.name}, ${
                        weatherData2.city.country
                      }</span>
                  </div>
                  <div class="right-side">
                      <span class="day">${new Date(
                        weatherData.current.dt * 1000
                      ).toDateString()}</span>
                      <strong class="time">${new Date(
                        weatherData.current.dt
                      ).timeNow()}</strong>
                  </div>
              </div>
              <div class="sky-details">
                  <h1 class="sky">${
                    weatherData.current.weather[0].description
                  }</h1>
                  <div class="heading-5">
                      <div class="row1">
                          <h5>Humidity:</h5>
                          <span class="sub">${
                            weatherData.current.humidity
                          }%</span>
                      </div>
                      <div class="row2">
                          <h5>Precipitation:</h5>
                          <span class="sub">0%</span>
                      </div>
                      <div class="row3">
                          <h5>Wind:</h5>
                          <span class="sub">0.96 MpH</span>
                      </div>
                  </div>
              </div>
          </div>

      </div>
      <div class="units_container">
          <div class="units">
              <div class="temp-but">
                  <button class="btn">Temperature</button>
              </div>
              <div class="pre-but">
                  <button class="btn">Precipitation</button>
              </div>
              <div class="wind-but">
                  <button class="btn">Wind</button>
              </div>
          </div>
      </div>
      <div class="graph">
          <div class="graph-div">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                  <defs>
                      <linearGradient id="grad1">
                          <stop offset="0%" stop-color="#6b622a"/>
                          <stop offset="100%" stop-color="#6b622a" stop-opacity="0" />
                      </linearGradient>
                  </defs>
                  <path class="graphTest" fill="url(#grad1)" fill-opacity="1"
                      d="M0,192L80,213.3C160,235,320,277,480,250.7C640,224,800,128,960,112C1120,96,1280,160,1360,192L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z">
                  </path>
              </svg>
          </div>
          <div class="time-graph">
              <label>Now</label>
              <label>3 AM</label>
              <label>6 AM</label>
              <label>9 AM</label>
              <label>12 PM</label>
              <label>3 PM</label>
              <label>6 PM</label>
              <label>9 PM</label>
          </div>
      </div>
  </div>
  <div class="dark-back">
      <div class="button-row">
          <button class="weather-button">
              wed
              <img src="/assets/images/cloud.png">
              18° 10°
          </button>
          <button class="weather-button">
              thu
              <img src="/assets/images/clouds.png">
              24° 4°
          </button>
          <button class="weather-button">
              fri
              <img src="/assets/images/cloud.png">
              24° 0°
          </button>
          <button class="weather-button">
              sat
              <img src="/assets/images/cloudy.png">
              24° -5°
          </button>
          <button class="weather-button">
              sun
              <img src="/assets/images/sun.png">
              38° 22°
          </button>
          <button class="weather-button">
              mon
              <img src="/assets/images/cloud.png">
              39° 31°
          </button>
          <button class="weather-button">
              tue
              <img src="/assets/images/clouds.png">
              43° 24°
          </button>
          <button class="weather-button">
              wed
              <img src="/assets/images/scattered-thunderstorms.png">
              54° 36°
          </button>
      </div>
  </div>
</div>
	<div id="presearchPackage">
		<span class="mycolor">Weather Detail for: ${query}</span>
    <div id="demo"></div>
	</div>
	<!-- example styles - remember to use #presearchPackage before each class -->
	<style>

  /* weather Table css starts here */
  * {
  margin: 0;
  padding: 0;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e1e1e;
}

.background {
  padding: 15px;
  background-color: #1e2028;
  width: 95%;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.box {
  background-color: #252731;
  width: 100%;
  padding-bottom: 40px;
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 8px #00000024;
}

.box1 {
  margin-top: 20px;
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.weather-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 20%;
  min-width: 200px;
  margin-top: 60px;
  padding-left: 20px;
}

.left .moon {
  width: 58px;
}

.moon {
  padding-top: 10px;
}

.main-right {
  width: 75%;
}

.right {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 165px;
  padding-left: 10px;
}

.right .h2 {
  width: 60px;
}

h1 {
  color: #ced5e3;
  font-size: 30px;
  font-family: arial;
}

.h2 h2 {
  color: #d2dde5;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  display: flex;
  margin-top: 5px;
  font-family: arial;
  padding-top: 4px;
}

.right2 {
  display: flex;
  flex-direction: row;
  padding-top: 10px;
  padding-left: 10px;
}

h3 {
  color: #c4cfd7;
  font-family: arial;
  font-size: 15px;
  padding-left: 3px;
}

.degree {
  color: #818c9f;
  font-family: arial;
  font-size: 15px;
}

.C {
  padding-left: 4px;
  color: #8490a2;
  font-family: arial;
}

.weather-details {
  width: 60%;
}

.country {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 10px 10px 0;
  border-bottom: 1px solid #3b465a;
  width: 95%;
  align-items: center;
}

span {
  color: #d2d9e8;
  font-family: arial;
}

.day {
  color: #7f8a9c;
  font-family: arial;
  margin-right: 15px;
}

.time {
  color: #d2d9e7;
  font-family: arial;
}

.left-side {
  margin-right: 10px;
}

.right-side {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* width: 30%;
  min-width: 170px; */
}
strong.time {
  width: 100px;
}

.sky {
  font-size: 20px;
  font-family: arial;
}

h5 {
  font-size: 12px;
  color: #7f8a9c;
  font-family: arial;
}

.sky-details {
  padding-top: 25px;
}

.heading-5 {
  padding-top: 10px;
  width: 130px;
}

.row1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5px;
}

.row2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5px;
}

.row3 {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding-top: 5px;
}

.sub {
  font-size: 12px;
  color: #7f8a9c;
  font-weight: 600;
}

.units_container {
  width: 90%;
}

.units {
  display: flex;
  flex-direction: row;
  margin-top: 40px;
  justify-content: space-between;
  width: 30%;
  /* padding-left: 20px; */
}

.btn {
  background-color: transparent;
  border: none;
  color: #d1d8e6;
  height: 30px;
  width: 80px;
  border-radius: 4px;
  font-size: 10px;
  font-family: arial;
  font-weight: bold;
}

.btn:focus {
  background-color: #17191f;
  color: #d1d8e6;
}

.graph {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  flex-direction: column;
}

.graph-div {
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.graph-div svg {
  width: 100%;
}
.graph-div path.graphTest {
  stroke: #a89b2c;
  stroke-width: 10px;
}

.time-graph {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
}

.time-graph label {
  color: #abb5c9;
  font-family: arial;
  font-size: 12px;
}

.dark-back {
  background-color: #1d1f29;
  height: 150px;
  align-items: center;
  display: flex;
  width: 100%;
  box-shadow: 0px 0px 8px #00000024;
  border-radius: 0 0 8px 8px;
}

.button-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  align-items: center;
  padding-left: 30px;
}

.weather-button {
  display: flex;
  flex-direction: column;
  border: none;
  background-color: transparent;
  width: 90px;
  height: 100px;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  color: white;
  text-transform: capitalize;
  padding: 10px 0px;
}

.weather-button:focus {
  background: linear-gradient(#12141a, #1d1f26);
  color: white;
}


/* weather Table css ends here */

		/* styles for dark mode should have .dark before */
		.dark #presearchPackage .mycolor {
			color: yellow;
		}
		#presearchPackage .mycolor {
			color: green;
			cursor: pointer;
		}
	</style>
	<!-- example javascript -->
	<script>
		document.querySelector(".mycolor").addEventListener("click", () => alert("clicked!"));

    var x = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}

getLocation();
	</script>
	`;
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
async function trigger(query) {
  if (query) {
    // convert query to lower case, to trigger the package with queries like 'Random number', 'RANDOM NUMBER' etc.
    query = query ? query.toLowerCase() : "";
    if (query === "r") return true;
  }
  // you need to return false when the query should not trigger your package
  return false;
}

module.exports = { weather, trigger };
