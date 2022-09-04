'use strict';
var axios = require('axios');
var fs = require('fs');

const teams = require('./teams.json');
const leagues = require('./leagues.json');
const logoUtils = require('./logoUtils')

var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
var objQuery = {};

const season = 2022;
const urlTeam = `https://v3.football.api-sports.io/teams`;
const urlLeague = `https://v3.football.api-sports.io/leagues`;
const urlFixtures = `https://v3.football.api-sports.io/fixtures?timezone=${timezone}&season=${season}`;
const urlStandings = `https://v3.football.api-sports.io/standings?season=${season}`;
const urlCurrentRound = `https://v3.football.api-sports.io/fixtures/rounds?season=${season}`;

const liveStatus = ['1H', 'HT', '2H', 'ET', 'P', 'BT', 'LIVE'];
const liveStatusOnGoing = ['1H', '2H', 'ET', 'LIVE'];

function getTime(timestamp) {
    const mili = timestamp * 1000;
    const date = new Date(mili);

    return date.toLocaleTimeString();
}

function getDate(timestamp) {
    const mili = timestamp * 1000;
    const date = new Date(mili);

    if (isDateCloseOrEqualToday(date, 0)) {
        return 'Today';
    }
    if (isDateCloseOrEqualToday(date, 1)) {
        return 'Tomorrow';
    }
    if (isDateCloseOrEqualToday(date, -1)) {
        return 'Yesterday';
    }

    return date.toLocaleString("en-US", { weekday: "short" })
        + ", " + date.toLocaleString("en-US", { month: "short" })
        + " " + date.toLocaleString("en-US", { day: "numeric" });
}

function isDateCloseOrEqualToday(date, nDays) {
    const dateToCompare = new Date();
    dateToCompare.setDate(dateToCompare.getDate() + nDays);

    return date.getDate() == dateToCompare.getDate() &&
        date.getMonth() == dateToCompare.getMonth() &&
        date.getFullYear() == dateToCompare.getFullYear();
}

function htmlGameSection(fixture, right) {
    return `
        <div class="game col ${right ? 'rightGame' : ''}">
            <div class="row" style="padding-bottom: 0.5rem;">
                <div class="col">
                    <label class="leagueLabel">${fixture.league.name}</label>
                </div>
            </div>
            <div class="row gameRow">
                <div class="col" style="flex: 1;">
                    <g-img class="logo">
                        <img src="data:image/png;base64,${logoUtils.getLogo(fixture.teams.home)}"
                            height="32" width="32" alt="">
                    </g-img>
                </div>
                <div class="col" style="flex: 3;">
                    <label>${fixture.teams.home.name}</label>
                </div>
                <div class="col score" style="flex: 1;">
                    <label>${fixture.teams.home.winner ? "&#9654;" : ""}${fixture.goals.home != null ? fixture.goals.home : ""}</label>
                </div>
            </div>
            <div class="row gameRow">
                <div class="col" style="flex: 1;">
                    <g-img class="logo">
                        <img src="data:image/png;base64,${logoUtils.getLogo(fixture.teams.away)}"
                            height="32" width="32" alt="">
                    </g-img>
                </div>
                <div class="col" style="flex: 3;">
                    <label>${fixture.teams.away.name}</label>
                </div>
                <div class="col score" style="flex: 1;">
                    <label>${fixture.teams.away.winner ? "&#9654;" : ""}${fixture.goals.away != null ? fixture.goals.away : ""}</label>
                </div>
            </div>
        </div>
        <div class="col gameDate">
            <div><label>${liveStatusOnGoing.includes(fixture.fixture.status.short)
            ? fixture.fixture.status.short
            : getDate(fixture.fixture.timestamp)}</label></div>
            <div><label>${fixture.fixture.status.short === "NS"
            ? getTime(fixture.fixture.timestamp)
            : liveStatusOnGoing.includes(fixture.fixture.status.short)
                ? fixture.fixture.status.elapsed + '\''
                : fixture.fixture.status.short}</label></div>
        </div>
    `;
}

function htmlGameRow(fixtureLeft, fixtureRight) {
    var html = '';

    html += '<div class="games row">';
    html += htmlGameSection(fixtureLeft, false);
    html += htmlGameSection(fixtureRight, true);
    html += '</div>';

    return html;
}

