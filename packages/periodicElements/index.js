'use strict';
const pt = require('periodic-table');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function unCamelCase(string) {
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function(string){ return string.toUpperCase(); })
}

const fieldNames = ['atomicNumber','symbol','atomicMass','electronicConfiguration','standardState','groupBlock','yearDiscovered']

async function periodicElements(query) {
  let data = false;
  let filteredData;
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
    return { error: "Failed to generate the data." };
  }
}

// This line is for testing package with browserify bundle 
// window.periodic = periodicElements("H");

async function trigger(query) {
  return query.match(/^\w{1,2}$/);
}

module.exports = { periodicElements, trigger };
