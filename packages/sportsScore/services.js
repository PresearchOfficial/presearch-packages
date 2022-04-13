const sports = require("./sports.json");

/**
 * Parse input for this package
 * @param query
 * @return {{teamName: string}|undefined}
 */
function parseAndNormalize(query) {
  if (!query) {
    return undefined;
  }

  const teamName = normalize(query);

  if (!teamName) {
    return undefined;
  }

  return { teamName };
}

/**
 * Normalize input
 * @param input
 * @return {string|undefined}
 */
function normalize(input) {
  if (!input) {
    return undefined;
  }

  input = input.trim().toLowerCase();

  if (!input) {
    return undefined;
  }

  return input;
}

/**
 * String equality that normalizes the input in order to detect false-positives
 * @param {string} a
 * @param {string} b
 * @return {boolean}
 */
function stringEquals(a, b) {
  return normalize(a) === normalize(b);
}

function getTeamByName(teamName) {
  return sports
    .flatMap(league =>
      league.teams.flatMap(team => ({
        teamName: team.teamName,
        leagueName: league.leagueName
      }))
    )
    .find(team => stringEquals(team.teamName, teamName));
}

module.exports = {parseAndNormalize, getTeamByName};