function htmlClosestGameSection(fixture) {
    var goalEvents = [];
    if (fixture.events) {
        goalEvents = fixture.events.filter(event => event.type === "Goal")
            .sort(function (a, b) { return a.time.elapsed - b.time.elapsed });
    }

    return `
        <div class="games liveGame">
            <div class="col">
                <div class="row" style="padding-bottom: 1rem;">
                    <div style="flex: 1;">
                        <label class="leagueLabel">
                                ${fixture.league.name} 
                                ${liveStatusOnGoing.includes(fixture.fixture.status.short)
            ? '' : ' - ' + getDate(fixture.fixture.timestamp) + ', ' + getTime(fixture.fixture.timestamp)}
                    </div>
                    <div style="flex: 1;text-align: end;">
                        <label>${liveStatusOnGoing.includes(fixture.fixture.status.short)
            ? fixture.fixture.status.elapsed + '\''
            : fixture.fixture.status.long}</label>
                    </div>
                </div>
                <div class="row" style="text-align: -webkit-center;">
                    <div class="col">
                        <g-img class="logo">
                        <img src="data:image/png;base64,${logoUtils.getLogo(fixture.teams.home)}"
                            height="32" width="32" alt="">
                        </g-img>
                    </div>
                    <div class="col">
                        <label class="gameLiveScore">${fixture.goals.home ? fixture.goals.home : ''}</label>
                    </div>
                    <div class="col">
                        <label class="gameLiveScore">-</label>
                    </div>
                    <div class="col">
                        <label class="gameLiveScore">${fixture.goals.away ? fixture.goals.away : ''}</label>
                    </div>
                    <div class="col">
                        <g-img class="logo">
                        <img src="data:image/png;base64,${logoUtils.getLogo(fixture.teams.away)}"
                            height="32" width="32" alt="">
                        </g-img>
                    </div>
                </div>
                <div class="row" style="text-align: -webkit-center; padding-top: 0.2rem;">
                    <div class="col">
                        <label>${fixture.teams.home.name}</label>
                    </div>
                    <div class="col">
                    </div>
                    <div class="col">
                    </div>
                    <div class="col">
                    </div>
                    <div class="col">
                        <label>${fixture.teams.away.name}</label>
                    </div>
                </div>
                ${htmlGoalEvent(goalEvents, fixture)}
            </div>
        </div>
    `;
}

function htmlGoalEvent(goalEvents, fixture) {
    var html = '';
    goalEvents.forEach(goalEvent => {
        const css = goalEvent.team.id === fixture.teams.home.id
            ? 'text-align: start; padding-left: 0.5rem;'
            : 'text-align: end; padding-right: 0.5rem;';

        html +=
            `<div class="row" style="padding-top: 0.2rem;">
                <div class="col goal" style="${css}">
                    <label class="leagueLabel">${goalEvent.player.name} ${goalEvent.time.elapsed}'</label>
                </div>
            </div>`
    });
    return html;
}

function htmlAllGamesLeague(fixtures) {
    var html = '';

    var count = 0;
    while (count < 6) {
        html += htmlGameRow(fixtures[count++], fixtures[count++]);
    }

    return html;
}

function htmlAllGamesTeam(fixtures) {
    var html = '';
    html += htmlClosestGameSection(fixtures[0]);

    var count = 1;
    while (count < 5) {
        html += htmlGameRow(fixtures[count++], fixtures[count++]);
    }

    return html;
}

function htmlAllGames(fixtures, queryType) {
    if (queryType === 'team') {
        return htmlAllGamesTeam(fixtures);
    }
    if (queryType === 'league') {
        return htmlAllGamesLeague(fixtures);
    }

    return '';
}

