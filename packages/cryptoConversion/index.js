'use strict';

const axios = require('axios');
const { getQty, findCurrency } = require('./search-help');
const { createHTML } = require('./display-help');

const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion';

// During the trigger, we remember the currencies we find (for performance).
// In the files, each object needs to have .id and .display
let leftCurrency = {};
let rightCurrency = {};

async function cryptoConversion(query, API_KEY) {
    try {
        if (!API_KEY) return '';

        const headers = { Accept: 'application/json', 'Accept-Encoding': 'gzip', 'X-CMC_PRO_API_KEY': API_KEY };
        const response = await axios.get(
            `${CMC_API_URL}?amount=${leftCurrency.qty}&id=${leftCurrency.id}&convert_id=${rightCurrency.id}`,
            { headers }
        );
        rightCurrency.price = response.data.data.quote[rightCurrency.id].price;

        return createHTML(leftCurrency, rightCurrency);
    } catch (error) {
        return '';
    }
}

async function trigger(query) {
    try {
        const cleanQuery = query.replace(/\s+/g, ' ').trim().toLowerCase();
        const words = cleanQuery.split(' to ');
        if (words.length !== 2) return false;

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

        if (!rightResult.found) return false;
        rightCurrency = rightResult.item;

        if (leftResult.found) {
            leftCurrency = leftResult.item;
            leftCurrency.qty = 1;
        } else {
            // try again with the qty removed from the search string
            const nonQtyWords = leftSearch.split(' ');
            nonQtyWords.shift();
            leftResult = await findCurrency(nonQtyWords.join(' '));
            if (leftResult.found) {
                leftCurrency = leftResult.item;
                leftCurrency.qty = leftQty;
            }
        }

        return leftResult.found;
    } catch (error) {
        return false;
    }
}

module.exports = { cryptoConversion, trigger };
