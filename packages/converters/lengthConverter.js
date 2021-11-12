'use strict';

function lengthConverter(queryUnitValue, queryUnit) {
	//0="feet"
	//1="meters"
	//2="inches"
	//3="cm"
	//4="yards"
	//5="kilometers"
	//6="miles"
	if (queryUnit !== 0 && queryUnit !== 1 && queryUnit !== 2 && queryUnit !== 3 && queryUnit !== 4 && queryUnit !== 5 && queryUnit !== 6) return null;
	if (isNaN(queryUnitValue)) return null;
	return `
	
	<div id="presearchPackage">
	<div class="row">
		<div class="column">
			<label class="label">Feet</label>
			<input class="input" id="Feet" type="number" placeholder="Feet" oninput="feetConverter(this.value)" onchange="feetConverter(this.value)">
  		</div>
		<div class="column">
		  	<label class="label">Meters</label>
		  	<input class="input" id="Meters" type="number" placeholder="Meters" oninput="metersConverter(this.value)" onchange="metersConverter(this.value)">
		</div>
		<div class="column">
			<label class="label">Inches</label>
			<input class="input" id="Inches" type="number" placeholder="Inches" oninput="inchesConverter(this.value)" onchange="inchesConverter(this.value)">
	  	</div>
        <div class="column">
            <label class="label">Cm</label>
            <input class="input" id="Cm" type="number" placeholder="cm" oninput="cmConverter(this.value)" onchange="cmConverter(this.value)">
        </div>
        <div class="column">
            <label class="label">Yards</label>
            <input class="input" id="Yards" type="number" placeholder="Yards" oninput="yardsConverter(this.value)" onchange="yardsConverter(this.value)">
        </div>
        <div class="column">
            <label class="label">Kilometers</label>
            <input class="input" id="Kilometers" type="number" placeholder="Kilometers" oninput="kilometersConverter(this.value)" onchange="kilometersConverter(this.value)">
        </div>
        <div class="column">
            <label class="label">Miles</label>
            <input class="input" id="Miles" type="number" placeholder="Miles" oninput="milesConverter(this.value)" onchange="milesConverter(this.value)">
        </div>
	</div>
	</div>

	<style>
		#presearchPackage .row{
			border-radius: 5px;
			background-color: #f2f2f2;
			padding: 10px;
		}
		#presearchPackage .row:after{
			content: "";
			display: table;
			clear: both;
		}
		#presearchPackage .label{
			color:#374151;
		}
		#presearchPackage .input{
			width: 100%;
			padding: 4px 4px;
			margin: 1px 0;
			display: inline-block;
			border: 1px solid #ccc;
			border-radius: 4px;
			box-sizing: border-box;
		}
		#presearchPackage .column{
			float: left;
			width: 50%;
			padding: 5px;
		}
		.dark #presearchPackage .input{
			background-color: rgba(56,56,56,var(--tw-bg-opacity));
			border: 1px solid rgba(56,56,56,var(--tw-bg-opacity));
			color:#ffffff;
		}
		.dark #presearchPackage .row{
			background-color: rgba(25,25,25,var(--tw-bg-opacity));
		}
		.dark #presearchPackage .label{
			color:#ffffff;
		}
		@media (max-width: 800px) {
		#presearchPackage .column {
			width: 100%;
		}
		
	</style>

  
  	<script>
		if(${queryUnit}===0){
			document.getElementById("Feet").value=${queryUnitValue};
			feetConverter(${queryUnitValue});
		} 
		if(${queryUnit}===1){
			document.getElementById("Meters").value=${queryUnitValue};
			metersConverter(${queryUnitValue});
		}
		if(${queryUnit}===2){
			document.getElementById("Inches").value=${queryUnitValue};
			inchesConverter(${queryUnitValue});
		}
		if(${queryUnit}===3) {
			document.getElementById("Cm").value=${queryUnitValue};
			cmConverter(${queryUnitValue});
		}
		if(${queryUnit}===4){
			document.getElementById("Yards").value=${queryUnitValue};
			yardsConverter(${queryUnitValue});
		}
		if(${queryUnit}===5){
			document.getElementById("Kilometers").value=${queryUnitValue};
			kilometersConverter(${queryUnitValue});
		} 
		if(${queryUnit}===6){
			document.getElementById("Miles").value=${queryUnitValue};
			milesConverter(${queryUnitValue});
		}

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