'use strict';
const fs = require('fs');
var axios = require('axios');
var path = require('path');

var queryType = '';
const season = 2022;
const urlTeam = `https://v3.football.api-sports.io/teams`;
const urlLeague = `https://v3.football.api-sports.io/leagues`;
const urlFixtures = `https://v3.football.api-sports.io/fixtures?timezone=Europe/London&season=${season}`;
const urlFixturesLive = `https://v3.football.api-sports.io/fixtures?timezone=Europe/London&season=${season}&live=all`;
const urlStandings = `https://v3.football.api-sports.io/standings?season=${season}`;

function getTime(timestamp) {
    const mili = timestamp * 1000;
    const date = new Date(mili);

    return date.toLocaleTimeString();
}

function getDate(timestamp) {
    const mili = timestamp * 1000;
    const date = new Date(mili);

    return date.toLocaleString("en-US", { weekday: "short" })
        + ", " + date.toLocaleString("en-US", { month: "short" })
        + " " + date.toLocaleString("en-US", { day: "numeric" });
}

function htmlGameSection(fixture, left) {
    return `
        <div class="game col ${left ? 'leftGame' : ''}">
            <div class="row" style="padding-bottom: 0.5rem;">
                <div class="col">
                    <label class="leagueLabel">${fixture.league.name}</label>
                </div>
            </div>
            <div class="row gameRow">
                <div class="col" style="flex: 1;">
                    <g-img class="logo">
                        <img src="${fixture.teams.home.logo}"
                            height="32" width="32" alt="">
                    </g-img>
                </div>
                <div class="col" style="flex: 2;">
                    <label>${fixture.teams.home.name}</label>
                </div>
                <div class="col score" style="flex: 1;">
                    <label>${fixture.teams.home.winner ? "&#9654;" : ""} ${fixture.goals.home != null ? fixture.goals.home : ""}</label>
                </div>
            </div>
            <div class="row gameRow">
                <div class="col" style="flex: 1;">
                    <g-img class="logo">
                        <img src="${fixture.teams.away.logo}"
                            height="32" width="32" alt="">
                    </g-img>
                </div>
                <div class="col" style="flex: 2;">
                    <label>${fixture.teams.away.name}</label>
                </div>
                <div class="col score" style="flex: 1;">
                    <label>${fixture.teams.away.winner ? "&#9654;" : ""} ${fixture.goals.away != null ? fixture.goals.away : ""}</label>
                </div>
            </div>
        </div>
        <div class="col gameDate">
            <div><label>${getDate(fixture.fixture.timestamp)}</label></div>
            <div><label>${fixture.fixture.status.short === "FT" ? "FT" : getTime(fixture.fixture.timestamp)}</label></div>
        </div>
    `;
}

function htmlStandings(standing, i) {
    return `
        <div class="row" style="padding-top: 0.5rem;">
            <div class="col">${i}</div>
            <div class="col standingTeam">
                <div class="row">
                    <div class="col" style="flex: 1;">
                        <g-img class="logo">
                            <img src="${standing.team.logo}" height="32" width="32" alt="">
                        </g-img>
                    </div>
                    <div class="col" style="flex: 4;">
                        <label>${standing.team.name}</label>
                    </div>
                </div>
            </div>
            <div class="col">${standing.all.played}</div>
            <div class="col">${standing.all.win}</div>
            <div class="col">${standing.all.draw}</div>
            <div class="col">${standing.all.lose}</div>
            <div class="col">${standing.points}</div>
        </div>
    `;
}

function htmlAllStandings(standings) {
    if(!standings){
        return '';
    }
    var html = '';
    for (let i = 0; i < standings.length; i++) {
        html = html + htmlStandings(standings[i], i + 1);
    }
    return html;
}

