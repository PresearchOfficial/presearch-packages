'use strict';

const {parseAndNormalize, getTeamByName} = require("./services");

async function sportsScore(query) {
	const stuff = 'foo';
	return `<span>Some markup</span>`;
}

function trigger(query) {
	const team = parseAndNormalize(query);

  if (!team) {
    return false;
  }

  return getTeamByName(team.teamName) !== undefined;
}

module.exports = { sportsScore, trigger };
