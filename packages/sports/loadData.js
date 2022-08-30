var axios = require('axios');
const fs = require('fs');

const API_KEY = '';
const headers = { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' };
const season = 2022;

// go here to add ids of leagues https://dashboard.api-football.com/soccer/ids
const leaguesIdArray = [94];

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
        .map(league => ({ id: league.id, name: league.name, logo: league.logo }));

    const leaguesArrayUnique = [...new Map(leaguesArrayFilter.map((v) => [v.id, v])).values()]
    // write JSON string to a file
    fs.appendFile('leagues.json', JSON.stringify(leaguesArrayUnique), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON leagues data is saved.");
    });
};

async function getTeams() {
    var allTeams = [];

    for (leagueId of leaguesIdArray) {
        const url = `https://v3.football.api-sports.io/teams?season=${season}&league=${leagueId}`;
        const findTeamsResponse = await Promise.resolve(
            axios.get(url, { headers }).catch(error => ({ error }))
        );
        const teamsArray = findTeamsResponse.data.response;
        const teamsFiler = teamsArray
            .map(teamResponse => teamResponse.team)
            .map(team => ({ id: team.id, name: team.name, country: team.country, logo: team.logo }));

        Array.prototype.push.apply(allTeams, teamsFiler);
    };

    allTeams.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
    }, []);

    // write JSON string to a file
    fs.appendFile('teams.json', JSON.stringify(allTeams), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON teams data is saved.");
    });
};

if (fs.existsSync('leagues.json')) {
    fs.unlinkSync('leagues.json');
}
getLeagues();
if (fs.existsSync('teams.json')) {
    fs.unlinkSync('teams.json');
}
getTeams();