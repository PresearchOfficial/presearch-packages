/* This script is used to update the list of cryptocurrencies, fiat currencies,
* and precious metals. To enable binary search, it returns sorted arrays.
*
* These files are created:
* (1 and 2) Crypto names and fiat names
* (3 and 4) Crypto symbols and fiat symbols
* (5) Metadata file for both types
*
* Name files are lower case for case insensitive search and may include:
*  - names (Binance Coin)
*  - symbols (BNB)
*  - slugs - web URL friendly name (binance-coin)
*  - nicknames/short names (dollar instead of USD or United States Dollar)
*
* Symbol/Name objects:
*  - id: CMC unique id
*  - symbol/name: representing name, symbol, etc...
*  - rank (crypto only): CMC rank based on market cap, used as a tie breaker
*
* Metadata objects:
*  - id: CMC unique id
*  - display: display name that will be shown to the user
*/

'use strict';

const fs = require('fs').promises;
const path = require('path');

const configPath = path.resolve(__dirname, '../../server/.env');
require('dotenv').config({ path: configPath });
const axios = require('axios');
const bs = require('binary-search');
const packageJSON = require('./package.json');

const DATA_DIR = 'data';
const CRYPTO_NAME_FILE = `${DATA_DIR}/crypto_names.json`;
const CRYPTO_SYMBOL_FILE = `${DATA_DIR}/crypto_symbols.json`;
const FIAT_NAME_FILE = `${DATA_DIR}/fiat_names.json`;
const FIAT_SYMBOL_FILE = `${DATA_DIR}/fiat_symbols.json`;
const META_FILE = `${DATA_DIR}/currency_metadata.json`;
const MANUAL_FILE = `${DATA_DIR}/manual_fiat.json`;

const CRYPTO_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
const FIAT_API_URL = 'https://pro-api.coinmarketcap.com/v1/fiat/map';

const API_KEY = process.env[`API.${packageJSON.name.toUpperCase()}`];
if (!API_KEY) {
    console.log(`Error: Please setup API key in ${configPath}`);
    process.exit(9);
}

const fieldSearch = (field) => (object, search) => (object[field] < search ? -1 : (object[field] > search ? 1 : 0));
const rankSort = (field) => (a, b) => (a[field] < b[field] ? -1 : (a[field] > b[field] ? 1 : a.rank - b.rank));
const fieldSort = (field) => (a, b) => (a[field] < b[field] ? -1 : (a[field] > b[field] ? 1 : 0));

