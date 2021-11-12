'use strict';

function temperatureConverter(queryUnitValue, queryUnit) {
	if (isNaN(queryUnitValue)) return null;
	//0="fahrenheit"
	//1="celsius"
	//2="kelvin"
	if (queryUnit !== 0 && queryUnit !== 1 && queryUnit !== 2) return null;
	return `
	
	<div id="presearchPackage">
	<div class="row">
		<div class="column">
			<label class="label">Fahrenheit</label>
			<input class="input" id="Fahrenheit" type="number" placeholder="Fahrenheit" oninput="fahrenheitConverter(this.value)" onchange="fahrenheitConverter(this.value)">
  		</div>
		<div class="column">
		  	<label class="label">Celsius</label>
		  	<input class="input" id="Celsius" type="number" placeholder="Celsius" oninput="celsiusConverter(this.value)" onchange="celsiusConverter(this.value)">
		</div>
		<div class="column">
			<label class="label">Kelvin</label>
			<input class="input" id="Kelvin" type="number" placeholder="Kelvin" oninput="kelvinConverter(this.value)" onchange="kelvinConverter(this.value)">
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
		
		if(${queryUnit}===1){
			document.getElementById("Fahrenheit").value=${queryUnitValue};
			fahrenheitConverter(${queryUnitValue})
		} 
		if(${queryUnit}===2){
			document.getElementById("Celsius").value=${queryUnitValue};
			celsiusConverter(${queryUnitValue})
		} 
		if(${queryUnit}===3){
			document.getElementById("Kelvin").value=${queryUnitValue};
			kelvinConverter(${queryUnitValue})
		} 

		
  		function fahrenheitConverter(valNum) {
			valNum = parseFloat(valNum);
			document.getElementById("Celsius").value=(valNum-32)/1.8;
			document.getElementById("Kelvin").value=((valNum-32)/1.8)+273.15;
  		}
		function celsiusConverter(valNum) {
			valNum = parseFloat(valNum);
			document.getElementById("Fahrenheit").value=(valNum*1.8)+32;
			document.getElementById("Kelvin").value=valNum+273.15;
		} 
		function kelvinConverter(valNum) {
			valNum = parseFloat(valNum);
			document.getElementById("Fahrenheit").value=((valNum-273.15)*1.8)+32;
			document.getElementById("Celsius").value=valNum-273.15;
		} 
  	</script>

	`
}
module.exports = { temperatureConverter }