function htmlStandings(standing, i) {
    return `
        <div class="row" style="padding-top: 0.5rem;">
            <div class="col">${i}</div>
            <div class="col standingTeam">
                <div class="row">
                    <div class="col" style="flex: 1;">
                        <g-img class="logo">
                            <img src="data:image/png;base64,${logoUtils.getLogo(standing.team)}"
                                height="22" width="22" alt="">
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
    if (!standings) {
        return '';
    }
    var html = '';
    for (let i = 0; i < standings.length; i++) {
        html += htmlStandings(standings[i], i + 1);
    }
    return html;
}

function isLive(fixture) {
    return liveStatus.includes(fixture.status.short);
}

async function sports(query, API_KEY) {
    if (this.objQuery.type === '') {
        return;
    }
    var fixtures = [];
    const headers = { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' };

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

    if (this.objQuery.type === 'team') {
        const findNextFixtures = await axios.get(urlFixtures + `&team=${this.objQuery.id}&next=3`, { headers }).catch(error => ({ error }));
        Array.prototype.push.apply(fixtures, findNextFixtures.data.response);

        const findLastFixtures = await axios.get(urlFixtures + `&team=${this.objQuery.id}&last=3`, { headers }).catch(error => ({ error }));
        Array.prototype.push.apply(fixtures, findLastFixtures.data.response);

        const findStandingsLeague = await axios.get(urlStandings + `&team=${this.objQuery.id}`, { headers }).catch(error => ({ error }));
        const league = findStandingsLeague.data.response.filter(s => s.league.country === this.objQuery.country)[0];

        const findStandings = await axios.get(urlStandings + `&league=${league.league.id}`, { headers }).catch(error => ({ error }));
        var standings = findStandings.data.response[0].league.standings[0];
    }

    if (this.objQuery.type === 'league') {
        const findCurrentRound = await axios.get(urlCurrentRound + `&league=${this.objQuery.id}&current=true`, { headers }).catch(error => ({ error }));
        var currentRound = findCurrentRound.data.response[0];

        const findFixtures = await axios.get(urlFixtures + `&league=${this.objQuery.id}&round=${currentRound}`, { headers }).catch(error => ({ error }));
        Array.prototype.push.apply(fixtures, findFixtures.data.response);

        const findStandings = await axios.get(urlStandings + `&league=${this.objQuery.id}`, { headers }).catch(error => ({ error }));
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
        const findLiveFixtures = await axios.get(urlFixtures + `&team=${this.objQuery.id}&live=all`, { headers }).catch(error => ({ error }));
        fixtures[0] = findLiveFixtures.data.response[0];

        // Mock data
        // const live = { "get": "fixtures", "parameters": { "season": "2022", "team": "211", "live": "all" }, "errors": [], "results": 1, "paging": { "current": 1, "total": 1 }, "response": [{ "fixture": { "id": 898630, "referee": "Artur Soares Dias, Portugal", "timezone": "UTC", "date": "2022-08-30T19:15:00+00:00", "timestamp": 1661886900, "periods": { "first": 1661886900, "second": null }, "venue": { "id": null, "name": "Estadio do Sport Lisboa e Benfica", "city": "Lisbon" }, "status": { "long": "First Half", "short": "1H", "elapsed": 44 } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https:\/\/media.api-sports.io\/football\/leagues\/94.png", "flag": "https:\/\/media.api-sports.io\/flags\/pt.svg", "season": 2022, "round": "Regular Season - 3" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https:\/\/media.api-sports.io\/football\/teams\/211.png", "winner": null }, "away": { "id": 234, "name": "Pacos Ferreira", "logo": "https:\/\/media.api-sports.io\/football\/teams\/234.png", "winner": null } }, "goals": { "home": 1, "away": 1 }, "score": { "halftime": { "home": 1, "away": 1 }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } }, "events": [{ "time": { "elapsed": 14, "extra": null }, "team": { "id": 234, "name": "Pacos Ferreira", "logo": "https:\/\/media.api-sports.io\/football\/teams\/234.png" }, "player": { "id": 129728, "name": "J. Holsgrove" }, "assist": { "id": null, "name": null }, "type": "Card", "detail": "Yellow Card", "comments": "Holding" }, { "time": { "elapsed": 16, "extra": null }, "team": { "id": 211, "name": "Benfica", "logo": "https:\/\/media.api-sports.io\/football\/teams\/211.png" }, "player": { "id": 573, "name": "Rafa Silva" }, "assist": { "id": null, "name": null }, "type": "Card", "detail": "Yellow Card", "comments": "Tripping" }, { "time": { "elapsed": 31, "extra": null }, "team": { "id": 211, "name": "Benfica", "logo": "https:\/\/media.api-sports.io\/football\/teams\/211.png" }, "player": { "id": 624, "name": "N. Otamendi" }, "assist": { "id": null, "name": null }, "type": "Var", "detail": "Goal Disallowed - offside", "comments": null }, { "time": { "elapsed": 35, "extra": null }, "team": { "id": 234, "name": "Pacos Ferreira", "logo": "https:\/\/media.api-sports.io\/football\/teams\/234.png" }, "player": { "id": 41490, "name": "Flavio" }, "assist": { "id": null, "name": null }, "type": "Card", "detail": "Yellow Card", "comments": "Foul" }, { "time": { "elapsed": 39, "extra": null }, "team": { "id": 234, "name": "Pacos Ferreira", "logo": "https:\/\/media.api-sports.io\/football\/teams\/234.png" }, "player": { "id": 174564, "name": "N. P. Koffi" }, "assist": { "id": 47255, "name": "V. Antunes" }, "type": "Goal", "detail": "Normal Goal", "comments": null }, { "time": { "elapsed": 42, "extra": null }, "team": { "id": 211, "name": "Benfica", "logo": "https:\/\/media.api-sports.io\/football\/teams\/211.png" }, "player": { "id": 552, "name": "D. Neres" }, "assist": { "id": 573, "name": "Rafa Silva" }, "type": "Goal", "detail": "Normal Goal", "comments": null }] }] };
        // fixtures[0] = live.response[0];
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




    <!-- example styles - remember to use #presearchSportPackage before each class -->
    <style>
        #presearchSportPackage {
            max-width: 40rem;
            font-size: 0.9rem;
        }

        @media only screen and (max-width: 600px) {
            #presearchSportPackage {
                font-size: 0.5rem;
            }
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

        @media only screen and (max-width: 600px) {
            #presearchSportPackage .subject {
                font-size: 1.2rem;
            }
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

        @media only screen and (max-width: 600px) {
            #presearchSportPackage .tab {
                font-size: 0.6rem;
            }
        }

        #presearchSportPackage .tab:hover {
            background-color: rgba(9,9,121,0.4);
        }

        #presearchSportPackage .tab-clicked {
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
            font-size: 0.7rem;
            text-align: center;
        }

        @media only screen and (max-width: 600px) {
            #presearchSportPackage .gameDate {
                font-size: 0.4rem;
            }
        }

        #presearchSportPackage .gameRow {
            border-right: 0.15rem solid #bdc3c7;
            padding-right: 0.6rem;
        }

        .dark #presearchSportPackage .gameRow {
            border-right: 0.15rem solid #7F7F7F;
        }

        #presearchSportPackage .rightGame {
            border-left: 0.25rem solid #bdc3c7;
        }

        .dark #presearchSportPackage .rightGame {
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
        }

        #presearchSportPackage .standingTeam {
            flex: 5;
            padding-right: 1rem;
        }

        #presearchSportPackage .gameLiveScore {
            font-size: 1.2rem;
            font-weight: bold;
        }

        @media only screen and (max-width: 600px) {
            #presearchSportPackage .gameLiveScore {
                font-size: 1rem;
            }
        }

        #presearchSportPackage .liveGame {
            padding: 1vw; 
            background: linear-gradient(218deg, rgba(0,14,255,1) 0%, rgba(82,135,255,1) 0%, rgba(0,0,0,0) 16%);
        }

        #presearchSportPackage .goal {
            font-size: 0.7rem; 
        }

        @media only screen and (max-width: 600px) {
            #presearchSportPackage .goal {
                font-size: 0.4rem;
            }
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

                tabs.forEach(tab => {
                    tab.classList.remove('tab-clicked')
                })
                tabInfos.forEach(tabInfo => {
                    tabInfo.classList.remove('active')
                })
                target.classList.add('active');
                tab.classList.add('tab-clicked');
            })
        });
    </script>
	`;
}

async function trigger(query) {
    if (!query) {
        return false;
    }
    const team = teams.filter(team => team.name.toLowerCase() === query.toLowerCase());

    if (team && team.length == 1) {
        this.objQuery = team[0];
        this.objQuery['type'] = 'team';
        return true;
    }
    //searh for league
    const league = leagues.filter(league => league.name.toLowerCase() === query.toLowerCase());

    if (league && league.length == 1) {
        this.objQuery = league[0];
        this.objQuery['type'] = 'league';
        return true;
    }
    return false;
}

module.exports = { sports, trigger, objQuery };