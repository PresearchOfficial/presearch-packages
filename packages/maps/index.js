'use strict';

const cityList = require('./city-list.json'); // World city list with coords

function maps(query) {
	query = query.toLowerCase();
	const filtered = cityList.filter(city => city.name.toLowerCase() === query); // get all the cities that have the same name as query

	// remove duplicates - it's because sometimes city-list.json contains the same location with sligt different coords (-.-")
	let duplicates = []
	const noDuplicates = filtered.filter(r => {
		const lat = r.coord.lat.toFixed(1)
		if(!duplicates.includes(lat)){
			duplicates.push(lat)
			return r
		}
	})
	
	// create marker on the map for each city
	const city = noDuplicates.map(r => `L.marker([${r.coord.lat}, ${r.coord.lon}]).addTo(mymap).on('click', function(e){mymap.setView(e.latlng, 13)});`)
					.join(''); 

	// find a center between 2 cities or more
	const max_lat = noDuplicates.reduce((prev, current) => (prev.coord.lat > current.coord.lat) ? prev : current); 
	const min_lat = noDuplicates.reduce((prev, current) => (prev.coord.lat < current.coord.lat) ? prev : current);
	const max_lon = noDuplicates.reduce((prev, current) => (prev.coord.lon > current.coord.lon) ? prev : current); 
	const min_lon = noDuplicates.reduce((prev, current) => (prev.coord.lon < current.coord.lon) ? prev : current);
	// coords to center the map
	const center = {lat: (max_lat.coord.lat + min_lat.coord.lat) / 2, lon: (max_lon.coord.lon + min_lon.coord.lon) / 2 };

	// calculate the discance between the cities to adjust map zoom
	function calculateZoom (){
		const lon = (max_lon.coord.lon) - (min_lon.coord.lon);
		const lat = (max_lat.coord.lat) - (min_lat.coord.lat);
		if(lon > 210) {
			return '1'
		} else if ((lon < 210 && lon > 80) || (lat < 110 && lat > 40)) {
			return '2'
		} else if ((lon < 80 && lon > 40) || (lat < 40 && lat > 20)) {
			return '3'
		} else if ((lon < 40 && lon > 20) || (lat < 20 && lat > 10)) {
			return '4'
		} else if (lon < 0.2 && lat < 0.2){
			return '10'
		} else {
			return '6'
		}
	}


	return `
	<script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js" integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
	crossorigin=""></script>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css" integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
	crossorigin="" />
	<style>
		#map { 
			height: 300px;
			width: 600px;
			position: absolute;
			z-index: 1
		}
		#loading {
			position: absolute;
			z-index:2;
			width: 600px;
			height: 300px;
			margin:0 !important;
			background:#000;
			opacity:0.5;
			color: #fff;
			text-align: center;
		}
		.lds-dual-ring {
			display: inline-block;
			width: 64px;
			height: 64px;
			margin-top: 120px;
		  }
		  .lds-dual-ring:after {
			content: " ";
			display: block;
			width: 46px;
			height: 46px;
			margin: 1px;
			border-radius: 50%;
			border: 5px solid #fff;
			border-color: #fff transparent #fff transparent;
			animation: lds-dual-ring 1.2s linear infinite;
		  }
		  @keyframes lds-dual-ring {
			0% {
			  transform: rotate(0deg);
			}
			100% {
			  transform: rotate(360deg);
			}
		  }
		  
	</style>
	<div id="main">
		<div id="map"></div>
		<div id="loading"><div class="lds-dual-ring"></div></div>
	</div>
	<script>
		const mymap = L.map('map').setView([${center.lat}, ${center.lon}], ${calculateZoom()});
		const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
			maxZoom: 18
		});
		tileLayer.addTo(mymap);
		tileLayer.on("load",function() { document.getElementById('loading').style="display:none;" });
		${city}
	</script>
    `;
}

function trigger(query) {
    query = query.toLowerCase();
    const filtered = cityList.filter(city => city.name.toLowerCase() === query); // check if query is in city list
    return query = filtered.length > 0 ? true : false; // return true if query is in the list
}

module.exports = {
    maps,
    trigger
};
