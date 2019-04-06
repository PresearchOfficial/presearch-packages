'use strict';
const fs = require('fs');
const fetch = require('node-fetch');
const path = require("path");
const apiKey = process.env.WEATHER_API_KEY;

const citiesReq = require('./city-list.json');


String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

function tempConverter(type, temp) {
	temp = temp - 273.15;
	if (type === 'c') {
		return temp.toFixed();
	} else if (type === 'f') {
		temp = temp * (9 / 5) + 32;
		return temp.toFixed();
	}
}



function weather(query) {
	query = query.toLowerCase();
	const citiesTemp = [];
	const urls = [];
	const countryList = new Set();
	const citiesList = [];
	const word = query.replace('weather in', '').trim();
	const cityQuery = word.toProperCase();

	function filtrCities(cities) { // check if there is more than one city with the same name
		cities.forEach(city => {
			if (city.name === cityQuery) {
				let coord = city.coord.lat.toFixed() + city.coord.lon.toFixed(); 
				if (!countryList.has(coord)) {
					countryList.add(coord);
					citiesList.push(city);
				}
			}
		});
	}

	filtrCities(citiesReq);
	citiesList.forEach(city => {
		let url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.coord.lat}&lon=${city.coord.lon}&APPID=${apiKey}`
		urls.push(url);
	})
	const promises = urls.map(url => fetch(url).then(res => res.json()));
	return Promise.all(promises).then(res => {
		res.forEach(temp => {
			citiesTemp.push(temp);
		});
		let finalHtml = '';
		citiesTemp.forEach(temp => {
			const name = temp.name;
			const resTemp = temp.main.temp;
			const tempC = tempConverter('c', resTemp);
			const tempF = tempConverter('f', resTemp);
			const country = temp.sys.country;
			const flag = fs.readFileSync(path.resolve(__dirname, `./flags/${country.toLowerCase()}.svg`));
			finalHtml += `<div class='city'><span class='name'>${name} ${flag}</span> <span class='temp'><button class="button">${tempC} \u00B0C</button><button class="button">${tempF} \u00B0F</button></span></div>`;
		});
		return `<style>.name{font-size: 2vw;}.temp{margin-left:10px; font-size: 1.4vw;}.button{background-color: #555555; border: none; color: white; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; width: 80px;}svg{width: 30px;}.city{padding: 10px;}</style> <div class='main'>${finalHtml}</div>`;
	})
}



function trigger(query) {
	query = query.toLowerCase();
	return query.includes('weather in') ? true : false;
}

module.exports = {weather,trigger};
