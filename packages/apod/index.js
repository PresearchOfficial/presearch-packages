'use strict';
const fetch = require('node-fetch');

const APOD_API_KEY = 'bLhnNpy0ntfp1QzvG61uXC6m52fbcFKmtyJCYvbA';

async function apod() {
  const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${APOD_API_KEY}`);
  const json = await res.text();
  return JSON.parse(json);
}

async function trigger(query) {
  return query.toLowerCase() === 'apod';
}

module.exports = { apod, trigger };
