'use strict';
const axios = require("axios");

const API = "https://ec.europa.eu/budg/inforeuro/api/public/monthly-rates";

module.exports = {
  parse(query) {
    // normalize the input
    query = query.replace(",", ".").toUpperCase();

    // check for the input eg. "3 EUR to USD"
    const match = query.match(/(\d+(\.\d+)?) ([A-Z]{3}) TO ([A-Z]{3})/);

    if (!match) {
      return undefined;
    }

    const [, valueString, , from, to] = match;

    const value = parseFloat(valueString);

    return { value, from, to };
  },
  async fetchRates() {
    const response = await axios.get(API);
    return response.data;
  },
  convert(conversion, rates) {
    const fromRate = rates.find(rate => rate.isoA3Code === conversion.from);
    const toRate = rates.find(rate => rate.isoA3Code === conversion.to);

    if (!fromRate || !toRate) {
      return undefined;
    }

    const eurValue = conversion.value / fromRate.value;
    const toValue = eurValue * toRate.value;

    return toValue;
  }
}
