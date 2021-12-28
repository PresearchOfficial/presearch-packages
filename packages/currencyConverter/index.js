'use strict';
const services = require('./services');

async function currencyConverter(query, API_KEY) {
  try {
    const conversion = services.parse(query);

    if (!conversion) {
      return undefined;
    }

    const rates = await services.fetchRates();

    const convertedValue = services.convert(conversion, rates);

    if (!convertedValue) {
      return undefined;
    }

    return `
      <div id="presearchPackage">
        <div id="currencyConverter">
          <div class="from">${conversion.value} ${conversion.from} =</div>
          <div class="to">${convertedValue.toFixed(2)} ${conversion.to}</div>
          <p class="disclaimer">Exchange rates are downloaded from the <a target="_blank" href="https://ec.europa.eu">European Commission</a>. Presearch does not guarantee the accuracy.</p>
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
        font-size: small;
      }

      .disclaimer a {
        text-decoration: underline;
      }
      </style>
    `;
  } catch (error) {
    return undefined;
  }
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
function trigger(query) {
  return services.parse(query) !== undefined;
}

module.exports = { currencyConverter, trigger };
