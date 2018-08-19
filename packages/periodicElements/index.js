'use strict';
const pt = require('periodic-table');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

async function periodicElements(query) {
  const possibleElement = capitalize(query);
  if (possibleElement in pt.symbols) return pt.symbols[possibleElement];
}

async function trigger(query) {
  return query.match(/^\w{1,2}$/);
}

module.exports = { periodicElements, trigger };
