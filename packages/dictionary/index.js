'use strict';
const fetch = require('node-fetch');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: `${__dirname}/../../.env`});
}

async function dictionary(query) {
	try {
		const word = query.replace('define', '').trim();
		const result = await fetch(`https://owlbot.info/api/v2/dictionary/${word}?format=json`, { method: 'GET' })
			.then(res => res.json())

		if (result.length) {
			let definitions = [];
			result.map((item) => {
				if (definitions[item.type]) definitions[item.type].push(item);
				else definitions[item.type] = [item];
			});

			// Check if there's no definition
			if(definitions.undefined) {
				return `
				<div class="mainCol dictMainCol">
					<h3 class="dictWord"><span style="font-weight:normal">Sorry, no definition found for</span> ${word}</h3>
				</div>`
			}

			return `
				<div class="mainCol dictMainCol">
					<h2 class="dictWord">${word}</h2>
					${Object.keys(definitions).map((item, i) => (
						`<div key="${i}" class="dictDefContain">
							<h3 class="dictDefType">${item}</h3>
							<ol class="dictOL">
								${definitions[item].map((entry, idx) => (
									`<li key="${idx}">
										${entry.definition ? `<p class="dictDef">${entry.definition}</p>` : ``}
										${entry.example ? `<span class="dictDef"><i>examples </i>"${entry.example}"</span>` : ``}
									</li>`
								)).join('')}
							</ol>
						</div>`
					)).join('') || ``}
				</div>
				<style>
					.dictMainCol {
						padding: 0 15px 15px;
						box-sizing: border-box;
					}
					.dictWord {
						margin: 0px 0px 5px;
						font-size: 28px;
					}
					.dictDefContain {
						display: flex;
						flex-direction: column;
					}
					.dictDefType {
						font-size: 16px;
						font-weight: bold;
						margin: 15px 0 0;
					}
					.dictOL {
						margin-bottom: 0px;
						padding-left: 30px;
					}
					.dictOL > li {
						margin: 0 0 20px;
					}
					.dictDef {
						color: #333;
						margin: 3px 0;
					}
					.dictDef > i {
						color: #888;
						font-size: 14px;
					}
					.dictExample {
						color: #444;
						font-size: 14px;
					}
				</style>
			`;
		}
		throw Error('No definition found.');
	}
	catch (e) {
		console.error(e);
	}
}

async function trigger(query) {
	// split the query to trigger the package only when "define" is used
	query = query.split(' ');

	// return false when there's no other word 
	if (query.length === 1) return false;
	
	return query.includes('define') ? true : false;
}

module.exports = { dictionary, trigger };
