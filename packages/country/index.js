'use strict';
const countryData = require('world-countries')



async function country(query, API_KEY) {
	var i,j,k;
	var country
	var language,currency
	var languages = []
	var resultCurrency = []

	query = query ? query.toLowerCase() : "";

	for(i=0;i<countryData.length;i++){
		if (query.includes(countryData[i].name.common.toLowerCase())){
			country = countryData[i]
			console.log(country)
			
			//For language
			language = (country.languages)
			for(j in language){
				languages.push(language[j])
			}
			
			//For Cuurency
			currency = country.currencies
			for(k in currency){
				resultCurrency.push(currency[k])
			}

			break;
		}
	}
	// here you need to return HTML code for your package. You can use <style> and <script> tags
	// you need to keep <div id="presearchPackage"> here, you can remove everything else
	return `
	<div id="presearchPackage">
		<span class="mycolor">
		<b><h2> ${country.name.official} (${country.cioc})</h2></b><br>

		Capital City: ${country.capital}<br>
		
		Region: ${country.region}<br>

		Language: ${languages}<br>

		Currency:  ${resultCurrency[0].name}<br>

		Currency Symbol: ${resultCurrency[0].symbol}<br>
		
		Total Area: ${country.area} sq km<br>
		
		Country Calling Code : ${country.idd.root}${country.idd.suffixes}<br>

		Lattitude : ${country.latlng[0]} N<br>

		Longitude : ${country.latlng[1]} E<br>
		
		</span>

	</div>
	<!-- example styles - remember to use #presearchPackage before each class -->
	<style>
		/* styles for dark mode should have .dark before */
		.dark #presearchPackage .mycolor {
			color: white;
		}
		#presearchPackage .mycolor {
			color: black;
			font-family: "Times New Roman";
		}
	</style>
	`;
}


async function trigger(query) {
	var i;	

	if (query) {
		
		query = query ? query.toLowerCase() : "";
		for(i=0;i<countryData.length;i++){
			if (query.includes(countryData[i].name.common.toLowerCase()) ) return true;
		}
		
	}
	
	return false;
}

module.exports = { country, trigger };