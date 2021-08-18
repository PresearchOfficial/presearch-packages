'use strict';
const pt = require('periodic-table');

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function unCamelCase(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function(str: string){ return str.toUpperCase(); })
}

const fieldNames = ['atomicNumber','symbol','atomicMass','electronicConfiguration','standardState','groupBlock','yearDiscovered']

async function periodicElements(query) {
  let data: { name: string };
  let filteredData: string[];
  const possibleElement = capitalize(query);
  if (possibleElement in pt.symbols) data = pt.symbols[possibleElement];
  if (data) {
    filteredData = Object.keys(data).filter((item) => fieldNames.includes(item));
    return `
      <div class="mainCol elementContain">
        <h1>${data.name ? data.name : ``}</h1>
        ${filteredData.map((key, index) => (
          `<p key="${index}"><strong>${unCamelCase(key)}:</strong> ${data[key]}</p>`
        )).join('')}
      </div>
      <style>
        .elementContain {
          padding: 0 15px;
          box-sizing: border-box;
        }
        .dark .elementContain {
          color: #d1d5db;
        }
        .dark strong {
          font-weight: 500;
        }
      </style>
    `;
  }
  else {
    return ``;
  }
}

// This line is for testing package with browserify bundle
// window.periodic = periodicElements("H");

// @ts-ignore
function trigger(query: string): boolean {
  return !!query.match(/^\w{1,2}$/);
}

module.exports = { periodicElements, trigger };
