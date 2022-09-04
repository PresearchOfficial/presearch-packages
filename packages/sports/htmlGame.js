const helper = require('./helper');
const logoUtils = require('./logoUtils');

const liveStatusOnGoing = ['1H', '2H', 'ET', 'LIVE'];


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
            : helper.getDate(fixture.fixture.timestamp)}</label></div>
            <div><label>${fixture.fixture.status.short === "NS"
            ? helper.getTime(fixture.fixture.timestamp)
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
            ? '' : ' - ' + helper.getDate(fixture.fixture.timestamp) + ', ' + helper.getTime(fixture.fixture.timestamp)}
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

module.exports = {htmlAllGames}