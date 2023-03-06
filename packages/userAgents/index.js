'use strict';

async function userAgents() {
	return `
	<div id="presearchPackage">
		<span id="agentSpan">Your User Agent</span>
		<br>
		<code id="agent" >Welp this is embarrassing, failed to get user agent </code>
	</div>
	<!-- example styles - remember to use #presearchPackage before each class -->
	<style>
		.dark #presearchPackage #agentSpan {
			color: white;
		}
		#presearchPackage #agentSpan {
			color: black;
		}
		.dark #presearchPackage #agent {
			color: white;
		}
		#presearchPackage #agent {
			color: black;
		}
	</style>
	<script>
		let agent = navigator.userAgent;	
		document.getElementById("agent").textContent = agent;
	</script>
	`;
}
async function trigger(query) {
	if (query) {
		query = query ? query.toLowerCase() : "";
		if (query === "whats my user agent" || "user agent" || "useragent") return true;
	}
	return false;
}

module.exports = { userAgents, trigger };