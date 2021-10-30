'use strict';
const test = require('ava');
const {fieldCompare} = require('../search-help.js');

test('Field compare: test 1', t => t.is(fieldCompare('a')({a: 'c'}, 'c'), 0));
test('Field compare: test 2', t => t.is(fieldCompare('a')({a: 'c'}, 'd'), -1));
test('Field compare: test 3', t => t.is(fieldCompare('a')({a: 'c'}, 'b'), 1));