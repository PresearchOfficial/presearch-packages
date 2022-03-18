"use strict";
const axios = require("axios");
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/onecall?exclude=minutely`;
var WEATHER_API_URL_2 = `https://api.openweathermap.org/data/2.5/forecast/daily?cnt=${7}`;
var LOCATION_API = "https://api.openweathermap.org/geo/1.0/direct";

let temperature;
let weatherData;
let weatherData2;
let location;

async function weather(query, API_KEY) {
  const headers = { Accept: "application/json", "X-CMC_PRO_API_KEY": API_KEY };
  var cityName = query;
  [location] = await Promise.all([
    axios
      .get(`${LOCATION_API}?q=${cityName}&appid=${API_KEY}`, { headers })
      .catch((error) => ({ error })),
  ]);
  [weatherData, weatherData2] = await Promise.all([
    axios
      .get(
        `${WEATHER_API_URL}&appid=${API_KEY}&lat=${location.data[0].lat}&lon=${location.data[0].lon}`,
        { headers }
      )
      .catch((error) => ({ error })),
    axios
      .get(
        `${WEATHER_API_URL_2}&appid=${API_KEY}&lat=${location.data[0].lat}&lon=${location.data[0].lon}`,
        { headers }
      )
      .catch((error) => ({ error })),
  ]);

  weatherData2 = weatherData2?.data;
  weatherData = weatherData?.data;
  var path = "";
  var text = "";
  Object.values(weatherData.hourly).forEach((val, i) => {
    path += " L" + i * 15 + " " + (val.temp - 273.15).toFixed(0);
    if (i % 6 == 0) {
      text +=
        '<text x="' +
        i * 10 +
        '" y="' +
        (val.temp - 273.15).toFixed(0) +
        '" fill="white">' +
        (val.temp - 273.15).toFixed(0) +
        "</text>";
    }
  });

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

  temperature = (weatherData?.current.temp - 273.15).toFixed();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // returns a random integer between 0 and 9
  // here you need to return HTML code for your package. You can use <style> and <script> tags
  // you need to keep <div id="presearchPackage"> here, you can remove everything else
  return `


  <script>

    let tempTypeG = 'c';
    function getTemp(temp){
      return (temp - 273.15).toFixed()
    }

    function changeTempType(type) {
      var temperature = document.getElementById("temperature");
      if(tempTypeG !== type){
        tempTypeG = type;
        if(type === 'c'){
          temperature.innerHTML = ((temperature.innerHTML - 32) * 5 / 9).toFixed();
          document.getElementById("tempC").classList.add('tempDeselected');
          document.getElementById("tempF").classList.remove('tempDeselected');
        }else{
          temperature.innerHTML = ((temperature.innerHTML * 9) / 5 + 32).toFixed();
          document.getElementById("tempF").classList.add('tempDeselected');
          document.getElementById("tempC").classList.remove('tempDeselected');
        }
      }
    }


    let weekDays = ${JSON.stringify(weekDays)}
    Object.values(${JSON.stringify(weatherData.daily)}).forEach((val, i) => {
      let button = document.createElement("button");
      button.classList.add('weather-button');
      button.setAttribute('id','weather-button'+i);
      if(i === 0){
        button.classList.add('currentDay');
      }
      document.getElementById("buttons").appendChild(button);
      let span = document.createElement("span");
      span.innerHTML = weekDays[new Date(val.dt*1000).getDay()]
      button.appendChild(span);
      let img = document.createElement("img");
      img.src = "http://openweathermap.org/img/w/" + val.weather[0].icon + ".png"
      button.appendChild(img);
      let span2 = document.createElement("span");
      span2.innerHTML = getTemp(val.temp.max)+'° '+ getTemp(val.temp.min)+'°'
      button.appendChild(span2);
		  button.addEventListener("click", () => {
        document.getElementById("temperature").innerHTML = getTemp(val.temp.day);
        document.getElementById("humidity").innerHTML = val.humidity+"%";
        document.getElementById("weatherSky").innerHTML = val.weather[0].description;
        document.getElementById("currDate").innerHTML = new Date(val.dt * 1000).toDateString();
        Object.values(${JSON.stringify(
          weatherData.daily
        )}).forEach((val, idx) => {
          document.getElementById("weather-button"+idx).classList.remove('currentDay');
        })
        button.classList.add('currentDay');
        document.getElementById("tempC").classList.add('tempDeselected');
        document.getElementById("tempF").classList.remove('tempDeselected');
        tempTypeG = 'c';
      });
    });
  </script>
  <div class="background">
  <div class="box">
      <div class="box1">
          <div class="weather-box">
              <div class="left">
                  <img src="http://openweathermap.org/img/w/${
                    weatherData.current.weather[0].icon
                  }.png" class="moon">
              </div>
              <div class="main-right">
                  <div class="right">
                      <h1 id="temperature">${temperature}</h1>
                      <div class="h2">
                          <button id="tempC" class="tempDeselected" onclick="changeTempType('f')">F</button> | <button id="tempF" onclick="changeTempType('c')">C</button>
                      </div>
                  </div>
              </div>
          </div>
          <div class="weather-details">
              <div class="country">
                  <div class="left-side">
                      <span>${location.data[0]?.name}, ${
                      location.data[0]?.country
  }</span>
                  </div>
                  <div class="right-side">
                      <span class="day" id="currDate">${new Date(
                        weatherData?.current.dt * 1000
                      ).toDateString()}</span>
                  </div>
              </div>
              <div class="sky-details">
                  <h1 class="sky" id="weatherSky">${
                    weatherData?.current.weather[0].description
                  }</h1>
                  <div class="heading-5">
                      <div class="row1">
                          <h5>Humidity:</h5>
                          <span class="sub" id="humidity">${
                            weatherData?.current.humidity
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470 100" id="svgPath">
                  <defs>
                      <linearGradient id="grad1">
                          <stop offset="0%" stop-color="#6b622a"/>
                          <stop offset="100%" stop-color="#6b622a" stop-opacity="0" />
                      </linearGradient>
                  </defs>
                  <label>fas</label>
                 ${text}

                 <path  class="graphTest" fill="url(#grad1)" fill-opacity="1"
                 d="M0 100 ${path} L1000 100 ">
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
      <div class="button-row" id="buttons">
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
  align-items: center;
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
  width: 145px;
  padding-left: 10px;
}
.right .h2 {
  width: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #d2dde5;
}
h1 {
  color: #ced5e3;
  font-size: 30px;
  font-family: arial;
}
.h2 button {
  color: #d2dde5;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  display: flex;
  font-family: arial;
  padding-top: 4px;
  margin: 0 4px;
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
.tempDeselected {
  color: #8490a2 !important;
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
  stroke-width: 1px;
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
.currentDay {
  background: linear-gradient(#12141a, #1d1f26);
  color: white;
}

text{
  font-size: 10px;
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

	</>
	`;
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
async function trigger(query) {
  if (query) {
    query = query ? query.toLowerCase() : "";
    if (query.includes("london") || query.includes("karachi") || query.includes("usa")) return true;
  }
  return false;
}

module.exports = { weather, trigger };
