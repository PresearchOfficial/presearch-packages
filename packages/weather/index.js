"use strict";
const axios = require("axios");
// var WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=24.8702571&lon=67.0338954&cnt=${7}`;
// var WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=24.8702571&lon=67.0338954&cnt=${8}&id=524901`;
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=24.8702571&lon=67.0338954&exclude=minutely`;

async function weather(query, API_KEY) {
  console.log(query, "-", API_KEY);

  const headers = { Accept: "application/json", "X-CMC_PRO_API_KEY": API_KEY };

  let [weatherData] = await Promise.all([
    axios
      .get(`${WEATHER_API_URL}&appid=${API_KEY}`, { headers })
      .catch((error) => ({ error })),
  ]);
  weatherData = weatherData.data;
  console.log(weatherData);

  // returns a random integer between 0 and 9
  // here you need to return HTML code for your package. You can use <style> and <script> tags
  // you need to keep <div id="presearchPackage"> here, you can remove everything else
  return `
  <div class="background">
        <div class="box">
            <div class="box1">
                <div class="weather-box">
                    <div class="left">
                        <img src="/assets/images/moon.png" xclass="moon">
                    </div>
                    <div class="main-right">
                        <div class="right">
                            <h1>10°</h1>
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
                            <span>Chaska, US</span>
                        </div>
                        <div class="right-side">
                            <span class="day">Wednesday, Mar 9</span>
                            <strong class="time">10:32 PM</strong>
                        </div>
                    </div>
                    <div class="sky-details">
                        <h1 class="sky">Clear sky</h1>
                        <div class="heading-5">
                            <div class="row1">
                                <h5>Humidity:</h5>
                                <span class="sub">66%</span>
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
            <div class="graph">
                <div class="graph-div">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path class="graphTest" fill="#6b622a" fill-opacity="1" d="M0,192L80,213.3C160,235,320,277,480,250.7C640,224,800,128,960,112C1120,96,1280,160,1360,192L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
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
  background-color: #1e2028;
  width: 80%;
  height: 650px;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  background-color: #252731;
  width: 98%;
  height: 630px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.box1 {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.weather-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 20%;
  margin-top: 60px;
  padding-left: 20px;
}

.left .moon {
  width: 58px;
  height: 58px;
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
  width: 80%;
  padding-left: 10px;
}

h1 {
  color: #ced5e3;
  font-size: 50px;
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
  width: 80%;
}

.country {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
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
}

.time {
  color: #d2d9e7;
  font-family: arial;
}

.right-side {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 30%;
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
  width: 16%;
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

.units {
  display: flex;
  flex-direction: row;
  margin-top: 40px;
  justify-content: space-between;
  width: 30%;
  padding-left: 20px;
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
  margin-top: 40px;
  width: 100%;
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
  background-color: #17191f;
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
