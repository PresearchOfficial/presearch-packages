'use strict';
var axios = require('axios');
var fs = require('fs');

const teams = require('./teams.json');
const leagues = require('./leagues.json');
const logoUtils = require('./logoUtils');

const { style } = require('./style');
const { javascript } = require('./javascript');
const { htmlAllGames } = require('./htmlGame');
const { htmlAllStandings } = require('./htmlStandings');

var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
var objQuery = {};

const season = 2022;
const urlTeam = `https://v3.football.api-sports.io/teams`;
const urlLeague = `https://v3.football.api-sports.io/leagues`;
const urlFixtures = `https://v3.football.api-sports.io/fixtures?timezone=${timezone}&season=${season}`;
const urlStandings = `https://v3.football.api-sports.io/standings?season=${season}`;
const urlCurrentRound = `https://v3.football.api-sports.io/fixtures/rounds?season=${season}`;

const liveStatus = ['1H', 'HT', '2H', 'ET', 'P', 'BT', 'LIVE'];

const queryTypes = [
    { 'file': teams, 'type': 'team' },
    { 'file': leagues, 'type': 'league' }
];

function isLive(fixture) {
    return liveStatus.includes(fixture.status.short);
}

async function sports(query, API_KEY) {

    const found = queryTypes.some(q => {
        const foundObj = q.file.filter(item => item.name.toLowerCase() === query.toLowerCase());
        if (foundObj && foundObj.length == 1) {
            this.objQuery = foundObj[0];
            this.objQuery['type'] = q.type;
            return true;
        }
    });
    if (!found) return;

    var fixtures = [];
    const headers = { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' };

    //interceptor to catch error messages with 200 code status
    axios.interceptors.response.use(res => {
        if (Object.keys(res.data.errors).length !== 0) {
            const error = new Error(JSON.stringify(res.data.errors));
            error.path = res.request.path;
            throw error;
        }
        return res;
    });

    /////////////////////////////////////////////////////
    /////////////////// MOCK DATA  //////////////////////
    /////////////////////////////////////////////////////

    // const name = [{ "team": { "id": 211, "name": "Benfica", "code": "BEN", "country": "Portugal", "founded": 1904, "national": false, "logo": "https://media.api-sports.io/football/teams/211.png" } }];
    // const lastFixtures = [{ "fixture": { "id": 933173, "referee": "Felix Zwayer, Germany", "timezone": "Europe/London", "date": "2022-08-17T20:00:00+01:00", "timestamp": 1660762800, "periods": { "first": 1660762800, "second": 1660766400 }, "venue": { "id": 12602, "name": "Stadion Miejski LKS Lodz", "city": "Łódź" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "Play-offs" }, "teams": { "home": { "id": 572, "name": "Dynamo Kyiv", "logo": "https://media.api-sports.io/football/teams/572.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 0, "away": 2 }, "score": { "halftime": { "home": 0, "away": 2 }, "fulltime": { "home": 0, "away": 2 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898620, "referee": "Tiago Martins", "timezone": "Europe/London", "date": "2022-08-13T18:00:00+01:00", "timestamp": 1660410000, "periods": { "first": 1660410000, "second": 1660413600 }, "venue": { "id": 3514, "name": "Estádio Dr. Magalhães Pessoa", "city": "Leiria" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 2" }, "teams": { "home": { "id": 4716, "name": "Casa Pia", "logo": "https://media.api-sports.io/football/teams/4716.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 0, "away": 1 }, "score": { "halftime": { "home": 0, "away": 0 }, "fulltime": { "home": 0, "away": 1 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 923128, "referee": "Srdjan Jovanovic, Montenegro", "timezone": "Europe/London", "date": "2022-08-09T18:45:00+01:00", "timestamp": 1660067100, "periods": { "first": 1660067100, "second": 1660070700 }, "venue": { "id": 457, "name": "Cepheus Park Randers", "city": "Randers" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "3rd Qualifying Round" }, "teams": { "home": { "id": 397, "name": "FC Midtjylland", "logo": "https://media.api-sports.io/football/teams/397.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 1, "away": 3 }, "score": { "halftime": { "home": 0, "away": 1 }, "fulltime": { "home": 1, "away": 3 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }];
    // const nextFixtures = [{ "fixture": { "id": 933174, "referee": null, "timezone": "Europe/London", "date": "2022-08-23T20:00:00+01:00", "timestamp": 1661281200, "periods": { "first": null, "second": null }, "venue": { "id": null, "name": "Estádio do Sport Lisboa e Benfica", "city": "Lisboa" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "Play-offs" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null }, "away": { "id": 572, "name": "Dynamo Kyiv", "logo": "https://media.api-sports.io/football/teams/572.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898637, "referee": null, "timezone": "Europe/London", "date": "2022-08-27T18:00:00+01:00", "timestamp": 1661619600, "periods": { "first": null, "second": null }, "venue": { "id": 1267, "name": "Estádio do Bessa Século XXI", "city": "Porto" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 4" }, "teams": { "home": { "id": 222, "name": "Boavista", "logo": "https://media.api-sports.io/football/teams/222.png", "winner": null }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898630, "referee": null, "timezone": "Europe/London", "date": "2022-08-30T20:15:00+01:00", "timestamp": 1661886900, "periods": { "first": null, "second": null }, "venue": { "id": null, "name": "Estádio do Sport Lisboa e Benfica", "city": "Lisboa" }, "status": { "long": "Not Started", "short": "LIVE", "elapsed": null } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 3" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null }, "away": { "id": 234, "name": "Pacos Ferreira", "logo": "https://media.api-sports.io/football/teams/234.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }];
    // Array.prototype.push.apply(fixtures, lastFixtures);
    // Array.prototype.push.apply(fixtures, nextFixtures);
    // const standings = [];

    // var nameLabel = name[0].team.name;
    // var logo = name[0].team.logo;

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    try {
        if (this.objQuery.type === 'team') {
            const findNextFixtures = await axios.get(urlFixtures + `&team=${this.objQuery.id}&next=3`, { headers });
            Array.prototype.push.apply(fixtures, findNextFixtures.data.response);

            const findLastFixtures = await axios.get(urlFixtures + `&team=${this.objQuery.id}&last=3`, { headers });
            Array.prototype.push.apply(fixtures, findLastFixtures.data.response);

            const findStandingsLeague = await axios.get(urlStandings + `&team=${this.objQuery.id}`, { headers });
            const league = findStandingsLeague.data.response.filter(s => s.league.country === this.objQuery.country)[0];

            const findStandings = await axios.get(urlStandings + `&league=${league.league.id}`, { headers });
            var standings = findStandings.data.response[0].league.standings[0];
        }

        if (this.objQuery.type === 'league') {
            const findCurrentRound = await axios.get(urlCurrentRound + `&league=${this.objQuery.id}&current=true`, { headers });
            var currentRound = findCurrentRound.data.response[0];

            const findFixtures = await axios.get(urlFixtures + `&league=${this.objQuery.id}&round=${currentRound}`, { headers });
            Array.prototype.push.apply(fixtures, findFixtures.data.response);

            const findStandings = await axios.get(urlStandings + `&league=${this.objQuery.id}`, { headers });
            var standings = findStandings.data.response[0].league.standings[0];
        }

        var nameLabel = this.objQuery.name;
        var logo = this.objQuery.logo;

        const now = Math.floor(Date.now() / 1000);
        fixtures.sort(function (a, b) {
            return Math.abs(now - a.fixture.timestamp) - Math.abs(now - b.fixture.timestamp)
        });

        // match is live
        if (this.objQuery.type === 'team' && isLive(fixtures[0].fixture)) {
            const findLiveFixtures = await axios.get(urlFixtures + `&team=${this.objQuery.id}&live=all`, { headers });
            fixtures[0] = findLiveFixtures.data.response[0];

            // Mock data
            // const live = { "get": "fixtures", "parameters": { "season": "2022", "team": "211", "live": "all" }, "errors": [], "results": 1, "paging": { "current": 1, "total": 1 }, "response": [{ "fixture": { "id": 898630, "referee": "Artur Soares Dias, Portugal", "timezone": "UTC", "date": "2022-08-30T19:15:00+00:00", "timestamp": 1661886900, "periods": { "first": 1661886900, "second": null }, "venue": { "id": null, "name": "Estadio do Sport Lisboa e Benfica", "city": "Lisbon" }, "status": { "long": "First Half", "short": "1H", "elapsed": 44 } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https:\/\/media.api-sports.io\/football\/leagues\/94.png", "flag": "https:\/\/media.api-sports.io\/flags\/pt.svg", "season": 2022, "round": "Regular Season - 3" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https:\/\/media.api-sports.io\/football\/teams\/211.png", "winner": null }, "away": { "id": 234, "name": "Pacos Ferreira", "logo": "https:\/\/media.api-sports.io\/football\/teams\/234.png", "winner": null } }, "goals": { "home": 1, "away": 1 }, "score": { "halftime": { "home": 1, "away": 1 }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } }, "events": [{ "time": { "elapsed": 14, "extra": null }, "team": { "id": 234, "name": "Pacos Ferreira", "logo": "https:\/\/media.api-sports.io\/football\/teams\/234.png" }, "player": { "id": 129728, "name": "J. Holsgrove" }, "assist": { "id": null, "name": null }, "type": "Card", "detail": "Yellow Card", "comments": "Holding" }, { "time": { "elapsed": 16, "extra": null }, "team": { "id": 211, "name": "Benfica", "logo": "https:\/\/media.api-sports.io\/football\/teams\/211.png" }, "player": { "id": 573, "name": "Rafa Silva" }, "assist": { "id": null, "name": null }, "type": "Card", "detail": "Yellow Card", "comments": "Tripping" }, { "time": { "elapsed": 31, "extra": null }, "team": { "id": 211, "name": "Benfica", "logo": "https:\/\/media.api-sports.io\/football\/teams\/211.png" }, "player": { "id": 624, "name": "N. Otamendi" }, "assist": { "id": null, "name": null }, "type": "Var", "detail": "Goal Disallowed - offside", "comments": null }, { "time": { "elapsed": 35, "extra": null }, "team": { "id": 234, "name": "Pacos Ferreira", "logo": "https:\/\/media.api-sports.io\/football\/teams\/234.png" }, "player": { "id": 41490, "name": "Flavio" }, "assist": { "id": null, "name": null }, "type": "Card", "detail": "Yellow Card", "comments": "Foul" }, { "time": { "elapsed": 39, "extra": null }, "team": { "id": 234, "name": "Pacos Ferreira", "logo": "https:\/\/media.api-sports.io\/football\/teams\/234.png" }, "player": { "id": 174564, "name": "N. P. Koffi" }, "assist": { "id": 47255, "name": "V. Antunes" }, "type": "Goal", "detail": "Normal Goal", "comments": null }, { "time": { "elapsed": 42, "extra": null }, "team": { "id": 211, "name": "Benfica", "logo": "https:\/\/media.api-sports.io\/football\/teams\/211.png" }, "player": { "id": 552, "name": "D. Neres" }, "assist": { "id": 573, "name": "Rafa Silva" }, "type": "Goal", "detail": "Normal Goal", "comments": null }] }] };
            // fixtures[0] = live.response[0];
        }
    } catch (error) {
        var errorMessage = error.path ? 'Error calling endpoint ' + error.path + ' with message ' : '';
        errorMessage += error.message;
        console.log(errorMessage);
        return;
    }

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    return `
    <div id="presearchSportPackage">
        <div class="header">
            <div class="row">
                <g-img class="logo">
                    <img src="data:image/png;base64,${logoUtils.base64(__dirname + '/' + logo)}"
                        height="32" width="32" alt="">
                </g-img>
                <label class="subject">${nameLabel}</label>
            </div>
            <div class="tabs row">
                <div data-tab-value="#tab_1" class="tab tab-clicked">Games</div>
                <div data-tab-value="#tab_2" class="tab">Standings</div>
            </div>
        </div>
        <div id="tab_1" class="content active" data-tab-info>
            ${htmlAllGames(fixtures, this.objQuery.type)}
        </div>

        <div id="tab_2" class="content" data-tab-info>
            <div class="standingTable">
                <div class="row standingHeader" style="padding-bottom: 0.2rem;">
                    <div class="col"><label class="standingHeaderLabel">#</label></div>
                    <div class="col standingTeam"><label class="standingHeaderLabel">Team</label></div>
                    <div class="col"><label class="standingHeaderLabel">MP</label></div>
                    <div class="col"><label class="standingHeaderLabel">W</label></div>
                    <div class="col"><label class="standingHeaderLabel">D</label></div>
                    <div class="col"><label class="standingHeaderLabel">L</label></div>
                    <div class="col"><label class="standingHeaderLabel">Pts</label></div>
                </div>
                ${htmlAllStandings(standings)}
            </div>
        </div>
    </div>
    ` + style + javascript;
}

async function trigger(query) {
    if (!query) {
        return false;
    }

    return queryTypes.some(q => {
        const foundObj = q.file.filter(item => item.name.toLowerCase() === query.toLowerCase());
        return foundObj && foundObj.length === 1;
    });
}

module.exports = { sports, trigger };