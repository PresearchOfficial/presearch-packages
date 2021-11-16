/* eslint-disable no-console */

'use strict';

const { performance } = require('perf_hooks');
// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('ava');
const { waitUntil } = require('async-wait-until');
const { trigger } = require('../index');
const {
    findCurrency, firstOccurrence, fieldCompare, files
} = require('../search-help');

const equate = (a, b) => a === b;

test('Trigger: test 1', async (t) => t.true(await trigger('btc to ltc')));
test('Trigger: test 2', async (t) => t.true(await trigger('5 btc to ltc')));
test('Trigger: test 3', async (t) => t.false(await trigger('pre')));
test('Trigger: test 4', async (t) => t.false(await trigger(' to ')));
test('Trigger: test 5', async (t) => t.false(await trigger('a to b')));
test('Trigger: test 6', async (t) => t.true(await trigger('  5   btc   to   ltc  ')));
test('Trigger: test 7', async (t) => t.true(await trigger('btc to btc')));
test('Trigger: test 8', async (t) => t.true(await trigger(' btc to btc ')));
test('Trigger: test 9', async (t) => t.false(await trigger('btc to 5 ltc')));
test('Trigger: test 10', async (t) => t.false(await trigger('5 btc to 5 ltc')));
test('Trigger: test 11', async (t) => t.true(await trigger('1.5 btc to pre')));
test('Trigger: test 12', async (t) => t.true(await trigger('1.5 BTC to PRE')));
test('Trigger: test 13', async (t) => t.true(await trigger('1.5 BTC  TO  PRE')));
test('Trigger: test 14', async (t) => t.true(await trigger('presearch to bitcoin')));
test('Trigger: test 15', async (t) => t.true(await trigger('presearch = bitcoin')));
test('Trigger: test 16', async (t) => t.true(await trigger('presearch to usd')));
test('Trigger: test 17', async (t) => t.true(await trigger('presearch to loonies')));
test('Trigger: test 18', async (t) => t.false(await trigger('-5 btc to ltc')));
test('Trigger: test 19', async (t) => t.true(await trigger('btc in ltc')));
test('Trigger: test 20', async (t) => t.true(await trigger('btc INTO ltc')));
test('Trigger: test 21', async (t) => t.false(await trigger('btc to = ltc')));
test('Trigger: test 22', async (t) => t.true(await trigger('1,000 eth to xau')));
test('Trigger: test 23', async (t) => t.true(await trigger('1,000 eth to silver metal')));
test('Trigger: test 24', async (t) => t.true(await trigger('1,000 eth to platinum')));
test('Trigger: test 25', async (t) => t.true(await trigger('palladium troy ounce to eth')));
test('Find currency: test 1', async (t) => {
    const currency = await findCurrency('btc');
    t.true(currency.found === true && currency.item.id === 1);
});
test('Find currency: test 2', async (t) => {
    const currency = await findCurrency('presearch');
    t.true(currency.found === true && currency.item.id === 2245);
});
test('Find currency: test rank as tie breaker for duplicate names', async (t) => {
    const currency = await findCurrency('bee');
    t.true(currency.found === true && currency.item.id === 13111);
});
test('Find currency: test priority of symbols over names', async (t) => {
    const currency = await findCurrency('ace');
    t.true(currency.found === true && currency.item.id === 9792);
});
test('Find currency: test priority of fiat symbols over crypto symbols', async (t) => {
    const currency = await findCurrency('all');
    t.true(currency.found === true && currency.item.id === 3526);
});
test('Find currency: test 3', async (t) => {
    const currency = await findCurrency('not a real currency');
    t.true(currency.found === false);
});
test('Find currency: missing metadata', async (t) => {
    await waitUntil(() => files.metadata !== undefined);
    // prep test by deleting XRP metadata
    const i = firstOccurrence(files.metadata, 52, fieldCompare('id'), equate);
    files.metadata.splice(i, 1);
    // it should find XRP symbol but still return not found because metadata is now missing
    const currency = await findCurrency('xrp');
    t.true(currency.found === false);
});
test.serial('Performance: test 1', async (t) => {
    performance.mark('start');
    await trigger('btc to ltc');
    performance.mark('end');
    performance.measure('test', 'start', 'end');
    const duration = performance.getEntriesByName('test')[0].duration.toFixed(2);
    console.log(`Find crypto symbol: ${duration} ms`);
    t.true(duration < 100);
});
test.serial('Performance: test 2', async (t) => {
    performance.mark('start2');
    await trigger('presearch to bee');
    performance.mark('end2');
    performance.measure('test2', 'start2', 'end2');
    const duration = performance.getEntriesByName('test2')[0].duration.toFixed(2);
    console.log(`Find crypto name: ${duration} ms`);
    t.true(duration < 100);
});
test.serial('Performance: test 3', async (t) => {
    performance.mark('start3');
    await trigger('btc to cad');
    performance.mark('end3');
    performance.measure('test3', 'start3', 'end3');
    const duration = performance.getEntriesByName('test3')[0].duration.toFixed(2);
    console.log(`Find fiat symbol: ${duration} ms`);
    t.true(duration < 100);
});
test.serial('Performance: test 4', async (t) => {
    performance.mark('start4');
    await trigger('btc to kiwi');
    performance.mark('end4');
    performance.measure('test4', 'start4', 'end4');
    const duration = performance.getEntriesByName('test4')[0].duration.toFixed(2);
    console.log(`Find fiat name: ${duration} ms`);
    t.true(duration < 100);
});
