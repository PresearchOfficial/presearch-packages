'use strict';
const Dictionary = require("oxford-dictionary");
  
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: `${__dirname}/../../.env`});
}

async function dictionary(query) {
	try {
		const config = {
			app_id : process.env.OXFORD_APP_ID,
			app_key : process.env.OXFORD_APP_KEY,
			source_lang : "en"
		};
		const dict = new Dictionary(config);
		const line = query.replace('define', '').trim();
		let results;

		await dict.find(line).then(function(res) {
			results = JSON.parse(JSON.stringify(res, null, 4));
		}, 
		function(err) {
			console.log(err);
		});

		if (results) {
			const provider = results.metadata.provider;
			console.log(results.results)
			const data = results.results[0];
			const word = data.word;

			return `<div>${word} ${provider}</div>`;
		}
	}
	catch {

	}
}

async function trigger(query) {
	return query.includes('define') ? true : false;
}

module.exports = { dictionary, trigger };