async function sports(query, API_KEY) {
    if (this.queryType === ''){
        return;
    }
    //  const name = [{ "team": { "id": 211, "name": "Benfica", "code": "BEN", "country": "Portugal", "founded": 1904, "national": false, "logo": "https://media.api-sports.io/football/teams/211.png" } }];
    //  const lastFixtures = [{ "fixture": { "id": 933173, "referee": "Felix Zwayer, Germany", "timezone": "Europe/London", "date": "2022-08-17T20:00:00+01:00", "timestamp": 1660762800, "periods": { "first": 1660762800, "second": 1660766400 }, "venue": { "id": 12602, "name": "Stadion Miejski LKS Lodz", "city": "Łódź" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "Play-offs" }, "teams": { "home": { "id": 572, "name": "Dynamo Kyiv", "logo": "https://media.api-sports.io/football/teams/572.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 0, "away": 2 }, "score": { "halftime": { "home": 0, "away": 2 }, "fulltime": { "home": 0, "away": 2 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898620, "referee": "Tiago Martins", "timezone": "Europe/London", "date": "2022-08-13T18:00:00+01:00", "timestamp": 1660410000, "periods": { "first": 1660410000, "second": 1660413600 }, "venue": { "id": 3514, "name": "Estádio Dr. Magalhães Pessoa", "city": "Leiria" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 2" }, "teams": { "home": { "id": 4716, "name": "Casa Pia", "logo": "https://media.api-sports.io/football/teams/4716.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 0, "away": 1 }, "score": { "halftime": { "home": 0, "away": 0 }, "fulltime": { "home": 0, "away": 1 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 923128, "referee": "Srdjan Jovanovic, Montenegro", "timezone": "Europe/London", "date": "2022-08-09T18:45:00+01:00", "timestamp": 1660067100, "periods": { "first": 1660067100, "second": 1660070700 }, "venue": { "id": 457, "name": "Cepheus Park Randers", "city": "Randers" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "3rd Qualifying Round" }, "teams": { "home": { "id": 397, "name": "FC Midtjylland", "logo": "https://media.api-sports.io/football/teams/397.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 1, "away": 3 }, "score": { "halftime": { "home": 0, "away": 1 }, "fulltime": { "home": 1, "away": 3 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }];
    //  const nextFixtures = [{ "fixture": { "id": 933174, "referee": null, "timezone": "Europe/London", "date": "2022-08-23T20:00:00+01:00", "timestamp": 1661281200, "periods": { "first": null, "second": null }, "venue": { "id": null, "name": "Estádio do Sport Lisboa e Benfica", "city": "Lisboa" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "Play-offs" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null }, "away": { "id": 572, "name": "Dynamo Kyiv", "logo": "https://media.api-sports.io/football/teams/572.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898637, "referee": null, "timezone": "Europe/London", "date": "2022-08-27T18:00:00+01:00", "timestamp": 1661619600, "periods": { "first": null, "second": null }, "venue": { "id": 1267, "name": "Estádio do Bessa Século XXI", "city": "Porto" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 4" }, "teams": { "home": { "id": 222, "name": "Boavista", "logo": "https://media.api-sports.io/football/teams/222.png", "winner": null }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898630, "referee": null, "timezone": "Europe/London", "date": "2022-08-30T20:15:00+01:00", "timestamp": 1661886900, "periods": { "first": null, "second": null }, "venue": { "id": null, "name": "Estádio do Sport Lisboa e Benfica", "city": "Lisboa" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 3" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null }, "away": { "id": 234, "name": "Pacos Ferreira", "logo": "https://media.api-sports.io/football/teams/234.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }];
    //  const standings = [];

    // var nameLabel = name[0].team.name;
    // var logo = name[0].team.logo;

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    const headers = { 'x-rapidapi-key': '20335a832eedb54420e58e72280d7529', 'x-rapidapi-host': 'v3.football.api-sports.io' };

    if (this.queryType === 'team') {
        const findTeamResponse = await Promise.all([
            axios.get(urlTeam + `?search=${query}`, { headers }).catch(error => ({ error }))
        ]);

        var name = findTeamResponse[0].data.response;
        if (name.length > 1) {
            name = name.filter(t => t.team.name.toLowerCase() === query.toLowerCase())[0]
        }
        if (!name || name.length == 0) return null;

        const findNextFixtures = await Promise.all([
            axios.get(urlFixtures + `&team=${name.team.id}&next=3`, { headers }).catch(error => ({ error }))
        ]);
        var nextFixtures = findNextFixtures[0].data.response;

        const findLastFixtures = await Promise.all([
            axios.get(urlFixtures + `&team=${name.team.id}&last=3`, { headers }).catch(error => ({ error }))
        ]);
        var lastFixtures = findLastFixtures[0].data.response;

        const findStandingsLeague = await Promise.all([
            axios.get(urlStandings + `&team=${name.team.id}`, { headers }).catch(error => ({ error }))
        ]);
        const league = findStandingsLeague[0].data.response[0].league;

        const findStandings = await Promise.all([
            axios.get(urlStandings + `&league=${league.id}`, { headers }).catch(error => ({ error }))
        ]);
        var standings = findStandings[0].data.response[0].league.standings[0];

        var nameLabel = name.team.name;
        var logo = name.team.logo;
    }

    if(this.queryType === 'league'){
        const findLeagueResponse = await Promise.all([
            axios.get(urlLeague + `?search=${query}`, { headers }).catch(error => ({ error }))
        ]);

        var name = findLeagueResponse[0].data.response;
        if (!name || name.length == 0) return null;

        if (name.length > 1) {
            name = name[0];
        }

        const findNextFixtures = await Promise.all([
            axios.get(urlFixtures + `&league=${name.league.id}&next=3`, { headers }).catch(error => ({ error }))
        ]);
        var nextFixtures = findNextFixtures[0].data.response;

        const findLastFixtures = await Promise.all([
            axios.get(urlFixtures + `&league=${name.league.id}&last=3`, { headers }).catch(error => ({ error }))
        ]);
        var lastFixtures = findLastFixtures[0].data.response;

        const findStandings = await Promise.all([
            axios.get(urlStandings + `&league=${name.league.id}`, { headers }).catch(error => ({ error }))
        ]);
        var standings = findStandings[0].data.response[0].league.standings[0];

        var nameLabel = name.league.name;
        var logo = name.league.logo;
    }
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    return `
    <div id="presearchSportPackage">
        <div class="header">
            <g-img class="logo">
                <img src="${logo}"
                    height="32" width="32" alt="">
            </g-img>
            <label class="subject">${nameLabel}</label>

            <div class="tabs">
                <div data-tab-value="#tab_1" class="tab">Games</div>
                <div data-tab-value="#tab_2" class="tab">Standings</div>
            </div>
        </div>
        <div id="tab_1" class="content active" data-tab-info>
            <div class="games row">
                ${htmlGameSection(lastFixtures[0], false)}
                ${htmlGameSection(nextFixtures[0], true)}
            </div>
            <div class="games row">
                ${htmlGameSection(lastFixtures[1], false)}
                ${htmlGameSection(nextFixtures[1], true)}
            </div>
            <div class="games row">
                ${htmlGameSection(lastFixtures[2], false)}
                ${htmlGameSection(nextFixtures[2], true)}
            </div>
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




    <!-- example styles - remember to use #presearchSportPackage before each class -->
    <style>
        #presearchSportPackage {
            max-width: 36rem;
            font-size: 0.6rem;
        }

        .dark #presearchSportPackage {
            color: #ffffff;
        }

        #presearchSportPackage .header {
            background: linear-gradient(273deg, rgba(0,121,255,1) 0%, rgba(82,135,255,1) 16%, rgba(116,232,255,1) 100%);
            padding-left: 5%;
            padding-top: 3%;
            border-top-left-radius: 30px;
            border-top-right-radius: 30px;
        }

        #presearchSportPackage .subject {
            font-weight: bold;
            font-size: 2rem;
            color: #000000;
        }

        #presearchSportPackage .logo {
            margin-right: 2%;
            float: left;
        }

        #presearchSportPackage .tabs {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            flex-direction: row;
            padding-top: 1rem;
        }

        #presearchSportPackage .tab {
            flex: 0.2;
            line-height: 2.75em;
            height: 3em;
            padding: 0 1.618em;
            background: rgba(116,232,255,0.2);
            border: 0.025rem solid rgba(9,9,121,0.2);
            cursor: pointer;
            top: 0;
            transition: all 0.25s;
            text-align: center;
            color: #000000;
            font-size: 0.8rem;
            font-weight: 900;
        }

        #presearchSportPackage .tab:hover {
            background-color: rgba(9,9,121,0.2);
        }

        #presearchSportPackage .leagueLabel {
            color: #bdc3c7;
        }

        #presearchSportPackage .content {}

        #presearchSportPackage .games {
            display: flex;
            border: 0.25rem solid #bdc3c7;
        }

        .dark #presearchSportPackage .games {
            display: flex;
            border: 0.25rem solid #7F7F7F;
        }

        #presearchSportPackage .game {
            float: left;
            padding: 1vw;
        }

        #presearchSportPackage .row {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
        }

        #presearchSportPackage .col {
            display: flex;
            flex-direction: column;
            flex-basis: 100%;
            flex: 1;
        }

        #presearchSportPackage .score {
            align-items: end;
        }

        #presearchSportPackage .gameDate {
            flex: 0.4;
            padding-right: 1vw;
            font-size: 0.6rem;
            text-align: center;
        }

        #presearchSportPackage .gameRow {
            border-right: 0.15rem solid #bdc3c7;
            padding-right: 0.6rem;
        }

        #presearchSportPackage .leftGame {
            border-left: 0.25rem solid #bdc3c7;
        }

        .dark #presearchSportPackage .leftGame {
            border-left: 0.25rem solid #7F7F7F;
        }

        #presearchSportPackage [data-tab-info] {
            display: none;
        }

        #presearchSportPackage .active[data-tab-info] {
            display: block;
        }

        #presearchSportPackage .standingTable {
            padding: 1vw;
            border: 0.25rem solid #bdc3c7;
        }

        #presearchSportPackage .standingHeader {
            border-bottom: 0.15rem solid #bdc3c7;
        }

        #presearchSportPackage .standingHeaderLabel {
            font-weight: bold;
            font-size: 1.2rem;
        }

        #presearchSportPackage .standingTeam {
            flex: 3;
        }
    </style>
    <!-- example javascript -->
    <script>
        const tabs = document.querySelectorAll('[data-tab-value]');
        const tabInfos = document.querySelectorAll('[data-tab-info]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = document
                    .querySelector(tab.dataset.tabValue);

                tabInfos.forEach(tabInfo => {
                    tabInfo.classList.remove('active')
                })
                target.classList.add('active');
            })
        })
    </script>
	`;
}


async function trigger(query) {
    if (!query) {
        return false;
    }

    const teamsFile = fs.readFileSync(__dirname + '/teams.json', 'utf8');
    const teams = JSON.parse(teamsFile.toString());
    const team = teams.filter(team => team.toLowerCase() === query.toLowerCase());

    if (team && team.length == 1) {
        this.queryType = 'team';
        return true;
    }
    //searh for league
    const leagueFile = fs.readFileSync(__dirname + '/leagues.json', 'utf8');
    const leagues = JSON.parse(leagueFile.toString());
    const league = leagues.filter(league => league.toLowerCase() === query.toLowerCase());

    if (league && league.length == 1) {
        this.queryType = 'league';
        return true;
    }
    return false;
}

module.exports = { sports, trigger, queryType };