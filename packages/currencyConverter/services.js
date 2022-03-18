'use strict';
const axios = require("axios");

const cryptoCurrencies = require("./cryptoCurrencies.json");
const fiatCurrencies = require("./fiatCurrencies.json");

const FIAT_API = "https://ec.europa.eu/budg/inforeuro/api/public/monthly-rates";
const CRYPTO_API = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
const USD_CODE = "USD";

/**
 * @typedef Conversion
 * @type {object}
 * @property {string} to Which currency to convert from
 * @property {string} from Which currency to convert to
 * @property {number} value The value to convert
 * @property {fromName} fromName Full name of the cryptocurrency (if from is cryptocurrency)
 */

/**
 * @typedef CurrencyRate
 * @type {object}
 * @property {string} code The code of the currency
 * @property {number} rate How much 1 EUR is worth
 * @property {number|undefined} round How many decimals to round to, if allowed at all
 */

/**
 * @typedef Money
 * @type {object}
 * @property {number} value
 * @property {number|undefined} round many decimals to round to when formatting, if allowed at all
 * @property {string} code The code of the currency
 */

/**
 * Parse the incoming search query and attempt to find a currency conversion request.
 * @param {string} query
 * @returns {Conversion | undefined}
 */
function parseAndNormalize(query) {
  // normalize the input
  query = query.trim().replace(",", ".").toUpperCase();

  // check for the input eg. "3 EUR to USD"
  // we are expecting fiat currencies to have 3 chars and crypto currencies to have up to 8 chars (at least most of them)
  const match = query.match(/((\d+(\.\d+)?) )?([A-Z]{2,8}) {0,1}(TO|INTO|=| ) {0,1}([A-Z]{2,8})/);

  if (!match) {
    return undefined;
  }

  // leave just amount, from and to
  const filteredMatch = match.filter((el) => {
    if(!el) return false;
    const lowercaseEl = el.toLowerCase();
    return (
      el != query && !el.includes(" ") && lowercaseEl != query && lowercaseEl != "to" && lowercaseEl != "into" && lowercaseEl != "=" && lowercaseEl != " "
    )
  })

  let valueString, from, to;

  if (filteredMatch && filteredMatch.length) {
    // handle the case when there's nothing between currencies, i.e. 'usd eur'
    if (filteredMatch.length == 2) {
      [from, to] = filteredMatch;
    } else {
      [valueString, from, to] = filteredMatch;
    }
  } else {
    return undefined;
  }

  const value = parseFloat(valueString ?? 1);

  if (!cryptoCurrencies[from] && !fiatCurrencies[from]) {
    return undefined;
  }

  if (!cryptoCurrencies[to] && !fiatCurrencies[to]) {
    return undefined;
  }

  return { value, from, to, fromName: cryptoCurrencies[from] ? cryptoCurrencies[from].name : '' };
}

/**
 * Attempt to fetch the fiat rates for the conversion
 * @param {Conversion} conversion
 * @returns {Promise<CurrencyRate[]>}
 */
async function fetchFiatRates(conversion) {
  const response = await axios.get(FIAT_API).catch(error => ({error}));

  if (response.error) return [];

  const targetCurrencies = [conversion.from, conversion.to, USD_CODE];

  return response.data.filter(currency => targetCurrencies.includes(currency.isoA3Code))
    .map(currency => ({
      code: currency.isoA3Code,
      rate: currency.value,
      round: 2
    }));
}

/**
 * Attempt to fetch the crypto rates for the conversion
 * @param {Conversion} conversion
 * @param {string} API_KEY
 * @returns {Promise<CurrencyRate[]>}
 */
async function fetchCryptoRates(conversion, API_KEY) {
  if (!API_KEY) return [];
  // the "aux" parameter controls which fields we get. we only need the "quote" field, but it can't
  // be specified in the "aux" parameter. just send one value in order to reduce the payload.
  const response = await axios.get(
    `${CRYPTO_API}?skip_invalid=true&aux=date_added&symbol=${conversion.from},${conversion.to}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
      }
    }
  ).catch(error => ({error}));

  if (response.error) return [];

  return Object.values(response.data.data)
    .map(currency => ({
      code: currency.symbol,
      rate: currency.quote[USD_CODE].price,
      round: undefined,
    }));
}

/**
 * Attempt to fetch the rates for the conversion
 * @param {Conversion} conversion
 * @param {string} API_KEY
 * @returns {Promise<CurrencyRate[] | undefined>}
 */
async function fetchRates(conversion, API_KEY) {
  const [fiatCurrencies, cryptoCurrencies] = await Promise.all([
    fetchFiatRates(conversion),
    fetchCryptoRates(conversion, API_KEY),
  ]);

  // crypto rates are returned with USD base value but fiat are returned with EUR.
  // normalize everything to EUR.
  const usd = fiatCurrencies.find(rate => rate.code === USD_CODE);

  if (!usd) {
    return undefined;
  }

  const cryptoCurrenciesUsd = cryptoCurrencies.map(currency => ({ ...currency, rate: usd.rate / currency.rate }));

  return fiatCurrencies.concat(cryptoCurrenciesUsd);
}

/**
 * Execute the conversion using the given rates
 * @param {Conversion} conversion
 * @param {CurrencyRate[]} rates
 * @returns {Money | undefined}
 */
function convert(conversion, rates) {
  const fromRate = rates.find(currency => currency.code === conversion.from);
  const toRate = rates.find(currency => currency.code === conversion.to);

  if (!fromRate || !toRate) {
    return undefined;
  }

  const eurValue = conversion.value / fromRate.rate;
  const toValue = eurValue * toRate.rate;

  return { value: toValue, round: toRate.round, code: toRate.code };
}

module.exports = { parseAndNormalize, fetchRates, convert };
