'use strict';
const fs = require('fs');
var axios = require('axios');
var path = require('path');

var queryType = '';
const season = 2022;
const urlTeam = `https://v3.football.api-sports.io/teams`;
const urlFixtures = `https://v3.football.api-sports.io/fixtures?timezone=Europe/London&season=${season}`;
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

function htmlGameSection(fixture) {
    return `
        <div class="content-matches">
            <table>
				<tr>
					<label class="leagueLabel">${fixture.league.name}</label>
				</tr>
                <tr>
                    <td style="width: 10%;">
                        <g-img class="logo">
                            <img src="${fixture.teams.home.logo}"
                                height="32" width="32" alt="">
                        </g-img>
                    </td>
                    <td style="width: 40%;">
                        <label>${fixture.teams.home.name}</label>
                    </td>
                    <td style="width: 20%; text-align: right; padding-right: 2%;">
                        <label class="score">${fixture.teams.home.winner ? "&#9654;" : ""} ${fixture.goals.home != null ? fixture.goals.home : ""}</label>
                    </td>
                    <td style="width: 30%" rowspan="2" class="verticalLine">
                        <div class="matchTime">
                            <div><label>${getDate(fixture.fixture.timestamp)}</label></div>
                            <div><label>${fixture.fixture.status.short === "FT" ? "FT" : getTime(fixture.fixture.timestamp)}</label></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="width: 10%;">
                        <g-img class="logo">
                            <img src="${fixture.teams.away.logo}"
                                height="32" width="32" alt="">
                        </g-img>
                    </td>
                    <td style="width: 40%;">
                        <label>${fixture.teams.away.name}</label>
                    </td>
                    <td style="width: 20%; text-align: right; padding-right: 2%;">
                        <label class="score">${fixture.teams.away.winner ? "&#9654;" : ""} ${fixture.goals.away != null ? fixture.goals.away : ""}</label>
                    </td>
                </tr>
            </table>
        </div>
    `;
}

function htmlStandings(standing, i) {
    return `
		<tr>
			<td style="width: 5%; padding-left: 1%;">
				<label style="font-weight: bold;">${i}</label>
			</td>
			<td style="width: 2%;">
				<g-img>
					<img src="${standing.team.logo}" height="32" width="32" alt="">
				</g-img>
			</td>
			<td style="width: 50%;">
				<label>${standing.team.name}</label>
			</td>
			</td>
			<td><label>${standing.all.played}</label></td>
			<td><label>${standing.all.win}</label></td>
			<td><label>${standing.all.draw}</label></td>
			<td><label>${standing.all.lose}</label></td>
			<td><label>${standing.points}</label></td>
		</tr>
	`;
}

