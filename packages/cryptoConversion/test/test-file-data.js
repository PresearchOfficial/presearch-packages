'use strict';

const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('ava');
const { firstOccurrence, fieldCompare } = require('../search-help');

const loadFile = (name) => JSON.parse(fs.readFileSync(`${__dirname}/../data/${name}.json`, 'utf8'));
const files = {};
files.cryptoNames = loadFile('crypto_names');
files.cryptoSymbols = loadFile('crypto_symbols');
files.fiatNames = loadFile('fiat_names');
files.fiatSymbols = loadFile('fiat_symbols');
files.metadata = loadFile('currency_metadata');

const fieldTest = (field) => (a, b) => a[field] < b[field];
const rankTest = (field) => (a, b) => a[field] < b[field] || (a[field] === b[field] && a.rank < b.rank);
const numSearch = (num, search) => (num < search ? -1 : num > search ? 1 : 0);
const equate = (a, b) => a === b;

const testSort = (file, field, useRank) => {
    const { length } = file;
    const compare = useRank ? rankTest(field) : fieldTest(field);
    for (let oldObj = {}, newObj = {}, i = 0; i < length; i += 1) {
        newObj = file[i];
        if (i !== 0 && compare(newObj, oldObj)) {
            return false;
        }
        oldObj = newObj;
    }
    return true;
};

test('File: test 1', (t) => { Object.values(files).forEach((o) => { t.true(o.length > 0); }); });
test('File: test 2', (t) => t.true(testSort(files.fiatNames, 'name')));
test('File: test 3', (t) => t.true(testSort(files.fiatSymbols, 'symbol')));
test('File: test 4', (t) => t.true(testSort(files.cryptoNames, 'name', true)));
test('File: test 5', (t) => t.true(testSort(files.cryptoSymbols, 'symbol', true)));
test('File: test 6', (t) => t.true(testSort(files.metadata, 'id')));
test('File: test 7', (t) => {
    files.fiatNames.forEach((o) => {
        t.false(!o.id || !o.name);
        t.true(typeof o.id === 'number' && o.id > 0);
        t.true(typeof o.name === 'string' && o.name.length > 0);
    });
});
test('File: test 8', (t) => {
    files.fiatSymbols.forEach((o) => {
        t.false(!o.id || !o.symbol);
        t.true(typeof o.id === 'number' && o.id > 0);
        t.true(typeof o.symbol === 'string' && o.symbol.length > 0);
    });
});
test('File: test 9', (t) => {
    files.cryptoNames.forEach((o) => {
        t.false(!o.id || !o.name || !o.rank);
        t.true(typeof o.id === 'number' && o.id > 0);
        t.true(typeof o.name === 'string' && o.name.length > 0);
        t.true(typeof o.rank === 'number' && o.rank > 0);
    });
});
test('File: test 10', (t) => {
    files.cryptoSymbols.forEach((o) => {
        t.false(!o.id || !o.symbol || !o.rank);
        t.true(typeof o.id === 'number' && o.id > 0);
        t.true(typeof o.symbol === 'string' && o.symbol.length > 0);
        t.true(typeof o.rank === 'number' && o.rank > 0);
    });
});
test('File: test 11', (t) => {
    files.metadata.forEach((o) => {
        t.false(!o.id || !o.display);
        t.true(typeof o.id === 'number' && o.id > 0);
        t.true(typeof o.display === 'string' && o.display.length > 0);
    });
});
test('First occurrence: test 1', (t) => {
    const a = [1, 2, 3];
    t.is(firstOccurrence(a, 3, numSearch, equate), 2);
});
test('First occurrence: test 2', (t) => {
    const a = [3, 4, 5];
    t.is(firstOccurrence(a, 3, numSearch, equate), 0);
});
test('First occurrence: test 3', (t) => {
    const a = [3];
    t.is(firstOccurrence(a, 3, numSearch, equate), 0);
});
test('First occurrence: test 4', (t) => {
    const a = [3];
    t.is(firstOccurrence(a, 2, numSearch, equate), -1);
});
test('First occurrence: test 5', (t) => {
    const a = [];
    t.is(firstOccurrence(a, 2, numSearch, equate), -1);
});
test('First occurrence: test 6', (t) => {
    const a = [1, 2, 4];
    t.is(firstOccurrence(a, 3, numSearch, equate), -3);
});
test('First occurrence: test 7', (t) => {
    const a = [1, 2, 3];
    t.is(firstOccurrence(a, 4, numSearch, equate), -4);
});
test('First occurrence: test 8', (t) => {
    const a = [2, 3, 4];
    t.is(firstOccurrence(a, 1, numSearch, equate), -1);
});
test('First occurrence: test 9', (t) => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = 1; i <= a.length; i += 1) {
        t.is(firstOccurrence(a, i, numSearch, equate), i - 1);
    }
});
test('First occurrence: test 10', (t) => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 1; i <= a.length; i += 1) {
        t.is(firstOccurrence(a, i, numSearch, equate), i - 1);
    }
});
test('First occurrence: test 11', (t) => {
    const a = [1, 1, 3, 3, 3, 3, 7, 8, 9];
    t.is(firstOccurrence(a, 3, numSearch, equate), 2);
});
test('First occurrence: test 12', (t) => {
    const a = [1, 1, 3, 3, 3, 3, 7, 8, 9];
    t.is(firstOccurrence(a, 1, numSearch, equate), 0);
});
test('First occurrence: test 13', (t) => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9];
    t.is(firstOccurrence(a, 9, numSearch, equate), 8);
});
test('First occurrence: test 14', (t) => {
    const a = [1, 1, 1, 1, 1];
    t.is(firstOccurrence(a, 1, numSearch, equate), 0);
});
test('First occurrence: test 15', (t) => {
    const a = [1, 1, 1, 1, 1];
    t.is(firstOccurrence(a, 2, numSearch, equate), -6);
});
test('First occurrence: test 16', (t) => {
    const a = [1, 1, 1, 1, 1];
    t.is(firstOccurrence(a, 0, numSearch, equate), -1);
});
test('First occurrence: test 17', (t) => {
    t.is(files.cryptoNames[firstOccurrence(files.cryptoNames, 'presearch', fieldCompare('name'), equate)].id, 2245);
});
test('First occurrence: test 18', (t) => {
    t.is(files.cryptoSymbols[firstOccurrence(files.cryptoSymbols, 'pre', fieldCompare('symbol'), equate)].id, 2245);
});
test('First occurrence: test 19', (t) => {
    t.is(files.fiatSymbols[firstOccurrence(files.fiatSymbols, 'usd', fieldCompare('symbol'), equate)].id, 2781);
});
test('First occurrence: test 20', (t) => {
    t.is(files.fiatNames[firstOccurrence(files.fiatNames, 'dollar', fieldCompare('name'), equate)].id, 2781);
});
test('First occurrence: test 21', (t) => {
    t.is(files.fiatNames[firstOccurrence(files.fiatNames, 'united states dollar', fieldCompare('name'), equate)].id, 2781);
});
test('First occurrence: test 22', (t) => {
    t.is(files.fiatNames[firstOccurrence(files.fiatNames, 'usa currency', fieldCompare('name'), equate)].id, 2781);
});
test('First occurrence: test 23', (t) => {
    t.is(files.fiatNames[firstOccurrence(files.fiatNames, 'usd money', fieldCompare('name'), equate)].id, 2781);
});
test('First occurrence: test 24', (t) => {
    t.is(files.fiatNames[firstOccurrence(files.fiatNames, 'american buck', fieldCompare('name'), equate)].id, 2781);
});
