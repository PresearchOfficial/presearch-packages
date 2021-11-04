'use strict';
const test = require('ava');
const {trigger} = require('../index.js');

test.todo('rank as tie breaker');
test.todo('priority of symbols over names');
test.todo('case sensitivity');
test.todo('variety of fiat/crypto conversions');
test.todo('concurrency');

test('Trigger: test 1', async t => t.true(await trigger('btc to ltc')));
test('Trigger: test 2', async t => t.true(await trigger('5 btc to ltc')));
test('Trigger: test 3', async t => t.false(await trigger('pre')));