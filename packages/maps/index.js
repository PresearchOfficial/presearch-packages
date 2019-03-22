'use strict';

const cityList = require('./city-list.json'); // World city list with coords
const fetch = require('node-fetch')
const API_KEY = API_KEY

function maps(query) {
	query = query.toLowerCase();
	let variables = ''
	let script = ''
	let description = '<div class="list"><ul>'
	return fetch(`https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${query}`)
        .then(r => r.json())
		.then(r => r.features.filter(val => val.properties.match_type === 'exact')) // get only cities (exact match) from openroute API
		.then(r => {
			// remove duplicates
			let duplicates = new Set()
			r = r.filter(r => {
				if(!duplicates.has(r.properties.label)){
					duplicates.add(r.properties.label)
					return r
				} 
			})

			
			// create html and js for each city (result)
			for(let i = 0; i < r.length; ++i){
				variables += `let marker${i} = L.marker([${r[i].geometry.coordinates[1]}, ${r[i].geometry.coordinates[0]}]);`
				script += `marker${i}.addTo(mymap).bindPopup('${r[i].properties.label}').on('click', function(e){listClick(${r[i].geometry.coordinates[1]}, ${r[i].geometry.coordinates[0]}, '${r[i].properties.name}','${r[i].properties.label}', '${r[i].properties.name + ' ' +  r[i].properties.region}')}).on('mouseover', function (e) {this.openPopup();});`
				description += `<li onmouseover="marker${i}.openPopup();" onclick="listClick(${r[i].geometry.coordinates[1]}, ${r[i].geometry.coordinates[0]}, '${r[i].properties.name}', '${r[i].properties.label}', '${r[i].properties.name + ' ' + r[i].properties.region}')">${r[i].properties.label}</li>`
			}

			if(r.length === 1) {
				script += `listClick(${r[0].geometry.coordinates[1]}, ${r[0].geometry.coordinates[0]}, '${r[0].properties.name}', '${r[0].properties.label}', '${r[0].properties.name + ' ' + r[0].properties.region}');`;
			}

			return r
			
		})
		.then(r => {
			description += '</ul></div>'

			// find a center between 2 cities or more
			const max_lat = r.reduce((prev, current) => (prev.geometry.coordinates[1] > current.geometry.coordinates[1]) ? prev : current);
			const min_lat = r.reduce((prev, current) => (prev.geometry.coordinates[1] < current.geometry.coordinates[1]) ? prev : current);
			const max_lon = r.reduce((prev, current) => (prev.geometry.coordinates[0] > current.geometry.coordinates[0]) ? prev : current);
			const min_lon = r.reduce((prev, current) => (prev.geometry.coordinates[0] < current.geometry.coordinates[0]) ? prev : current);
			// coords to center the map
			const center = {
				lat: (max_lat.geometry.coordinates[1] + min_lat.geometry.coordinates[1]) / 2,
				lon: (max_lon.geometry.coordinates[0] + min_lon.geometry.coordinates[0]) / 2
			};

			// calculate the discance between the cities to adjust map zoom
			function calculateZoom() {
				const lon = (max_lon.geometry.coordinates[0]) - (min_lon.geometry.coordinates[0]);
				const lat = (max_lat.geometry.coordinates[1]) - (min_lat.geometry.coordinates[1]);
				if (lon > 210) {
					return '1'
				} else if ((lon < 210 && lon > 80) || (lat < 110 && lat > 40)) {
					return '2'
				} else if ((lon < 80 && lon > 40) || (lat < 40 && lat > 20)) {
					return '3'
				} else if ((lon < 40 && lon > 20) || (lat < 20 && lat > 10)) {
					return '4'
				} else if (lon < 0.2 && lat < 0.2) {
					return '10'
				} else {
					return '5'
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
						z-index: 1;
						border-radius: 10px;
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
					#desc {
						margin-left: 51%;
						height:300px;
						width:49%;
					}
					.spacer {
						height:300px;
						width: 1px;
						background: #aaa;
						position: absolute;
					}
					.list {
						position: relative;
					}
					.list > ul {
						list-style-type: none;
						padding: 0;
						margin: 0;

					}
					.list > ul > li:hover {
						opacity: 0.5;
					}
					.list > ul > li {
						padding: 6px 16px;
						cursor: pointer;
					}
					
				</style>
				<div id="main">
					<div id="map"></div>
					<div id="loading"><div class="lds-dual-ring"></div></div>
				</div>
				<div id="desc">
					<div class="spacer"></div>
					${description}
					<div id='city-info' style='display:none'></div>
				</div>
				<script>
					const mymap = L.map('map').setView([${center.lat},${center.lon}], ${calculateZoom()});
					const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
						maxZoom: 18
					});
					tileLayer.addTo(mymap);
					tileLayer.on("load",function() { 
						document.getElementById('loading').style="display:none;" 
					});
					function listClick(lat, lon, name, label, region) {
						mymap.setView([lat, lon], 13);
						document.getElementsByClassName('list')[0].style = 'display:none';
						cityInfo(name, label, region)
					}
					${variables}
					
					const proxyurl = 'https://cors-anywhere.herokuapp.com/';
					function cityInfo(name, label, region) {
						const info = [label, region, name,  name + ' city']
						let inserted = false
						const div = document.getElementById('city-info')
						div.style = 'margin-left: 5%;height: 300px;width: 60%;'
						info.forEach(i => {
							let url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + i +'&limit=1&format=json';
							fetch(proxyurl + url) 
							.then(r => r.json())
							.then(r => {
								if(r[2].join().length > 50 && !inserted) {
									div.innerHTML = '<h2>'+ r[1].join() +'</h2><p>'+ r[2].join() +'</p><p style="float:right; margin:0;"><a style="color:#0e5ee7;" href="' + r[3].join() + '">Wikipedia</a></p>'
									inserted = true
								}
							})
						})
						
					}
					${script}
				</script>
				`
				
		})
		.catch(e => false)
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
