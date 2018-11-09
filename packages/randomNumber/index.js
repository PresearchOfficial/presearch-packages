'use strict';

async function randomNumber(query) {
	const rand = Math.round(Math.random() * 100);
	return `<h1>${rand}</h1>`;
}

async function trigger(query) {
	return query === 'random number' ? true : false;
}

module.exports = { randomNumber, trigger };