function htmlAllStandings(standings) {
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
    // const team = [{ "team": { "id": 211, "name": "Benfica", "code": "BEN", "country": "Portugal", "founded": 1904, "national": false, "logo": "https://media.api-sports.io/football/teams/211.png" } }];
    // const lastFixtures = [{ "fixture": { "id": 933173, "referee": "Felix Zwayer, Germany", "timezone": "Europe/London", "date": "2022-08-17T20:00:00+01:00", "timestamp": 1660762800, "periods": { "first": 1660762800, "second": 1660766400 }, "venue": { "id": 12602, "name": "Stadion Miejski LKS Lodz", "city": "Łódź" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "Play-offs" }, "teams": { "home": { "id": 572, "name": "Dynamo Kyiv", "logo": "https://media.api-sports.io/football/teams/572.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 0, "away": 2 }, "score": { "halftime": { "home": 0, "away": 2 }, "fulltime": { "home": 0, "away": 2 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898620, "referee": "Tiago Martins", "timezone": "Europe/London", "date": "2022-08-13T18:00:00+01:00", "timestamp": 1660410000, "periods": { "first": 1660410000, "second": 1660413600 }, "venue": { "id": 3514, "name": "Estádio Dr. Magalhães Pessoa", "city": "Leiria" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 2" }, "teams": { "home": { "id": 4716, "name": "Casa Pia", "logo": "https://media.api-sports.io/football/teams/4716.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 0, "away": 1 }, "score": { "halftime": { "home": 0, "away": 0 }, "fulltime": { "home": 0, "away": 1 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 923128, "referee": "Srdjan Jovanovic, Montenegro", "timezone": "Europe/London", "date": "2022-08-09T18:45:00+01:00", "timestamp": 1660067100, "periods": { "first": 1660067100, "second": 1660070700 }, "venue": { "id": 457, "name": "Cepheus Park Randers", "city": "Randers" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "3rd Qualifying Round" }, "teams": { "home": { "id": 397, "name": "FC Midtjylland", "logo": "https://media.api-sports.io/football/teams/397.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 1, "away": 3 }, "score": { "halftime": { "home": 0, "away": 1 }, "fulltime": { "home": 1, "away": 3 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }];
    // const nextFixtures = [{ "fixture": { "id": 933174, "referee": null, "timezone": "Europe/London", "date": "2022-08-23T20:00:00+01:00", "timestamp": 1661281200, "periods": { "first": null, "second": null }, "venue": { "id": null, "name": "Estádio do Sport Lisboa e Benfica", "city": "Lisboa" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "Play-offs" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null }, "away": { "id": 572, "name": "Dynamo Kyiv", "logo": "https://media.api-sports.io/football/teams/572.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898637, "referee": null, "timezone": "Europe/London", "date": "2022-08-27T18:00:00+01:00", "timestamp": 1661619600, "periods": { "first": null, "second": null }, "venue": { "id": 1267, "name": "Estádio do Bessa Século XXI", "city": "Porto" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 4" }, "teams": { "home": { "id": 222, "name": "Boavista", "logo": "https://media.api-sports.io/football/teams/222.png", "winner": null }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898630, "referee": null, "timezone": "Europe/London", "date": "2022-08-30T20:15:00+01:00", "timestamp": 1661886900, "periods": { "first": null, "second": null }, "venue": { "id": null, "name": "Estádio do Sport Lisboa e Benfica", "city": "Lisboa" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 3" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null }, "away": { "id": 234, "name": "Pacos Ferreira", "logo": "https://media.api-sports.io/football/teams/234.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }];
    // const standings = [];

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    const headers = { 'x-rapidapi-key': '20335a832eedb54420e58e72280d7529', 'x-rapidapi-host': 'v3.football.api-sports.io' };

    if (this.queryType === 'team') {
        const findTeamResponse = await Promise.all([
            axios.get(urlTeam + `?search=${query}`, { headers }).catch(error => ({ error }))
        ]);

        var team = findTeamResponse[0].data.response;
        if (team.length > 1) {
            team = team.filter(t => t.team.name.toLowerCase() === query.toLowerCase())
        }
        if (!team || team.length == 0) return null;

        const findNextFixtures = await Promise.all([
            axios.get(urlFixtures + `&team=${team[0].team.id}&next=3`, { headers }).catch(error => ({ error }))
        ]);
        var nextFixtures = findNextFixtures[0].data.response;

        const findLastFixtures = await Promise.all([
            axios.get(urlFixtures + `&team=${team[0].team.id}&last=3`, { headers }).catch(error => ({ error }))
        ]);
        var lastFixtures = findLastFixtures[0].data.response;

        const findStandingsLeague = await Promise.all([
            axios.get(urlStandings + `&team=${team[0].team.id}`, { headers }).catch(error => ({ error }))
        ]);
        const league = findStandingsLeague[0].data.response[0].league;

        const findStandings = await Promise.all([
            axios.get(urlStandings + `&league=${league.id}`, { headers }).catch(error => ({ error }))
        ]);
        var standings = findStandings[0].data.response[0].league.standings[0];
    }

    if(this.queryType === 'league'){
        
    }
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    const teamName = team[0].team.name;
    const teamLogo = team[0].team.logo;

    return `
    <div id="presearchPackage">
        <div class="header">
            <g-img class="logo">
                <img src="${teamLogo}"
                    height="32" width="32" alt="">
            </g-img>
            <label class="subject">${teamName}</label>
        </div>
        <div class="tabs">
            <div class="tab">
                <input type="radio" name="css-tabs" id="tab-matches" checked class="tab-switch">
                <label for="tab-matches" class="tab-label">Matches</label>
                <div class="tab-content">
                    ${htmlGameSection(lastFixtures[0])}
                    ${htmlGameSection(nextFixtures[0])}
                    ${htmlGameSection(lastFixtures[1])}
                    ${htmlGameSection(nextFixtures[1])}
                    ${htmlGameSection(lastFixtures[2])}
                    ${htmlGameSection(nextFixtures[2])}

                </div>
            </div>



            <div class="tab">
                <input type="radio" name="css-tabs" id="tab-standings" class="tab-switch">
                <label for="tab-standings" class="tab-label">Standings</label>
                <div class="tab-content">
                    <table border=1 frame=hsides rules=rows>
                        <tr class="standingsHeader">
                            <th colspan="3" style="padding-left: 4vw;">Team</th>
                            <th>MP</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>Pts</th>
                        </tr>
						${htmlAllStandings(standings)}
                    </table>
                </div>
            </div>
            <div class="tab">
                <input type="radio" name="css-tabs" id="tab-3" class="tab-switch">
                <label for="tab-3" class="tab-label">Tab Three</label>
                <div class="tab-content">When I left Mr. Bates, I went down to my father: where, by the assistance of
                    him and my uncle John, and some other relations, I got forty pounds, and a promise of thirty pounds
                    a year to maintain me at Leyden: there I studied physic two years and seven months, knowing it would
                    be useful in long voyages.</div>
            </div>
        </div>
    </div>




    <!-- example styles - remember to use #presearchPackage before each class -->
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: "Open Sans";
            background: #2c3e50;
            color: #ecf0f1;
            line-height: 1.618em;
        }

		img {
			max-height: 2rem;
		}

		label {
			font-size: 1vw;
		}

        .wrapper {
            max-width: 50rem;
            width: 100%;
            margin: 0 auto;
        }

        table {
            color: #2c3e50;
            width: 100%;
            border-collapse: collapse;
        }

		th {
			font-size: 1.5vw;
		}

        .standingsHeader {
            text-align: left;
        }

        .header {
            background: #1abc9c;
            padding-left: 5%;
            padding-top: 3%;
            padding-bottom: 3%;
            border-top-left-radius: 30px;
            border-top-right-radius: 30px;
        }

        .subject {
            font-weight: bold;
            font-size: 2rem;
        }

        .logo {
            margin-right: 2%;
            float: left;
        }

		.leagueLabel {
            color: #bdc3c7;
        }



        .matchTime {
            text-align: center;
            width: 100%;
            float: left;
        }

        .verticalLine {
            border-left: 0.15rem solid #bdc3c7;
        }

        .content-matches {
            float: left;
            width: 50%;
            padding: 1vw;
            border: 0.25rem solid #bdc3c7;
        }

        .tabs {
            position: relative;
            height: 100vmin;
            background: #1abc9c;
            display: flex;
            justify-content: space-evenly;
            max-height: 31vw;
        }

        .score {
            padding-left: 60%;
        }

        .tabs::before,
        .tabs::after {
            content: "";
            display: table;
        }

        .tabs::after {
            clear: both;
        }

        .tab {
            float: left;
            flex: 0.2;
        }

        .tab-switch {
            display: none;
        }

        .tab-label {
            position: relative;
            display: block;
            line-height: 2.75em;
            height: 3em;
            padding: 0 1.618em;
            background: #62eace;
            border: 0.025rem solid #16a085;
            color: #fff;
            cursor: pointer;
            top: 0;
            transition: all 0.25s;
            text-align: center;
        }

        .tab-label:hover {
            top: -0.25rem;
            transition: top 0.25s;
            background-color: #0f705d;
        }

        .tab-content {
            position: absolute;
            z-index: 1;
            top: 2.75em;
            left: 0;
            background: #fff;
            color: #2c3e50;
            border-bottom: 0.25rem solid #bdc3c7;
            opacity: 0;
            transition: all 0.35s;
            width: 100%;
        }

        .tab-content::after {
            content: "";
            display: table;
            clear: both;
        }

        .tab-switch:checked+.tab-label {
            background: #fff;
            color: #2c3e50;
            border-bottom: 0;
            border-right: 0.125rem solid #fff;
            transition: all 0.35s;
            z-index: 1;
            top: -0.0625rem;
        }

        .tab-switch:checked+label+.tab-content {
            z-index: 2;
            opacity: 1;
            transition: all 0.35s;
        }
    </style>
    <!-- example javascript -->
    <script>
        
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