"use strict";
const mathjs = require("mathjs");

async function math(query) {
  const data = mathjs.evaluate(query);

  return `
    <div class="mainCol mathContain">
      <p class="firstDigts">${query}</p>
      <h1>${typeof data === "number" ? data.toFixed(2): ``}</h1>
      ${data && data.value ? `<h1>${data.value.toFixed(2)}</h1>` : ``}
    </div>
    <style>
      .dark .mathContain {
        color:#d1d5db;
      }
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
  const chars = new RegExp(/([a-zA-Z])+/g);
  if (!isNaN(query) || chars.test(query)) return false;
  try {
    mathjs.evaluate(query);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { math, trigger };
