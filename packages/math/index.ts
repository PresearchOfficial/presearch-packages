"use strict";
const mathjs = require("mathjs");

async function math(query: string) {
  const data = mathjs.evaluate(query);

  return `
    <div class="mainCol mathContain">
      <p class="firstDigts">${query}</p>
      <h1>${typeof data === "number" ? data : ``}</h1>
      ${data && data.value ? `<h1>${data.value}</h1>` : ``}
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
// @ts-ignore
function trigger(query: string): boolean {
  const chars = new RegExp(/([a-zA-Z])+/g);

  if (chars.test(query)) return false; // Used to be: if (!isNaN(query) || chars.test(query)) return false;
  try {
    mathjs.evaluate(query);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { math, trigger };
