'use strict';

function lengthConverter(query) {
    return `
	
	<div id="presearchPackage">
		<div>
			<label>Feet</label>
			<input id="Feet" type="number" placeholder="Feet" oninput="feetConverter(this.value)" onchange="feetConverter(this.value)">
  		</div>
		<div>
		  	<label>Meters</label>
		  	<input id="Meters" type="number" placeholder="Meters" oninput="metersConverter(this.value)" onchange="metersConverter(this.value)">
		</div>
		<div>
			<label>Inches</label>
			<input id="Inches" type="number" placeholder="Inches" oninput="inchesConverter(this.value)" onchange="inchesConverter(this.value)">
	  	</div>
        <div>
            <label>Cm</label>
            <input id="Cm" type="number" placeholder="cm" oninput="cmConverter(this.value)" onchange="cmConverter(this.value)">
        </div>
        <div>
            <label>Yards</label>
            <input id="Yards" type="number" placeholder="Yards" oninput="yardsConverter(this.value)" onchange="yardsConverter(this.value)">
        </div>
        <div>
            <label>Kilometers</label>
            <input id="Kilometers" type="number" placeholder="Kilometers" oninput="kilometersConverter(this.value)" onchange="kilometersConverter(this.value)">
        </div>
        <div>
            <label>Miles</label>
            <input id="Miles" type="number" placeholder="Miles" oninput="milesConverter(this.value)" onchange="milesConverter(this.value)">
        </div>
	</div>

  
  	<script>
  		function feetConverter(valNum) {
			document.getElementById("Meters").value=valNum/3.2808;
            document.getElementById("Inches").value=valNum*12;
			document.getElementById("Cm").value=valNum/0.032808;
            document.getElementById("Yards").value=valNum*0.33333;
			document.getElementById("Kilometers").value=valNum/3280.8;
            document.getElementById("Miles").value=valNum*0.00018939;
  		}
		function metersConverter(valNum) {
			document.getElementById("Feet").value=valNum*3.2808;
            document.getElementById("Inches").value=valNum*39.370;
			document.getElementById("Cm").value=valNum/0.01;
            document.getElementById("Yards").value=valNum*1.0936;
			document.getElementById("Kilometers").value=valNum/1000;
            document.getElementById("Miles").value=valNum*0.00062137;
		} 
		function inchesConverter(valNum) {
			document.getElementById("Feet").value=valNum*0.083333;
			document.getElementById("Meters").value=valNum/39.370;
			document.getElementById("Cm").value=valNum/0.39370;
            document.getElementById("Yards").value=valNum*0.027778;
			document.getElementById("Kilometers").value=valNum/39370;
            document.getElementById("Miles").value=valNum*0.000015783;
		} 
        function cmConverter(valNum) {
			document.getElementById("Feet").value=valNum*0.032808;
			document.getElementById("Meters").value=valNum/100;
            document.getElementById("Inches").value=valNum*0.39370;
            document.getElementById("Yards").value=valNum*0.010936;
			document.getElementById("Kilometers").value=valNum/100000;
            document.getElementById("Miles").value=valNum*0.0000062137;
		} 
        function yardsConverter(valNum) {
			document.getElementById("Feet").value=valNum*3;
			document.getElementById("Meters").value=valNum/1.0936;
            document.getElementById("Inches").value=valNum*36;
			document.getElementById("Cm").value=valNum/0.010936;
			document.getElementById("Kilometers").value=valNum/1093.6;
            document.getElementById("Miles").value=valNum*0.00056818;
		} 
        function kilometersConverter(valNum) {
			document.getElementById("Feet").value=valNum*3280.8;
			document.getElementById("Meters").value=valNum*1000;
            document.getElementById("Inches").value=valNum*39370;
			document.getElementById("Cm").value=valNum*100000;
            document.getElementById("Yards").value=valNum*1093.6;
            document.getElementById("Miles").value=valNum*0.62137;
		} 
        function milesConverter(valNum) {
			document.getElementById("Feet").value=valNum*5280;
			document.getElementById("Meters").value=valNum/0.00062137;
            document.getElementById("Inches").value=valNum*63360;
			document.getElementById("Cm").value=valNum/0.0000062137;
            document.getElementById("Yards").value=valNum*1760;
			document.getElementById("Kilometers").value=valNum/0.62137;
		} 
  	</script>

	`
}
module.exports = { lengthConverter }