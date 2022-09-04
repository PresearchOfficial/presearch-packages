const logoUtils = require('./logoUtils');

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

module.exports = {htmlAllStandings}