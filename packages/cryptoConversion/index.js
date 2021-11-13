'use strict';

const axios = require('axios');
const { getQty, findCurrency } = require('./search-help');
const { createHTML } = require('./display-help');

const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion';

// I'd rather not do this work twice, but I'm not sure if a node can process multiple queries at a time
const processQuery = async (query) => {
    const result = { found: false, leftCurrency: {}, rightCurrency: {} };
    const cleanQuery = query.replace(/\s+/g, ' ').trim().toLowerCase();
    let words = cleanQuery.split(' to ');
    if (words.length !== 2) words = cleanQuery.split(' = ');
    if (words.length !== 2) words = cleanQuery.split(' in ');
    if (words.length !== 2) words = cleanQuery.split(' into ');
    if (words.length !== 2) return result;

    const leftSearch = words[0];
    const rightSearch = words[1];

    // any qty is still part of the search string
    const leftQty = getQty(leftSearch);
    const results = await Promise.all([
        findCurrency(rightSearch),
        // check for coins that have all numbers for their symbol (like 42 coin)
        findCurrency(leftSearch)
    ]);
    const rightResult = results[0];
    let leftResult = results[1];

    if (!rightResult.found) return result;
    result.rightCurrency = rightResult.item;

    if (leftResult.found) {
        result.leftCurrency = leftResult.item;
        result.leftCurrency.qty = 1;
    } else if (leftQty.found) {
        // try again with the qty removed from the search string
        const nonQtyWords = leftSearch.split(' ');
        nonQtyWords.shift();
        leftResult = await findCurrency(nonQtyWords.join(' '));
        if (leftResult.found) {
            result.leftCurrency = leftResult.item;
            result.leftCurrency.qty = leftQty.qty;
        }
    }

    result.found = leftResult.found;
    return result;
};

async function cryptoConversion(query, API_KEY) {
    try {
        if (!API_KEY) return '';
        // assume it is already true since it passed the trigger
        const { leftCurrency, rightCurrency } = await processQuery(query);
        const headers = { Accept: 'application/json', 'Accept-Encoding': 'gzip', 'X-CMC_PRO_API_KEY': API_KEY };
        const instance = axios.create({ timeout: 1000, headers });
        const response = await instance.get(
            `${CMC_API_URL}?amount=${leftCurrency.qty}&id=${leftCurrency.id}&convert_id=${rightCurrency.id}`
        );
        rightCurrency.price = response.data.data.quote[rightCurrency.id].price;

        return createHTML(leftCurrency, rightCurrency);
    } catch (error) {
        return '';
    }
}

async function trigger(query) {
    try {
        const { found } = await processQuery(query);
        return found;
    } catch (error) {
        return false;
    }
}

module.exports = { cryptoConversion, trigger };
