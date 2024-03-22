'use strict';
const axios = require("axios");

const nominatim = 'https://nominatim.openstreetmap.org/?format=json&limit=1&q='

async function map(query, API_KEY) {
  let data = await axios.get(nominatim + query).catch(error => ({error}))
  let address;
  try {
    address = data.data[0]
  } catch (e) {
    return
  }
  return `
	<div id="presearchPackage">
	  <h3>${address.display_name || ''}</h3>
	  <div id="presearchPackageMap"></div>
	</div>
	<style>
	  #presearchPackageMap {
        height: 25rem;
        max-height: 100vh;
	  }
  </style>
	<script>
	  let link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css')
    document.head.appendChild(link)
    let leaf = document.createElement('script')
    leaf.setAttribute('src','https://unpkg.com/leaflet@1.7.1/dist/leaflet.js')
	  leaf.onload = function () {
	      let map = L.map('presearchPackageMap').setView([${address.lat}, ${address.lon}], 15);
	      L.marker([${address.lat}, ${address.lon}]).addTo(map)
	      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
	  }
    document.head.appendChild(leaf);
  </script>`
}

async function trigger(query) {
  return (query || '').match(/^\s*\S+(\s\S+){2,}/)
}

module.exports = { map, trigger };
