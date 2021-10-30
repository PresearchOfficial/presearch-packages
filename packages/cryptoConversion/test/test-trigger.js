'use strict';
const test = require('ava');
const {trigger} = require('../index.js');

test.todo('binary search');
test.todo('sort');

test('Trigger: test 1', async t => t.true(await trigger('btc to ltc')));
test('Trigger: test 2', async t => t.true(await trigger('5 btc to ltc')));