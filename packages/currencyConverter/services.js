'use strict';
const axios = require("axios");

const cryptoCurrencies = require("./cryptoCurrencies.json");
const fiatCurrencies = require("./fiatCurrencies.json");
const fiatCurrenciesExtended = require("./fiatCurrenciesExtended.json");

const FIAT_API = "https://ec.europa.eu/budg/inforeuro/api/public/monthly-rates";
const CRYPTO_API = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
const SPREADSHEET_URI = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfp_xd8g5Sgw3v2rfgOSbMPnNaSkZsV6KMjJRPFDxY5Kb9AJoyUv8v54IqK-bHgjFV4efHrXntXGf5/pub?output=csv";
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

function convertFiatNamesToSymbols(query) {
  // define variables
  const fiatNames = {};
  let usdNames, gbpNames;

  let queryCheck = query;

  for (const currency of fiatCurrenciesExtended) {
    if (currency.note || currency.global) continue;

    // save USD and GBP names and give them higher priority over other fiat currencies
    if (currency.symbol === "USD") usdNames = currency.names;
    if (currency.symbol === "GBP") gbpNames = currency.names;
  }

  for (const currency of fiatCurrenciesExtended) {
    let { names, symbol } = currency;
    if (currency.note || currency.global) continue;

    if (names) {
      // check the longest names first
      names = names.sort((a,b) => b.length - a.length);

      for (let name of names) {
        name = name.toUpperCase();
        if (queryCheck.includes(name)) {

          // usd should have priority for 'dollar' etc.
          if (usdNames.includes(name.toLowerCase())) {
            fiatNames[name] = "USD";
            // remove the found name from the query
            queryCheck = queryCheck.split(name).join("");
            continue;
          }

          // gbp should have priority for 'pound' etc.
          if (gbpNames.includes(name.toLowerCase())) {
            fiatNames[name] = "GBP";
            // remove the found name from the query
            queryCheck = queryCheck.split(name).join("");
            continue;
          }

          // save the found fiat name 
          fiatNames[name] = symbol;
          // remove the found name from the query
          queryCheck = queryCheck.split(name).join("");
        }
      }
    }
  }

  // replace fiat names with fiat symbols when we have a match
  const fiatNamesArray = Object.keys(fiatNames);
  if (fiatNamesArray.length) {
    for (const fiatName of fiatNamesArray) {
      query = query.split(fiatName).join(fiatNames[fiatName])
    }
  }

  return query;

}

function parseAndNormalize(query) {
  // normalize the input
  query = query.trim().replaceAll(",", "").toUpperCase();

  // convert fiat names in query to symbols, i.e 1000 pounds to usd will return 1000 gbp to usd
  query = convertFiatNamesToSymbols(query);

  // check for the input eg. "3 EUR to USD"
  // we are expecting fiat currencies to have 3 chars and crypto currencies to have up to 8 chars (at least most of them)
  const match = query.match(/((\d+(\.\d+)?) )?([A-Z]{2,8}) {0,1}(TO|INTO|=| ) {0,1}([A-Z]{2,8})/);

  if (!match) {
    return undefined;
  }

  const joints = ["TO", "INTO", "=", " "];

  // check if we have " " as joint. If yes, exclude queries like "apple btc info"
  const emptySpaceJoint = !query.includes(" TO ") && !query.includes(" INTO ") && !query.includes(" = ");
  if (emptySpaceJoint && query.split(" ").length > 2) {
    const amount = query.split(" ")[0];
    if (isNaN(parseFloat(amount))) {
      return undefined;
    }
   
  }

  // Extract amount, from and to into an array
  const filteredMatch = match.filter((el) => {
    if (!el) return false;
    const lowercaseEl = el.toLowerCase();
    return (
      el != query && !el.includes(" ") && lowercaseEl != query && !joints.includes(el)
    )
  })

  let valueString, from, to;
  if (filteredMatch && filteredMatch.length) {
    // handle the case when there's nothing between currencies, i.e. 'usd eur'
    if (filteredMatch.length == 2) {
      [from, to] = filteredMatch;
    // when we have a float value (ie. '0.1 btc usd'), there will be 4 items in the array
    } else if (filteredMatch.length == 4) {
      [valueString, , from, to] = filteredMatch;
    } else {
      [valueString, from, to] = filteredMatch;
    }

  } else {
    return undefined;
  }

  const value = parseFloat(valueString ?? 1);

  // return when there's no match in offline lists
  if (!cryptoCurrencies[from] && !fiatCurrencies[from]) {
    return undefined;
  }
  if (!cryptoCurrencies[to] && !fiatCurrencies[to]) {
    return undefined;
  }

  // Allow search with " " as joint for fiat currencies only,
  // Because there are lot of Cryptocurrencies and sometimes package triggers for wrong queries also
  if (emptySpaceJoint) {
    if (!fiatCurrencies[from] || !fiatCurrencies[to]) {
      return undefined;
    }
  }

  if (from === to) {
    return undefined;
  }

  const fromName = (cryptoCurrencies[from] && !fiatCurrencies[from]) ? cryptoCurrencies[from].name : '';
  const isFiatConversion = fiatCurrencies[from] && fiatCurrencies[to];
  return { value, from, to, fromName, isFiatConversion};
}

/**
 * Attempt to fetch the fiat rates for the conversion
 * @param {Conversion} conversion
 * @returns {Promise<CurrencyRate[]>}
 */
async function fetchFiatRates(conversion) {
  //Not supported by google finance api
  const NS = ["CUC","ERN","FKP","GGP","GIP","IMP","JEP","KPW","MNT","MRO","SHP","SSP","STD","STN","SYP","VEF","VUV","WST","XAG","XAU","XDR","XPD","XPT","ZWL"];
  const targetCurrencies = [conversion.from, conversion.to, USD_CODE];

  var response = {};
  if(targetCurrencies.some(x=>NS.includes(x))){
    response = await axios.get(FIAT_API).catch(error => ({error}));
    if (response.error) return [];
  }else{
    const res = await axios.get(SPREADSHEET_URI).catch(error => ({error}));
    if (res.error) return [];
    response['data'] = parseCSV(res.data);
  }

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
  if (!API_KEY || conversion.isFiatConversion) return [];

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
  // Computes number of digits to put after decimal for given float value
  const round = toValue > 1 ? 2 : -Math.floor( Math.log10(toValue) + 1) + 2;

  const fromName = fiatCurrencies[conversion.from] || cryptoCurrencies[conversion.from].name;
  const toName = fiatCurrencies[conversion.to] || cryptoCurrencies[conversion.to].name;
  return { value: toValue, round: round, code: toRate.code, fromName: fromName, toName:toName};
}

/**
 * Function to parse and convert CSV response to relevent currency object array
 * @param {string} str 
 * @param {char} delimiter 
 * @returns {array}
 */
function parseCSV(str, delimiter = ','){
  if(str.match('\\r\\n')){
      str = str.replaceAll('\r\n','\n');
  }
  const rows = str.split('\n');
  var parsed = [];
  rows.map((row)=>{
      var temp = row.split(delimiter);
      parsed.push({
          'isoA3Code': temp[0],
          'value': temp[1]
      });
  })
  return parsed;
}

module.exports = { parseAndNormalize, fetchRates, convert };
