var axios = require('axios');
const fs = require('fs');

const leagues = require('./leagues.json');
const logoUtils = require('./logoUtils');
const allLeagues = require('./allLeagues.json');
const logosPath = 'logos';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// INPUT SECTION TO CONTROL WHAT TO GET //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const season = 2022;
const API_KEY = '';

// in the allLeagues.json there is the ids of all the leagues
// just add more ids to the follow list to import leagues and teams of those leagues to be used in the package
// the leagues and teams will be saved in the leagues.json and teams.json
// const leaguesIdArray = [94, 39, 140, 2];
const leaguesIdArray = [94, 39, 140, 2, 5];
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
        var findLeague = allLeagues.find(l => l.league.id === leagueId);
        var league = findLeague.league;
        var country = findLeague.country.name;

        const logoName = "league_" + league.id + ".png";
        await logoUtils.downloadImage(league.logo, logoName);
        const newLeague = {
            id: league.id,
            name: league.name,
            country: country,
            logo: logosPath + "/" + logoName
        };

        allNewLeagues.push(newLeague)
    }

    if (allNewLeagues.length > 0) {
        const leaguesFile = fs.readFileSync('leagues.json', 'utf8');
        var leaguesJsonArray = JSON.parse(leaguesFile);
        Array.prototype.push.apply(leaguesJsonArray, allNewLeagues);
        const json = JSON.stringify(leaguesJsonArray);
        fs.writeFileSync('leagues.json', json, 'utf8');
        return allNewLeagues;
    }
    return '';
}

async function getTeams(newLeagues) {
    var allNewTeams = [];

    for (league of newLeagues) {
        const leagueId = league.id;

        const url = `https://v3.football.api-sports.io/teams?season=${season}&league=${leagueId}`;
        const findTeamsResponse = await Promise.resolve(
            axios.get(url, { headers }).catch(error => ({ error }))
        );
        const teamsArray = findTeamsResponse.data.response;
        const teamsFiler = teamsArray
            .map(teamResponse => teamResponse.team);

        for (team of teamsFiler) {
            const logoPath = await logoUtils.downloadNewLogo(team, "team");
            const processedTeam = {
                id: team.id,
                name: team.name,
                country: team.country,
                logo: logoPath,
                league: league.id,
                leagueCountry: league.country
            };
            allNewTeams.push(processedTeam);
        }
    };

    if (allNewTeams.length > 0) {
        const teamsFile = fs.readFileSync('teams.json', 'utf8');
        var teamsJsonArray = JSON.parse(teamsFile);
        Array.prototype.push.apply(teamsJsonArray, allNewTeams);
        var allTeamsWithoutDuplicates = deleteDuplicates(teamsJsonArray);
        const json = JSON.stringify(allTeamsWithoutDuplicates);
        fs.writeFileSync('teams.json', json, 'utf8');
    }
};

function deleteDuplicates(arrayInput){
    return arrayInput.reduce(function (array, element) {
        const foundElement = array.find(e => element.id === e.id);
        if(!foundElement){
            array.push(element);
        }
        if (foundElement 
            && foundElement.leagueCountry === 'World' 
            && element.leagueCountry !== 'World') {
                const index = array.findIndex(e => element.id === e.id);
                array.splice(index, 1, element);
        }
        return array;
    }, []);
}

async function getLeaguesAndTeams(){
    const newLeagues = await getLeagues();
    await getTeams(newLeagues);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////   MAIN    ///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (API_KEY === '') {
    const error = new Error('Please provide your API KEY');
    throw error;
}

if (deleteFilesAndGetEverything && fs.existsSync('leagues.json')) {
    fs.unlinkSync('leagues.json');
    fs.writeFileSync("leagues.json", "[]");
}
if (deleteFilesAndGetEverything && fs.existsSync('teams.json')) {
    fs.unlinkSync('teams.json');
    fs.writeFileSync("teams.json", "[]");
}

getLeaguesAndTeams();