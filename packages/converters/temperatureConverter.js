'use strict';

function temperatureConverter(query) {
	return `
	
	<div id="presearchPackage">
		<div>
			<label>Fahrenheit</label>
			<input id="Fahrenheit" type="number" placeholder="Fahrenheit" oninput="fahrenheitConverter(this.value)" onchange="fahrenheitConverter(this.value)">
  		</div>
		<div>
		  	<label>Celsius</label>
		  	<input id="Celsius" type="number" placeholder="Celsius" oninput="celsiusConverter(this.value)" onchange="celsiusConverter(this.value)">
		</div>
		<div>
			<label>Kelvin</label>
			<input id="Kelvin" type="number" placeholder="Kelvin" oninput="kelvinConverter(this.value)" onchange="kelvinConverter(this.value)">
	  	</div>
	</div>

  
  	<script>
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