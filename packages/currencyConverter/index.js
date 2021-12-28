'use strict';
const services = require('./services');

async function currencyConverter(query, API_KEY) {
  const conversion = services.parseAndNormalize(query);

  if (!conversion) {
    return undefined;
  }

  const rates = await services.fetchRates(conversion, API_KEY);

  if (!rates) {
    return undefined;
  }

  const converted = services.convert(conversion, rates);

  if (!converted) {
    return undefined;
  }

  return `
    <div id="presearchPackage">
      <div id="currencyConverter">
        <div class="from">${services.formatCurrency({value: conversion.value, code: conversion.from})} <i>&asymp;</i></div>
        <div class="to">${services.formatCurrency(converted)}</div>
        <p class="disclaimer">Exchange rates are downloaded from the <a target="_blank" rel="noreferrer" href="https://ec.europa.eu">European Commission</a> and <a target="_blank" rel="noreferrer" href="https://coinmarketcap.com">CoinMarketCap</a>. Presearch does not guarantee the accuracy.</p>
      </div>
    </div>
    <style>
    .to {
      font-size: xx-large;
    }

    .from {
      color: grey;
    }

    .dark #currencyConverter {
      color: white;
    }

    .disclaimer {
      font-size: x-small;
      color: grey;
    }

    .disclaimer a {
      text-decoration: underline;
    }
    </style>
  `;
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
function trigger(query) {
  return services.parseAndNormalize(query) !== undefined;
}

module.exports = { currencyConverter, trigger };
