//This script is used to update the list of cryptocurrencies, fiat currencies,
//and precious metals.
//To enable binary search, it returns these sorted arrays:
// 1) Crypto names (Binance Coin)
// 2) Crypto symbols (BNB)
// 3) Crypto slugs - web URL friendly name (binance-coin)
// 4) Fiat and metal names (United States Dollar)
// 5) Fiat and metal symbols (USD)
'use strict';
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

//todo short names like dollar/dollars instead of united states dollar
//todo specify decimals?
const CRYPTO_NAME_FILE = "crypto_names.json";
const CRYPTO_SYMBOL_FILE = "crypto_symbols.json";
const CRYPTO_SLUG_FILE = "crypto_slugs.json";
const FIAT_NAME_FILE = "fiat_names.json";
const FIAT_SYMBOL_FILE = "fiat_symbols.json";

const CRYPTO_API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";
const FIAT_API_URL = "https://pro-api.coinmarketcap.com/v1/fiat/map";

const API_KEY = process.env.CMC_API_KEY;
if(!API_KEY) {
    console.log("Error: Please setup API key in .env with parameter CMC_API_KEY");
    return process.exit(0);
}

const headers = { Accept: "application/json", "Accept-Encoding": "gzip", "X-CMC_PRO_API_KEY": API_KEY };

const createCryptoIndex = (primaryField) => {
    return v => {
        return {
            [primaryField]: v[primaryField],
            id: v.id,
            rank: v.rank,
            display: v.display
        };
    };
};

const createFiatIndex = (primaryField) => {
    return v => {
        return {
            [primaryField]: v[primaryField],
            id: v.id,
            display: v.display
        };
    };
};

const rankCompare = (primaryField) => {
    return (a,b) => {
        return a[primaryField] < b[primaryField] ? -1 : (
            a[primaryField] > b[primaryField] ? 1 : a.rank - b.rank
        );
    };
};

const fieldCompare = (field) => {
    return (a,b) => {
        return a[field] < b[field] ? -1 : (
            a[field] > b[field] ? 1 : 0
        );
    };
};

const createCryptoFile = (data, fileName, primaryField) => {
    const fileData = data.map(createCryptoIndex(primaryField)).sort(rankCompare(primaryField));

    fs.writeFile(fileName, JSON.stringify(fileData), error => {
        error ? console.log(error) : console.log(`Updated ${fileData.length} objects in ${fileName}`)
    });
};

const createFiatFile = (data, fileName, primaryField) => {
    const fileData = data.map(createFiatIndex(primaryField)).sort(fieldCompare(primaryField));

    fs.writeFile(fileName, JSON.stringify(fileData), error => {
        error ? console.log(error) : console.log(`Updated ${fileData.length} objects in ${fileName}`)
    });
};

//aux is empty so it does not return unwanted data
axios.get(CRYPTO_API_URL + `?aux=`, { headers }).then(response => {
    const data = response.data.data;

    data.forEach(v => {
        //do some work ahead of time to help performance in the crypto conversion package
        v.display = `${v.name} (${v.symbol})`;
        //for case insensitive search
        v.name = v.name.toLowerCase();
        v.symbol = v.symbol.toLowerCase();
        v.slug = v.slug.toLowerCase();
    });

    createCryptoFile(data, CRYPTO_NAME_FILE, "name");
    createCryptoFile(data, CRYPTO_SYMBOL_FILE, "symbol");
    createCryptoFile(data, CRYPTO_SLUG_FILE, "slug");
}, error => {
    console.log(error);
});

axios.get(FIAT_API_URL + `?include_metals=true`, { headers }).then(response => {
    const data = response.data.data;

    data.forEach(v => {
        v.display = `${v.name} (${v.symbol})`;
        v.name = v.name.toLowerCase();
        v.symbol = v.symbol.toLowerCase();
    });

    createFiatFile(data, FIAT_NAME_FILE, "name");
    createFiatFile(data, FIAT_SYMBOL_FILE, "symbol");
}, error => {
    console.log(error);
});