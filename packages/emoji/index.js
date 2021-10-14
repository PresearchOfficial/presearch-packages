"use strict";
const { EmojiAPI } = require("emoji-api");
const emoji_data = new EmojiAPI();

async function emoji(query, API_KEY) {
  let emoji_details = await emoji_data.get(query);

  return `
<div id="presearchPackage">
  <div class="container">

  <div class="left-column">
	  <div class="left-column-title">
		  <h1 class="left-column-title-text">${emoji_details.emoji} ${emoji_details.name}</h1>	 
	  </div>
	  <div class="unicode-container">
		  <h3 class="unicode-text">Unicode: ${emoji_details.unicode}</h3>		 
	  </div>
	  <div class="images-container">
          <div class="image-container">
            <img class="emoji-image" src=${emoji_details.images[4].url} alt=${emoji_details.name}  width="50" height="60">
            <figcaption class="img-caption">${emoji_details.images[4].vendor}</figcaption>
          </div>
          <div class="image-container">
            <img class="emoji-image" src=${emoji_details.images[6].url} alt=${emoji_details.name}  width="50" height="60">
            <figcaption class="img-caption">${emoji_details.images[6].vendor}</figcaption>
          </div>
          <div class="image-container">
            <img class="emoji-image" src=${emoji_details.images[5].url} alt=${emoji_details.name}  width="50" height="60">
            <figcaption class="img-caption">${emoji_details.images[5].vendor}</figcaption>
          </div>
          <div class="image-container">
            <img class="emoji-image" src=${emoji_details.images[0].url} alt=${emoji_details.name}  width="50" height="60">
            <figcaption class="img-caption">${emoji_details.images[0].vendor}</figcaption>
          </div>
          <div class="image-container">
            <img class="emoji-image" src=${emoji_details.images[2].url} alt=${emoji_details.name}  width="50" height="60">
            <figcaption class="img-caption">${emoji_details.images[2].vendor}</figcaption>
          </div>
          <div class="image-container">
            <img class="emoji-image" src=${emoji_details.images[3].url} alt=${emoji_details.name}  width="50" height="60">
            <figcaption class="img-caption">${emoji_details.images[3].vendor}</figcaption>
          </div>
      </div>
  </div>

      <div class="right-column">
        <div class="right-column-title">
            <h2 class="right-column-title-text">Description</h2>
            <hr/>
            <br/>
            <p class="description-text">${emoji_details.description}</p>
        </div>
      </div>

  </div>
</div>
<style>
	#presearchPackage	.container {
  display: flex;
  flex-wrap: wrap;
}
#presearchPackage .left-column {
  padding: 10px;
  flex: 50%;
}
#presearchPackage .right-column {
  padding: 10px;
  flex: 50%;
}
 #presearchPackage .image-container{
  padding: 4px;
  float: left;
  width: 33.33%;
  padding: 10px;
}
#presearchPackage .img-caption {
  font-style: italic;
  padding: 2px;
  text-align: center;
}
#presearchPackage .emoji-image{
    display: block;
    margin-left: auto;
    margin-right: auto
}
#presearchPackage .images-container{
   padding:10px;
}
#presearchPackage .unicode-container{
  padding:10px;
}
 .dark #presearchPackage .left-column-title-text {
			color: #D1D5DB;
		}
.dark #presearchPackage .img-caption {
  color: #D1D5DB;
}
.dark #presearchPackage .unicode-text{
  color: #D1D5DB;
}
.dark #presearchPackage .right-column-title-text{
  color: #D1D5DB;
}
.dark #presearchPackage .description-text{
  color: #D1D5DB;
}
@media (max-width: 800px) {
 #presearchPackage .right-column, .left-column {
    flex: 100%;
  }
  @media screen and (max-width: 800px) {
  #presearchPackage .image-container {
    width: 50%;
  }
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
