'use strict';
const mathsteps = require('mathsteps');

async function mathSteps(query) {
  let result;
  let expression = query.replace(/^(simplify|solve)/, '');
  if (query.match(/^simplify/)) {
    result = mathsteps.simplifyExpression(expression);
  }
  else {
    result = mathsteps.solveEquation(expression);
  }
  return result && result.length > 1 ? result : null;
}

async function trigger(query) {
  return query.match(/^(simplify|solve)/);
}

module.exports = { mathSteps, trigger };
