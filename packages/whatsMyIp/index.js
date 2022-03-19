'use strict';

const axios = require("axios");
const IP_API = "https://api64.ipify.org?format=json";

async function whatsMyIp(query) {
  const response = await axios.get(IP_API).catch(error => ({error}));

  if (response.error) return [];
	const userIp = response.data.ip;

	return `
	<div id="presearchPackage">
		<span class="ip description">${userIp}</span>
		<p class="description">Your public IP address</p>
	</div>
	<style>
		.dark #presearchPackage .description {
			color: rgba(255, 255, 255);
		}
		#presearchPackage .ip {
			font-size: x-large;
		}

		#presearchPackage .description {
		    color: rgba(31, 41, 55);
		}
	</style>
	`;
}

async function trigger(query) {
	if (query) {
		query = query ? query.toLowerCase() : "";
		if (query.search(/\bip\b/) !== -1) return true;
	}
	return false;
}

module.exports = { whatsMyIp, trigger };
