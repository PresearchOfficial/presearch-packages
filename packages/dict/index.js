'use strict';
const wn = require('wordnetjs');

// param: query
async function dict() {
  const query = 'define car';
  const word = query.replace('define', '');
  const data = wn.lookup(word.trim());
  const nounArr = data.filter(item => item.syntactic_category === 'Noun');
  const verbArr = data.filter(item => item.syntactic_category === 'Verb');
  const adjArr = data.filter(item => item.syntactic_category === 'Adjective');

  let nouns;
  if(nounArr.length > 0) {
    nouns = `
      <div>
        <p class="syntaxHeader">Noun</p>
        ${nounArr.length > 0 && nounArr.map((item, index) => (
          `<div key="${index}" class="definitionContain">
            <p class="definitionNum">${index + 1}.</p>
            <p class="definition">${item.description}</p>
          </div>`
        ))}
      </div>
    `;
  }

  let adjectives;
  if(adjArr.length > 0) {
    adjectives = `
      <div>
        <p class="syntaxHeader">Adjective</p>
        ${adjArr.length > 0 && adjArr.map((item, index) => (
          `<div key="${index}" class="definitionContain">
            <p class="definitionNum">${index + 1}.</p>
            <p class="definition">${item.description}</p>
          </div>`
        ))}
      </div>
    `;
  }

  let verbs;
  if(verbArr.length > 0) {
    verbs = `
      <div>
        <p class="syntaxHeader">Verb</p>
        ${verbArr.length > 0 && verbArr.map((item, index) => (
          `<div key="${index}" class="definitionContain">
            <p class="definitionNum">${index + 1}.</p>
            <p class="definition">${item.description}</p>
          </div>`
        ))}
      </div>
    `;
  }

  return `
    <div class="mainCol dictMainCol">
      <h2 class="dictWord">${word}</h2>
      ${nouns}
      ${adjectives}
      ${verbs}
    </div>
    <style>
      .definitionContain {
        display: flex;
        flex-flow: row nowrap;
        font-size: 14px;
      }
      .dictMainCol {
        padding: 0 15px;
        box-sizing: border-box;
      }
      .dictWord {
        margin: 0px 0px 5px;
        font-size: 28px;
      }
      .definitionNum {
        margin: 5px 10px;
      }
      .definition {
        margin: 5px 0;
      }
      .syntaxHeader {
        margin: 15px 0 10px;
        font-size: 14px;
      }
    </style>
  `;
}

// This line is for testing package with browserify bundle 
window.dict = dict("define cat");

async function trigger(query) {
  return query.includes('define');
}

module.exports = { dict, trigger };
