var axios = require('axios');
const fs = require('fs');

const headers = { 'x-rapidapi-key': '20335a832eedb54420e58e72280d7529', 'x-rapidapi-host': 'v3.football.api-sports.io' };
const season = 2022;

const portugueseLeagueId = 94;

async function getLeagues() {
    const url = `https://v3.football.api-sports.io/leagues?season=${season}`;

    const findLeaguesResponse = await Promise.resolve(
        axios.get(url, { headers }).catch(error => ({ error }))
    );
    const leaguesArray = findLeaguesResponse.data.response;

    //do some filtering excluding not current leagues and leagues doesnt have stadings data
    const leaguesArrayFilter = leaguesArray
        .filter(leagueResponse => leagueResponse.seasons[0].current && leagueResponse.seasons[0].coverage.standings)
        .map(leagueResponse => leagueResponse.league)
        .map(league => league.name)
        .reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;
          },[]);;

    // write JSON string to a file
    fs.writeFile('leagues.json', JSON.stringify(leaguesArrayFilter), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON leagues data is saved.");
    });
};

async function getTeams(leagueId) {
    const url = `https://v3.football.api-sports.io/teams?season=${season}&league=${leagueId}`;

    const findTeamsResponse = await Promise.resolve(
        axios.get(url, { headers }).catch(error => ({ error }))
    );
    const teamsArray = findTeamsResponse.data.response;

    const teamsFiler = teamsArray.map(teamResponse => teamResponse.team).map(team => team.name);

    // write JSON string to a file
    fs.writeFile('teams.json', JSON.stringify(teamsFiler), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON teams data is saved.");
    });
};


getLeagues();
getTeams(portugueseLeagueId);