"use strict";
const { EmojiAPI } = require("emoji-api");
const emoji_data = new EmojiAPI();
const emojiRegex = require('emoji-regex');

async function emoji(query, API_KEY) {
  const regex = emojiRegex();
  // get only emoji from the query
  const emoji = query.match(regex)[0];

  /* sample query  = 🥺 */
  const emoji_details = await emoji_data.get(emoji).catch(error => ({error}));

  if (!emoji_details || emoji_details.error) {
    return { error: `Failed to get emoji data from the API. ${emoji_details ? emoji_details.error : ''}` };
  }

  if (
    !(
      emoji_details.emoji &&
      emoji_details.name &&
      emoji_details.unicode &&
      emoji_details.description &&
      emoji_details.images
    )
  ) {
    return { error: "Incomplete emoji data" };
  }

  const vendorList = ["Apple", "Microsoft", "Google", "Twitter", "Facebook", "Messenger"];

  let images_list = emoji_details.images.filter((data) => {
    if (data.url && data.vendor) return data;
  });

  return `
<div id="presearchPackage">
  <div class="container">

    <div class="left-column">
        ${
          emoji_details.emoji && emoji_details.name
            ? ` <div class="left-column-title">
            <h2 class="left-column-title-text">${emoji_details.emoji} ${emoji_details.name}</h2>	 
            </div>`
            : ``
        }
        <div class="unicode-container">
          <h4 class="unicode-text">${
            emoji_details.unicode ? `Unicode: ${emoji_details.unicode}` : ``
          }</h4>		 
        </div>
        ${
          images_list &&
          `<div class="images-container">${images_list
            .map((image, index) =>
              image.url && image.vendor && vendorList.includes(image.vendor)
                ? `<div key="${index}" class="image-container">
                        <img class="emoji-image" src=${image.url} alt=${image.vendor}  width="30" height="40">
                      <figcaption class="img-caption">${image.vendor}</figcaption>
                </div>`
                : ``
            )
            .join("")}
          </div>`
        }
    </div>        
 
    <div class="right-column">
        ${
          emoji_details.description &&
          `<div class="right-column-title">
            <h3 class="right-column-title-text">Description</h3>
            <hr/>
            <br/>
            <p class="description-text">${emoji_details.description}</p>
        </div>`
        }
     </div>

  </div>
</div>

<style>
	#presearchPackage	.container {
  display: flex;
  flex-wrap: wrap;
}
#presearchPackage .left-column {
  padding: 10px 100px 50px 10px;
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
  @media (max-width: 800px) {
 #presearchPackage .left-column {
   padding:10px;
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
  /* sample query  = 🥺 */
  const regex = emojiRegex();
  if (query.match(regex)) {
    return true;
  }
  return false;
}

module.exports = { emoji, trigger };
