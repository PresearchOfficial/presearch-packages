var axios = require('axios');
const fs = require('fs');

const logoUtils = require('./logoUtils');
const teams = require('./teams.json');
const leagues = require('./leagues.json');
const allLeagues = require('./allLeagues.json');

const season = 2022;
const logosPath = 'logos';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// INPUT SECTION TO CONTROL WHAT TO GET //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const API_KEY = '';

// in the allLeagues.json there is the ids of all the leagues
// just add more ids to the follow list to import leagues and teams of those leagues to be used in the package
// the leagues and teams will be saved in the leagues.json and teams.json
const leaguesIdArray = [94, 39, 140];
const deleteFilesAndGetEverything = false;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const headers = { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' };


async function getLeagues() {
    var allNewLeagues = [];

    for (leagueId of leaguesIdArray) {
        if (!deleteFilesAndGetEverything && leagues.find(l => l.id === leagueId)) {
            continue;
        }
        var league = allLeagues.find(l => l.league.id === leagueId).league;

        const logoName = "league_" + league.id + ".png";
        await logoUtils.downloadImage(league.logo, logoName);
        const newLeague = { id: league.id, name: league.name, logo: logosPath + "/" + logoName };

        allNewLeagues.push(newLeague)
    }

    if (allNewLeagues.length > 0) {
        const leaguesFile = fs.readFileSync('leagues.json', 'utf8');
        var leaguesJsonArray = JSON.parse(leaguesFile);
        Array.prototype.push.apply(leaguesJsonArray, allNewLeagues);
        const json = JSON.stringify(leaguesJsonArray);
        fs.writeFileSync('leagues.json', json, 'utf8');
    }
}

async function getTeams() {
    var allNewTeams = [];

    for (leagueId of leaguesIdArray) {
        if (!deleteFilesAndGetEverything && leagues.find(l => l.id === leagueId)) {
            continue;
        }

        const url = `https://v3.football.api-sports.io/teams?season=${season}&league=${leagueId}`;
        const findTeamsResponse = await Promise.resolve(
            axios.get(url, { headers }).catch(error => ({ error }))
        );
        const teamsArray = findTeamsResponse.data.response;
        const teamsFiler = teamsArray
            .map(teamResponse => teamResponse.team);

        for (team of teamsFiler) {
            const logoPath = await logoUtils.downloadNewLogo(team, "team");
            const processedTeam = { id: team.id, name: team.name, country: team.country, logo: logoPath };
            allNewTeams.push(processedTeam);
        }
    };

    allNewTeams.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
    }, []);

    if (allNewTeams.length > 0) {
        const teamsFile = fs.readFileSync('teams.json', 'utf8');
        var teamsJsonArray = JSON.parse(teamsFile);
        Array.prototype.push.apply(teamsJsonArray, allNewTeams);
        const json = JSON.stringify(teamsJsonArray);
        fs.writeFileSync('teams.json', json, 'utf8');
    }
};

if (deleteFilesAndGetEverything && fs.existsSync('leagues.json')) {
    fs.unlinkSync('leagues.json');
    fs.writeFileSync("leagues.json", "[]");
}
getLeagues();
if (deleteFilesAndGetEverything && fs.existsSync('teams.json')) {
    fs.unlinkSync('teams.json');
    fs.writeFileSync("teams.json", "[]");
}
getTeams();






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// this is deprecated. this function calls the API endpoint to get the league info
// we dont need because we have the allLeagues.json file
async function getLeagues_old() {
    var allLeagues = [];

    for (leagueId of leaguesIdArray) {
        if (!deleteFilesAndGetEverything && leagues.find(l => l.id === leagueId)) {
            continue;
        }

        const url = `https://v3.football.api-sports.io/leagues?season=${season}&id=${leagueId}`;
        const findLeaguesResponse = await Promise.resolve(
            axios.get(url, { headers }).catch(error => ({ error }))
        );
        const leaguesArray = findLeaguesResponse.data.response;

        //do some filtering excluding not current leagues and leagues doesnt have standings data
        const leaguesArrayFilter = leaguesArray
            .filter(leagueResponse => leagueResponse.seasons[0].current && leagueResponse.seasons[0].coverage.standings)
            .map(leagueResponse => leagueResponse.league);

        const logoName = "league_" + leaguesArrayFilter[0].id + ".png";
        await logoUtils.downloadImage(leaguesArrayFilter[0].logo, logoName);

        const leaguesArrayWithLocalLogo = leaguesArrayFilter
            .map(league => ({ id: league.id, name: league.name, logo: logosPath + "/" + logoName }));

        Array.prototype.push.apply(allLeagues, leaguesArrayWithLocalLogo);
    }

    if (allLeagues.length > 0) {
        const leaguesFile = fs.readFileSync('leagues.json', 'utf8');
        var leaguesJsonArray = JSON.parse(leaguesFile);
        Array.prototype.push.apply(leaguesJsonArray, allLeagues);
        const json = JSON.stringify(leaguesJsonArray);
        fs.writeFileSync('leagues.json', json, 'utf8');
    }
};