"use strict";
const { EmojiAPI } = require("emoji-api");
const emoji_data = new EmojiAPI();

async function emoji(query, API_KEY) {
  let details = await emoji_data.get(query);

  return `
	<div id="presearchPackage">
		<h1 class="mycolor">${details.name} - ${details.emoji}</h1>
		<h2 class="mycolor">Unicode : ${details.unicode}</h2>
		<p class="mycolor">Description : ${details.description}</p>
<div class="imageContainer">
		<div>
			<img src=${details.images[0].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[0].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[1].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[1].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[2].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[2].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[3].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[3].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[4].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[4].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[5].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[5].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[6].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[6].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[7].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[7].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[8].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[8].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[9].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[9].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[10].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[10].vendor}</figcaption>
		</div>

		<div>
			<img src=${details.images[11].url} alt="Girl in a jacket" width="50" height="60">
			<figcaption>${details.images[11].vendor}</figcaption>
		</div>

	</div>	
	</div>
	<!-- example styles - remember to use #presearchPackage before each class -->
	<style>
		/* styles for dark mode should have .dark before */
		.dark #presearchPackage .mycolor {
			color: yellow;
		}
		#presearchPackage .mycolor {
			color: green;
		
		}
			#presearchPackage .imageContainer {
			 display: flex;
		}
	</style>
	`;
}

async function trigger(query) {
  try {
    const data = await emoji_data.get(query);
    if (data.emoji === query) return true;
  } catch (error) {
    return false;
  }
}

module.exports = { emoji, trigger };
