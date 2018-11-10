'use strict';

async function randomNumber(query) {
	const rand = Math.round(Math.random() * 100);
	return `<span>${rand}</span>`;
}

async function trigger(query) {
	return query === 'random number' ? true : false;
}

module.exports = { randomNumber, trigger };