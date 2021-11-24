'use strict';

async function DidYouMean(query, API_KEY) {

	return `
	<div id="presearchPackage">
		<span class="myColor">Did You Mean</span>
	</div>
	<style>
		.dark #presearchPackage .myColor {
			color: yellow;
		}
		#presearchPackage .myColor {
			color: green;
			cursor: pointer;
		}
	</style>
	<script>
		document.querySelector(".myColor").addEventListener("click", () => alert("clicked!"));
	</script>
	`;
}

async function trigger(query) {
	if (query) {
		query = query ? query.toLowerCase() : "";
		if (query === "did you mean") return true;
	}

	return false;
}

module.exports = { DidYouMean, trigger };