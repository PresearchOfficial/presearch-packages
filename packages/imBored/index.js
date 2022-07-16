'use strict';

const { default: axios } = require("axios");

async function imBored() {
	// returns a random integer between 0 and 9
	const randomActivity = await axios.get("http://www.boredapi.com/api/activity/")
	const activityReturned = randomActivity && randomActivity.data
	const activityData = activityReturned ? randomActivity.data : null
	const activity = activityData ? activityData.activity : "I couldn't decide, Sorry!"
	const activityType = activityData ? `<div class="typeTag">
		Type: ${activityData.type}
		</div>`: `<div></div>`
	const activityParticipants = activityData ? `<div class="participantsTag">
		Participants: ${activityData.participants}
		</div>`: `<div></div>`
	const activityAccessibility = activityData ? `<div class="accessibilityTag">
		${getAccessibilityRanges(activityData.accessibility)}
		</div>`: `<div></div>`
	const activityPrice = activityData ? `<div class="priceTag">
		${getPriceRanges(activityData.price)}
		</div>`: `<div></div>`
	// here you need to return HTML code for your package. You can use <style> and <script> tags
	// you need to keep <div id="presearchPackage"> here, you can remove everything else
	return `
		<div id="presearchPackage">
			<span class="mycolor">Here's a random activity for you: ${activity}</span>
		</div>
		${activityType}
		${activityParticipants}
		${activityAccessibility}
		${activityPrice}
		<!-- example styles - remember to use #presearchPackage before each class -->
		<style>
			/* styles for dark mode should have .dark before */
			.dark #presearchPackage .mycolor {
				color: white;
			}
			#presearchPackage .mycolor {
				color: black;
				cursor: pointer;
			}
			.typeTag {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				padding: 4px 10px;
				border-radius: 5px;
				background-color: #09C;
				color: white;
				margin: 5px 0 5px 15px;
				width: 20%;
			}
			.priceTag {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				padding: 4px 10px;
				border-radius: 5px;
				background-color: #0c9;
				color: white;
				margin: 5px 0 5px 15px;
				width: 20%;
			}
			.accessibilityTag {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				padding: 4px 10px;
				border-radius: 5px;
				background-color: #444;
				color: white;
				margin: 5px 0 5px 15px;
				width: 20%;
			}
			.participantsTag {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				padding: 4px 10px;
				border-radius: 5px;
				background-color: orange;
				color: white;
				margin: 5px 0 5px 15px;
				width: 20%;
			}
		</style>
	`;
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
async function trigger(query) {
	if (query) {
		// convert query to lower case, to trigger the package with queries like 'Random number', 'RANDOM NUMBER' etc.
		query = query ? query.toLowerCase() : "";
		if (query === "i'm bored" || query === "im bored") return true;
	}
	// you need to return false when the query should not trigger your package
	return false;
}

function getAccessibilityRanges(accessibilityValue) {
	switch(true) {
		case (accessibilityValue <= 0.33):
			return 'Very accessible!'
			break;
		case (accessibilityValue <= 0.67):
			return 'Accessible'
			break;
		case (accessibilityValue <= 1):
			return 'Less Accessible'
			break;
		default:
			return 'Not sure how accessible!'
	}
}

function getPriceRanges(priceValue) {
	switch(true) {
		case (priceValue <= 0.33):
			return 'Low Cost'
			break;
		case (priceValue <= 0.66):
			return 'Medium Cost'
			break;
		case (priceValue <= 1):
			return 'Higher Cost'
			break;
		default:
			return 'Not sure about the cost!'
	}
}

module.exports = { imBored, trigger };