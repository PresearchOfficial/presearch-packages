'use strict';

const {parseAndNormalize, getTeamByName, fetchGames} = require("./services");

async function sportsScore(query) {
  const team = parseAndNormalize(query);

  if (!team) {
    return undefined;
  }

  const games = await fetchGames(team.teamName);

  if (!games) {
    return undefined;
  }

  const stuff = games.map(game => `<span>${game.date}</span>`)
    .join("<br/>");

  return `<span>${stuff}</span>`;
}

function trigger(query) {
  const team = parseAndNormalize(query);

  if (!team) {
    return false;
  }

  return getTeamByName(team.teamName) !== undefined;
}

module.exports = {sportsScore, trigger};
