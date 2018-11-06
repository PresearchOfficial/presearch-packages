'use strict';
const fetch = require('node-fetch');
  
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: `${__dirname}/../../.env`});
}

async function dictionary(query) {
	try {

		const word = query.replace('define', '').trim();
		const result = await fetch(`https://googledictionaryapi.eu-gb.mybluemix.net/?define=${word}`, { method: 'GET' })
			.then(res => res.json())
		
		const entries = result.meaning ? Object.keys(result.meaning) : [];

		return `
			<div class="mainCol dictMainCol">
				<h2 class="dictWord">${word}</h2>
				${result.phonetic ? `<span class="dictPhonetic">/${result.phonetic}/</span>` : ``}
				${entries.map((item, i) => (`
					<div class="dictDefContain" key="${i}">
						<span class="dictDefType">${item}</span>
						<ol class="dictOL">
							${result.meaning[item].map((point, idx) => (`
								<li key="${idx}">
									${point.definition 
										? `<span class="dictDef">
												${point.definition}
											</span>`
										: ``
									}
									${point.synonyms 
										? `<span class="dictSyn">
												<br>
												<i>synonyms</i>
												${point.synonyms.map((syn, index) => (`
													${syn}${index !== point.synonyms.length - 1 ? `,` : ``}
												`)).join('')}
											</span>`
										: ``
									}
									${point.example 
										? `<span class="dictExample">
												<br>
												"${point.example}"
											</span>`
										: ``
									}
								</li>
							`)).join('')}
						</ol>
					</div>
				`)).join('')}
			</div>
			<style>
				.definitionContain {
					display: flex;
					flex-flow: row nowrap;
					font-size: 14px;
				}
				.dictMainCol {
					padding: 0 15px 15px;
					box-sizing: border-box;
				}
				.dictWord {
					margin: 0px 0px 5px;
					font-size: 28px;
				}
				.dictPhonetic {
					font-size: 16px;
					color: #666
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
					margin-bottom: -10px;
				}
				.dictOL > li {
					margin-bottom: 10px;
				}
				.dictDef {
					color: #333;
				}
				.dictSyn {
					color: #444;
					font-size: 14px;
				}
				.dictSyn > i {
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
	catch (e) {
		console.error(e);
	}
}

async function trigger(query) {
	return query.includes('define') ? true : false;
}

module.exports = { dictionary, trigger };