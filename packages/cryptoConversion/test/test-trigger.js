'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('ava');
const { trigger } = require('../index');

test.todo('rank as tie breaker');
test.todo('priority of symbols over names');
test.todo('case sensitivity');
test.todo('variety of fiat/crypto conversions');
test.todo('concurrency');
test.todo('when it finds a currency but it is missing metadata');

test('Trigger: test 1', async (t) => t.true(await trigger('btc to ltc')));
test('Trigger: test 2', async (t) => t.true(await trigger('5 btc to ltc')));
test('Trigger: test 3', async (t) => t.false(await trigger('pre')));
test('Trigger: test 4', async (t) => t.false(await trigger(' to ')));
test('Trigger: test 5', async (t) => t.false(await trigger('a to b')));
test('Trigger: test 6', async (t) => t.true(await trigger('  5   btc   to   ltc  ')));
test('Trigger: test 7', async (t) => t.true(await trigger('btc to btc')));
