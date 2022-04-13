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

  const stuff = games.map(game => `<li>
    <div id="homeTeam">
      <span class="teamName">${game.homeTeam}</span>
      <time>${game.date}</time>
      ${game.scoreHome && `<span class="score">${game.scoreHome}</span>`}
    </div>
    <div id="awayTeam">
      <span class="teamName">${game.awayTeam}</span>
      <time>${game.date}</time>
      ${game.scoreAway && `<span class="score">${game.scoreAway}</span>`}
    </div>
  </li>`).join("");

  return `<ul>${stuff}</ul>`;
}

function trigger(query) {
  const team = parseAndNormalize(query);

  if (!team) {
    return false;
  }

  return getTeamByName(team.teamName) !== undefined;
}

module.exports = {sportsScore, trigger};
