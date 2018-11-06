'use strict';

async function dictionary(query) {
	const word = query.replace('define', '').trim();
	const stuff = 'foo';
	return `<span>${word}</span>`;
}

async function trigger(query) {
	return query.includes('define') ? true : false;
}

module.exports = { dictionary, trigger };