//This script is used to update the list of cryptocurrencies.
//For binary search, it returns these sorted arrays:
// 1) Crypto names
// 2) Symbols
// 3) Slugs (web URL friendly name)
'use strict';
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const CRYPTO_NAME_FILE = "crypto_names.json";
const CRYPTO_SYMBOL_FILE = "crypto_symbols.json";
const CRYPTO_SLUG_FILE = "crypto_slugs.json";

const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";

const API_KEY = process.env.CMC_API_KEY;
if(!API_KEY) {
    console.log("Error: Please setup API key in .env with parameter CMC_API_KEY");
    return process.exit(0);
}

const headers = { Accept: "application/json", "Accept-Encoding": "gzip", "X-CMC_PRO_API_KEY": API_KEY };

const createIndex = (primaryField) => {
    return v => {
        return {
            [primaryField]: v[primaryField],
            id: v.id,
            rank: v.rank,
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

const createFile = (data, fileName, primaryField) => {
    const fileData = data.map(createIndex(primaryField)).sort(rankCompare(primaryField));

    fs.writeFile(fileName, JSON.stringify(fileData), error => {
        error ? console.log(error) : console.log(`Updated ${fileData.length} objects in ${fileName}`)
    });
};

//aux is empty so it does not return unwanted data
axios.get(CMC_API_URL + `?aux=`, { headers }).then(result => {
    const data = result.data.data;

    data.forEach(v => {
        //do some work ahead of time to help performance in the crypto conversion package
        v.display = `${v.name} (${v.symbol})`;
        //for case insensitive search
        v.name = v.name.toLowerCase();
        v.symbol = v.symbol.toLowerCase();
        v.slug = v.slug.toLowerCase();
    });

    createFile(data, CRYPTO_NAME_FILE, "name");
    createFile(data, CRYPTO_SYMBOL_FILE, "symbol");
    createFile(data, CRYPTO_SLUG_FILE, "slug");
}, error => {
    console.log(error);
});