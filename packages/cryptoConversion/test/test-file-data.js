'use strict';
const test = require('ava');
const fs = require('fs');

const loadFile = name => JSON.parse(fs.readFileSync(`${__dirname}/../data/${name}.json`, 'utf8'));
const files = {};
files.cryptoNames = loadFile('crypto_names');
files.cryptoSymbols = loadFile('crypto_symbols');
files.fiatNames = loadFile('fiat_names');
files.fiatSymbols = loadFile('fiat_symbols');
files.metadata = loadFile('currency_metadata');

const fieldCompare = field => (a,b) => a[field] < b[field];
const rankCompare = field => (a,b) => a[field] < b[field] || (a[field] === b[field] && a.rank < b.rank);

const testSort = (file, field, useRank) => {
    const length = file.length;
    const compare = useRank ? rankCompare(field) : fieldCompare(field);
    for(let oldObj = {}, newObj = {}, i = 0; i < length; i++) {
        newObj = file[i];
        if(i !== 0 && compare(newObj, oldObj)) {
            return false;
        }
        oldObj = newObj;
    }
    return true;
};

test.todo('binary search');
test.todo('test manual');

test('File: test 1', t => { Object.values(files).forEach(o => { t.true(o.length > 0); }); });
test('File: test 2', t => t.true(testSort(files.fiatNames, 'name')));
test('File: test 3', t => t.true(testSort(files.fiatSymbols, 'symbol')));
test('File: test 4', t => t.true(testSort(files.cryptoNames, 'name', true)));
test('File: test 5', t => t.true(testSort(files.cryptoSymbols, 'symbol', true)));
test('File: test 6', t => t.true(testSort(files.metadata, 'id')));
test('File: test 7', t => {
    for(let o of files.fiatNames) {
        t.false(!o.id || !o.name);
        t.true(typeof o.id === "number" && o.id > 0);
        t.true(typeof o.name === "string" && o.name.trim().length > 0);
    }
});
test('File: test 8', t => {
    for(let o of files.fiatSymbols) {
        t.false(!o.id || !o.symbol);
        t.true(typeof o.id === "number" && o.id > 0);
        t.true(typeof o.symbol === "string" && o.symbol.trim().length > 0);
    }
});
test('File: test 9', t => {
    for(let o of files.cryptoNames) {
        t.false(!o.id || !o.name || !o.rank);
        t.true(typeof o.id === "number" && o.id > 0);
        t.true(typeof o.name === "string" && o.name.trim().length > 0);
        t.true(typeof o.rank === "number" && o.rank > 0);
    }
});
test('File: test 10', t => {
    for(let o of files.cryptoSymbols) {
        t.false(!o.id || !o.symbol || !o.rank);
        t.true(typeof o.id === "number" && o.id > 0);
        t.true(typeof o.symbol === "string" && o.symbol.trim().length > 0);
        t.true(typeof o.rank === "number" && o.rank > 0);
    }
});
test('File: test 11', t => {
    for(let o of files.metadata) {
        t.false(!o.id || !o.display);
        t.true(typeof o.id === "number" && o.id > 0);
        t.true(typeof o.display === "string" && o.display.trim().length > 0);
    }
});