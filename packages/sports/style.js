const style = `
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

`;

module.exports = { style }