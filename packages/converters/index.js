'use strict';

async function converters(query, API_KEY) {
	// returns a random integer between 0 and 9
	const randomNumber = Math.floor(Math.random() * 10);
	// here you need to return HTML code for your package. You can use <style> and <script> tags
	// you need to keep <div id="presearchPackage"> here, you can remove everything else
	return `
	<div id="presearchPackage">
		<span class="mycolor">Random number: ${randomNumber}</span>
	</div>
	<!-- example styles - remember to use #presearchPackage before each class -->
	<style>
		/* styles for dark mode should have .dark before */
		.dark #presearchPackage .mycolor {
			color: yellow;
		}
		#presearchPackage .mycolor {
			color: green;
			cursor: pointer;
		}
	</style>
	<!-- example javascript -->
	<script>
		document.querySelector(".mycolor").addEventListener("click", () => alert("clicked!"));
	</script>
	`;
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
async function trigger(query) {
	if (query) {
		// convert query to lower case, to trigger the package with queries like 'Random number', 'RANDOM NUMBER' etc.
		query = query ? query.toLowerCase() : "";
		if (query === "random number") return true;
	}
	// you need to return false when the query should not trigger your package
	return false;
}

module.exports = { converters, trigger };