const style = `<style>
/* styles for dark mode should have .dark before */
.dark #presearchPackage {
    color: white;
}
.dark #presearchPackage .grey{
    color: #bababa;
}
.dark #presearchPackage .green{
    color: #4eb66e;
}
.dark #presearchPackage .darkbg{
    background: #212121;
}
#presearchPackage .flexrow{
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
}
#presearchPackage .hidden{
    display: none;
}
#presearchPackage .grey{
    color: #525252;
}
#presearchPackage .green{
    color: #007d26;
}
#presearchPackage .greenbg{
    background:#4eb66e;
}
#presearchPackage .darkbg{
    background: white;
}
#presearchPackage table{
    margin: 10px 0;
}
#presearchPackage table td{
    padding-right: 2em;
}
#presearchPackage input.darkbg{
    border: 1px solid;
    border-radius: 8px;
    padding: 10px;
    margin: 15px 15px 15px 0;
    width: 30%;
}
#presearchPackage img.logos{
    background: white;
    margin: 0 10px 0 0;
    height: 30px;
    width: 30px;
}
#presearchPackage .popular-destinations p{
    padding: 5px 10px;
    border: 2px solid #2d8fff;
    border-radius: 20px;
    background: #2d8fff2e;
    display: inline-block;
    margin: 10px 10px 10px 0;
}
.airport-details table tr td:nth-child(2){
    font-size:1.2em;
}
.leg .more-details div div table tr:nth-child(2) td{
    font-size:2em;
}
#presearchPackage .body .leg{cursor:pointer;}
#presearchPackage .body .leg .basic-details{
    border-top: 1px solid grey;
    margin: 15px 0;
    padding-top: 15px;
    width: 100%;
}
.arrow svg{
    fill: currentColor;
    height: 32px;
    width: 70px;
}
.leg .more-details{
    transition: max-height 0.3s ease 0s;
    padding: 15px;
    border: 1px solid grey;
    border-radius: 8px;
}
.acode{
    font-size: 2.5em;
}
.leg .more-details .column1 .distance-line{
    width: 80%;
    background-color: grey;
    height: 1px;
    margin: 0 20px;
    position: relative;
}
.leg .more-details .column1 .distance-line .flight-duration{
    position: absolute;
    left: 50%;
    top: -25px;
    font-size: 16px;
}
.leg .more-details .column1 .distance-line .airplane{
    width: 100%;
    position: absolute;
    top: -11px;
    display: flex;
}
.leg .more-details .column1 .distance-line .airplane p{
    display: block;
    height: 3px;
    align-self: center;
}
.leg .more-details .arrival-airport{
    width: 50%;
    padding-left: 15px;
    border-left: 1px solid grey;
}
.leg .more-details .column3{
    border-top: 1px solid grey;
    margin-top: 10px;
    padding-top: 8px;
    text-align: right;
}
</style>`;

module.exports = {style}