const CurrencyData = {
    raw: {},
    files: {
        metadata: [], cryptoSymbols: [], cryptoNames: [], fiatSymbols: [], fiatNames: []
    },

    async getRawData() {
        const headers = { Accept: 'application/json', 'Accept-Encoding': 'gzip', 'X-CMC_PRO_API_KEY': API_KEY };
        [this.raw.crypto, this.raw.fiat, this.raw.manualFiat] = await Promise.all([
            axios.get(`${CRYPTO_API_URL}?aux=`, { headers }),
            axios.get(`${FIAT_API_URL}?include_metals=true`, { headers }),
            fs.readFile(MANUAL_FILE, 'utf8')
        ]);
    },

    transform() {
        const {
            cryptoSymbols, cryptoNames, fiatSymbols, fiatNames, metadata
        } = this.files;

        // process crypto
        this.raw.crypto.data.data.forEach((o) => {
            cryptoSymbols.push({ id: o.id, symbol: cleanString(o.symbol), rank: o.rank });
            cryptoNames.push({ id: o.id, name: cleanString(o.name), rank: o.rank });
            cryptoNames.push({ id: o.id, name: cleanString(o.slug), rank: o.rank });
            metadata.push(createMetadata(o));
        });

        // process fiat
        this.raw.fiat.data.data.forEach((o) => {
            fiatSymbols.push({
                id: o.id,
                // CMC metals use .code instead of fiat's .symbol
                symbol: o.symbol ? cleanString(o.symbol) : cleanString(o.code)
            });
            fiatNames.push({ id: o.id, name: cleanString(o.name) });
            metadata.push(createMetadata(o));
        });
        fiatSymbols.sort(fieldSort('symbol'));

        const manualFiat = JSON.parse(this.raw.manualFiat);
        manualFiat.shift(); // remove documentation at start of file
        const globalNames = (manualFiat.shift().names || []).map((v) => cleanString(v));

        // process manual
        manualFiat.forEach((fiat) => {
            const symbol = cleanString(fiat.symbol);
            if (symbol.length === 0) return;

            const i = bs(fiatSymbols, symbol, fieldSearch('symbol'));
            if (i < 0) {
                return; // CMC may not offer conversion for all fiat currencies
            }
            const { id } = fiatSymbols[i];

            const nicknames = (fiat.nicknames || []).map((v) => cleanString(v));
            nicknames.forEach((nickname) => { fiatNames.push({ id, name: nickname }); });

            const names = (fiat.names || []).map((v) => cleanString(v));
            names.push(...globalNames);
            const adjectives = (fiat.adjectives || []).map((v) => cleanString(v));

            // prepend symbols and adjectives
            names.forEach((name) => {
                if (name.length === 0) return;
                fiatNames.push({ id, name: `${symbol} ${name}` });
                adjectives.forEach((adjective) => {
                    if (adjective.length === 0) return;
                    fiatNames.push({ id, name: `${adjective} ${name}` });
                });
            });
        });
        this.raw = null;
    },

    curate() {
        deleteBadData(this.files.metadata, checkBadData('display'));
        deleteBadData(this.files.cryptoSymbols, checkBadRankData('symbol'));
        deleteBadData(this.files.cryptoNames, checkBadRankData('name'));
        deleteBadData(this.files.fiatSymbols, checkBadData('symbol'));
        deleteBadData(this.files.fiatNames, checkBadData('name'));
    },

    sort() {
        this.files.metadata.sort(fieldSort('id'));
        this.files.cryptoSymbols.sort(rankSort('symbol'));
        this.files.cryptoNames.sort(rankSort('name'));
        this.files.fiatSymbols.sort(fieldSort('symbol'));
        this.files.fiatNames.sort(fieldSort('name'));
    },

    deleteDuplicates() {
        // should only need to check for duplicate names because we can assume mostly good data from CMC
        deleteDuplicateData(this.files.cryptoNames, checkDuplicate('name'));
        deleteDuplicateData(this.files.fiatNames, checkDuplicate('name'));
    },

    async createFiles() {
        const { files } = this;
        await Promise.all([
            fs.writeFile(CRYPTO_NAME_FILE, JSON.stringify(files.cryptoNames)),
            fs.writeFile(CRYPTO_SYMBOL_FILE, JSON.stringify(files.cryptoSymbols)),
            fs.writeFile(FIAT_NAME_FILE, JSON.stringify(files.fiatNames)),
            fs.writeFile(FIAT_SYMBOL_FILE, JSON.stringify(files.fiatSymbols)),
            fs.writeFile(META_FILE, JSON.stringify(files.metadata))
        ]);

        if (files.metadata.length !== files.cryptoSymbols.length + files.fiatSymbols.length) {
            console.log('Error: The metadata file does not match the count of unique currencies');
        }
    }
};

(async function main() {
    try {
        await CurrencyData.getRawData();
        CurrencyData.transform();
        CurrencyData.curate();
        CurrencyData.sort();
        CurrencyData.deleteDuplicates();
        await CurrencyData.createFiles();

        console.log(`Metadata: ${CurrencyData.files.metadata.length}`);
        console.log(`Crypto symbols: ${CurrencyData.files.cryptoSymbols.length}`);
        console.log(`Crypto names: ${CurrencyData.files.cryptoNames.length}`);
        console.log(`Fiat symbols: ${CurrencyData.files.fiatSymbols.length}`);
        console.log(`Fiat names: ${CurrencyData.files.fiatNames.length}`);
    } catch (error) {
        console.log(error);
    }
}());

function cleanString(input, keepCase) {
    let output = input;
    if (typeof output !== 'string') output = '';
    return keepCase ? output.trim() : output.replace(/\s+/g, ' ').trim().toLowerCase();
}

function createMetadata(o) {
    const name = cleanString(o.name, true);
    const symbol = o.symbol ? cleanString(o.symbol, true) : cleanString(o.code);
    let display = `${name} (${symbol})`;
    if (name.length === 0 || symbol.length === 0) display = ''; // gets deleted later
    return { id: o.id, display };
}

function deleteBadData(data, checkBad) {
    for (let i = 0; i < data.length; i += 1) {
        if (checkBad(data[i])) {
            data.splice(i, 1);
            i -= 1;
        }
    }
}

function checkBadData(field) {
    return (o) => typeof o.id !== 'number' || o.id <= 0 || typeof o[field] !== 'string' || o[field].length === 0;
}

function checkBadRankData(field) {
    return (o) => typeof o.id !== 'number' || o.id <= 0 || typeof o[field] !== 'string' || o[field].length === 0
        || typeof o.rank !== 'number' || o.rank <= 0;
}

// data needs to be sorted first
function deleteDuplicateData(data, check) {
    for (let oldObj = {}, newObj = {}, i = 0; i < data.length; i += 1) {
        newObj = data[i];
        if (check(newObj, oldObj)) {
            data.splice(i, 1);
            i -= 1;
        }
        oldObj = newObj;
    }
}

function checkDuplicate(field) {
    return (a, b) => a[field] === b[field];
}
