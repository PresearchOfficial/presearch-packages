const logoUtils = require('./logoUtils');

function htmlStandings(standing) {
    return `
        <div class="row" style="padding-top: 0.5rem;">
            <div class="col">${standing.rank}</div>
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

function htmlStandingsHeader(standings){
    return `
        <div class="standingTable">
            <div style="padding-bottom: 0.7rem;font-weight: bold">
                <label>${standings[0].group}</label>
            </div>
            <div class="row standingHeader" style="padding-bottom: 0.2rem;">
                <div class="col"><label class="standingHeaderLabel">#</label></div>
                <div class="col standingTeam"><label class="standingHeaderLabel">Team</label></div>
                <div class="col"><label class="standingHeaderLabel">MP</label></div>
                <div class="col"><label class="standingHeaderLabel">W</label></div>
                <div class="col"><label class="standingHeaderLabel">D</label></div>
                <div class="col"><label class="standingHeaderLabel">L</label></div>
                <div class="col"><label class="standingHeaderLabel">Pts</label></div>
            </div>
    `;
}

function htmlAllStandings(standings) {
    if (!standings || standings.length == 0) {
        return '';
    }
    var html = '';
    for (let i = 0; i < standings.length; i++) {
        html += htmlStandingsHeader(standings[i]);

        for (let j = 0; j < standings[i].length; j++) {
            html += htmlStandings(standings[i][j]);
        }
        html += '</div>';
    }
    return html;
}

module.exports = { htmlAllStandings }