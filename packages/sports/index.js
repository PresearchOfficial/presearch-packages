'use strict';
const fs = require('fs');
var path = require('path');


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

async function sports(query, API_KEY) {
	const mockTeam = [{ "id": 211, "name": "Benfica", "code": "BEN", "country": "Portugal", "founded": 1904, "national": false, "logo": "https://media.api-sports.io/football/teams/211.png" }];
	const mockLastFixtures = [{ "fixture": { "id": 933173, "referee": "Felix Zwayer, Germany", "timezone": "Europe/London", "date": "2022-08-17T20:00:00+01:00", "timestamp": 1660762800, "periods": { "first": 1660762800, "second": 1660766400 }, "venue": { "id": 12602, "name": "Stadion Miejski LKS Lodz", "city": "Łódź" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "Play-offs" }, "teams": { "home": { "id": 572, "name": "Dynamo Kyiv", "logo": "https://media.api-sports.io/football/teams/572.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 0, "away": 2 }, "score": { "halftime": { "home": 0, "away": 2 }, "fulltime": { "home": 0, "away": 2 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898620, "referee": "Tiago Martins", "timezone": "Europe/London", "date": "2022-08-13T18:00:00+01:00", "timestamp": 1660410000, "periods": { "first": 1660410000, "second": 1660413600 }, "venue": { "id": 3514, "name": "Estádio Dr. Magalhães Pessoa", "city": "Leiria" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 2" }, "teams": { "home": { "id": 4716, "name": "Casa Pia", "logo": "https://media.api-sports.io/football/teams/4716.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 0, "away": 1 }, "score": { "halftime": { "home": 0, "away": 0 }, "fulltime": { "home": 0, "away": 1 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 923128, "referee": "Srdjan Jovanovic, Montenegro", "timezone": "Europe/London", "date": "2022-08-09T18:45:00+01:00", "timestamp": 1660067100, "periods": { "first": 1660067100, "second": 1660070700 }, "venue": { "id": 457, "name": "Cepheus Park Randers", "city": "Randers" }, "status": { "long": "Match Finished", "short": "FT", "elapsed": 90 } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "3rd Qualifying Round" }, "teams": { "home": { "id": 397, "name": "FC Midtjylland", "logo": "https://media.api-sports.io/football/teams/397.png", "winner": false }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": true } }, "goals": { "home": 1, "away": 3 }, "score": { "halftime": { "home": 0, "away": 1 }, "fulltime": { "home": 1, "away": 3 }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }];
	const mockNextFixtures = [{ "fixture": { "id": 933174, "referee": null, "timezone": "Europe/London", "date": "2022-08-23T20:00:00+01:00", "timestamp": 1661281200, "periods": { "first": null, "second": null }, "venue": { "id": null, "name": "Estádio do Sport Lisboa e Benfica", "city": "Lisboa" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 2, "name": "UEFA Champions League", "country": "World", "logo": "https://media.api-sports.io/football/leagues/2.png", "flag": null, "season": 2022, "round": "Play-offs" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null }, "away": { "id": 572, "name": "Dynamo Kyiv", "logo": "https://media.api-sports.io/football/teams/572.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898637, "referee": null, "timezone": "Europe/London", "date": "2022-08-27T18:00:00+01:00", "timestamp": 1661619600, "periods": { "first": null, "second": null }, "venue": { "id": 1267, "name": "Estádio do Bessa Século XXI", "city": "Porto" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 4" }, "teams": { "home": { "id": 222, "name": "Boavista", "logo": "https://media.api-sports.io/football/teams/222.png", "winner": null }, "away": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }, { "fixture": { "id": 898630, "referee": null, "timezone": "Europe/London", "date": "2022-08-30T20:15:00+01:00", "timestamp": 1661886900, "periods": { "first": null, "second": null }, "venue": { "id": null, "name": "Estádio do Sport Lisboa e Benfica", "city": "Lisboa" }, "status": { "long": "Not Started", "short": "NS", "elapsed": null } }, "league": { "id": 94, "name": "Primeira Liga", "country": "Portugal", "logo": "https://media.api-sports.io/football/leagues/94.png", "flag": "https://media.api-sports.io/flags/pt.svg", "season": 2022, "round": "Regular Season - 3" }, "teams": { "home": { "id": 211, "name": "Benfica", "logo": "https://media.api-sports.io/football/teams/211.png", "winner": null }, "away": { "id": 234, "name": "Pacos Ferreira", "logo": "https://media.api-sports.io/football/teams/234.png", "winner": null } }, "goals": { "home": null, "away": null }, "score": { "halftime": { "home": null, "away": null }, "fulltime": { "home": null, "away": null }, "extratime": { "home": null, "away": null }, "penalty": { "home": null, "away": null } } }];

	const teamName = mockTeam[0].name;
	const teamLogo = mockTeam[0].logo;

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
                    ${htmlGameSection(mockLastFixtures[0])}
                    ${htmlGameSection(mockNextFixtures[0])}
                    ${htmlGameSection(mockLastFixtures[1])}
                    ${htmlGameSection(mockNextFixtures[1])}
                    ${htmlGameSection(mockLastFixtures[2])}
                    ${htmlGameSection(mockNextFixtures[2])}

                </div>
            </div>



            <div class="tab">
                <input type="radio" name="css-tabs" id="tab-standings" class="tab-switch">
                <label for="tab-standings" class="tab-label">Standings</label>
                <div class="tab-content">
                    <table border=1 frame=hsides rules=rows>
                        <tr class="standingsHeader">
                            <th colspan="3">Team</th>
                            <th>MP</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>Pts</th>
                        </tr>
                        <tr>
                            <td style="width: 5%; padding-left: 1%;">
                                <label style="font-weight: bold;">1</label>
                            </td>
                            <td style="width: 2%;">
                                <g-img>
                                    <img src="data:image/png;base64,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"
                                        height="32" width="32" alt="">
                                </g-img>
                            </td>
                            <td style="width: 50%;">
                                <label>Porto</label>
                            </td>
                            </td>
                            <td>2</td>
                            <td>2</td>
                            <td>0</td>
                            <td>0</td>
                            <td>6</td>
                        </tr>
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

        .wrapper {
            max-width: 50rem;
            width: 100%;
            margin: 0 auto;
        }

        table {
            color: #2c3e50;
            width: 100%;
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

        .match {
            width: 60%;
            float: left;
            padding-right: 2%;
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
            padding: 1.618rem;
            border: 0.25rem solid #bdc3c7;
        }

        .tabs {
            position: relative;
            height: 14.75rem;
            background: #1abc9c;
            display: flex;
            justify-content: space-evenly;
        }

        .score {
            padding-left: 60%;
        }

        .row {
            padding-bottom: 1rem;
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
	return team && team.length == 1;
}

module.exports = { sports, trigger };