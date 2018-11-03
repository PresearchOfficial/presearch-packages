'use strict';
const mathjs = require('mathjs');

async function math(query) {
  const data = mathjs.eval(query);

  return `
    <div class="mainCol mathContain">
      <p>${query}</p>
      <h1>${typeof data === 'number' && data}</h1>
      ${(data && data.value) ? `<h1>${data.value}</h1>` : ``}
    </div>
    <style>
      .mathContain {
        padding: 0 15px;
        box-sizing: border-box;
      }
    </style>
  `;
}

// This line is for testing package with browserify bundle 
// window.math = math("2 + 2");

async function trigger(query) {
  try {
    mathjs.eval(query);
    return true;
  }
  catch (error) {
    return false;
  }
}

module.exports = { math, trigger };
