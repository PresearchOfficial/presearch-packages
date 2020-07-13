"use strict";
const fetch = require("node-fetch");
const coin_list = require("./coin_list.json");

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/";

async function cryptoInfo(query) {
  try {
    query = query.toLowerCase();
    let coin_id;
    for (let coin of coin_list) {
      if (
        (coin.id === query ||
          coin.name.toLowerCase() === query ||
          coin.symbol === query) &&
        !coin.symbol.toLowerCase().includes(".cx")
      ) {
        coin_id = coin.id;
        break;
      }
    }

    const request = await fetch(COINGECKO_API + coin_id, {
      method: "get",
      headers: {
        Accept: "application/json",
      },
    });

    const coin = await request.json();
    if (!coin.market_data)
      return "Error! Unable to connect to CoinGecko. Please try again later";

    const { name, symbol, market_cap_rank } = coin;
    const logo = coin.image.small;
    const price = coin.market_data.current_price.usd;
    const tag = coin.asset_platform_id ? "Token" : "Coin";
    const {
      total_supply,
      circulating_supply,
      last_updated,
      market_cap,
      total_volume,
      price_change_percentage_24h,
      price_change_percentage_7d,
    } = coin.market_data;
    const {
      homepage,
      blockchain_site,
      official_forum_url,
      chat_url,
      twitter_screen_name,
      subreddit_url,
      repos_url,
      announcement_url,
    } = coin.links;

    const formatNumber = (num) => {
      var parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    };

    return `
      <div class="answerCol cryptoAnswerCol">
        <div class="answerRow">
          <div class="mainCol cryptoMainCol">
          <div class="mainCol1">
            <div class="headerRow">
              ${logo ? `<img src="${logo}" class="logo" alt="" />` : ``}
              ${
                name && symbol
                  ? `<h2 class="name">${name} (${symbol.toUpperCase()})</h2>`
                  : ``
              }
              <div class="tag" style="backgroundColor: #0c9">
                ${tag.toUpperCase()}
              </div>
            </div>
            <div class="priceRow">
              ${
                price
                  ? `<div class="priceItem">
                    <p class="priceLabel">Price</p>
                    <h1
                      class="price"
                      style="${
                        price_change_percentage_24h > 0
                          ? `color: #00b386`
                          : `color: #ff5050`
                      }"
                    >
                      ${formatNumber(price.toFixed(4))}<span> USD</span>
                    </h1>
                  </div>`
                  : ``
              }
              ${
                price_change_percentage_24h
                  ? `<div class="priceItem">
                    <p class="priceLabel">Daily</p>
                    <h1
                      class="price"
                      style="${
                        price_change_percentage_24h > 0
                          ? `color: #00b386`
                          : `color: #ff5050`
                      }"
                    >
                      ${price_change_percentage_24h.toFixed(4)}%
                    </h1>
                  </div>`
                  : ``
              }
              ${
                price_change_percentage_7d
                  ? `<div class="priceItem">
                    <p class="priceLabel">Weekly</p>
                    <h1
                      class="price"
                      style="${
                        price_change_percentage_7d > 0
                          ? `color: #00b386`
                          : `color: #ff5050`
                      }"
                    >
                      ${price_change_percentage_7d.toFixed(4)}%
                    </h1>
                  </div>`
                  : ``
              }
            </div>
            <div class="linkContain">
                <a href="https://www.coingecko.com/en/coins/${
                  coin.id
                }" class="linkItem">
                    <svg xmlns="http://www.w3.org/2000/svg" width="295" height="295" viewBox="0 0 295 295"><g id="coingecko" transform="translate(9.499 10.501)"><path id="Path_34" data-name="Path 34" d="M310,183A138,138,0,1,1,171.4,45.61,138,138,0,0,1,310,183Z" transform="translate(-34 -46.61)" fill="none" stroke="#4e616c" stroke-width="19"/><path id="Path_36" data-name="Path 36" d="M174.35,64.27a70.18,70.18,0,0,1,24.53,0,74.66,74.66,0,0,1,23.43,7.85c7.28,4,13.57,9.43,19.83,14.52s12.49,10.3,18.42,16a93.381,93.381,0,0,1,15.71,19,108.069,108.069,0,0,1,11,22.17c5.33,15.66,7.18,32.53,4.52,48.62H291c-2.67-15.95-6.29-31.15-12-45.61a178.006,178.006,0,0,0-9.44-21.25,208.8,208.8,0,0,0-12.42-19.93,72.3,72.3,0,0,0-16.64-16.8c-6.48-4.62-13.93-7.61-21.14-10.45S205,72.61,197.48,70.45s-15.16-3.78-23.14-5.35Z" transform="translate(-34 -45.61)" fill="none"/><path id="Path_37" data-name="Path 37" d="M236.74,138c-9.26-2.68-18.86-6.48-28.58-10.32-.56-2.44-2.72-5.48-7.09-9.19-6.35-5.51-18.28-5.37-28.59-2.93-11.38-2.68-22.62-3.63-33.41-1-88.25,24.31-38.21,83.62-70.61,143.24,4.61,9.78,54.3,66.84,126.2,51.53,0,0-24.59-59.09,30.9-87.45C270.57,198.79,303.09,156.07,236.74,138Z" transform="translate(-34 -45.61)" fill="#4e616c"/><path id="Path_38" data-name="Path 38" d="M247.64,176.81a5.35,5.35,0,1,1-5.38-5.32,5.35,5.35,0,0,1,5.38,5.32Z" transform="translate(-34 -45.61)" fill="#fff"/><path id="Path_39" data-name="Path 39" d="M172.48,115.52c6.43.46,29.68,8,35.68,12.12-5-14.5-21.83-16.43-35.68-12.12Z" transform="translate(-34 -45.61)" fill="#4e616c"/><path id="Path_40" data-name="Path 40" d="M178.6,152.19a24.68,24.68,0,1,1-24.677-24.67A24.68,24.68,0,0,1,178.6,152.19Z" transform="translate(-34 -45.61)" fill="#fff"/><path id="Path_41" data-name="Path 41" d="M171.28,152.41a17.36,17.36,0,1,1-17.36-17.36A17.36,17.36,0,0,1,171.28,152.41Z" transform="translate(-34 -45.61)" fill="#4e616c"/><path id="Path_42" data-name="Path 42" d="M267.63,187.69c-20,14.09-42.74,24.78-75,24.78-15.1,0-18.16-16-28.14-8.18-5.15,4.06-23.31,13.14-37.72,12.45S89,207.6,82.49,176.84c-2.58,30.76-3.9,53.42-15.45,79.39,23,36.83,77.84,65.24,127.62,53-5.35-37.35,27.29-73.93,45.68-92.65,7-7.09,20.3-18.66,27.29-28.91Z" transform="translate(-34 -45.61)" fill="#4e616c"/><path id="Path_43" data-name="Path 43" d="M266.85,188.61c-6.21,5.66-13.6,9.85-21.12,13.55a134.24,134.24,0,0,1-23.7,8.63c-8.16,2.11-16.67,3.7-25.29,2.92S179.31,210,173.6,203.54l.27-.31c7,4.54,15.08,6.14,23.12,6.37a108.569,108.569,0,0,0,24.3-2,132.339,132.339,0,0,0,23.61-7.3c7.63-3.15,15.18-6.8,21.68-12Z" transform="translate(-34 -45.61)" fill="#fff"/></g></svg>
                    <span>View on CoinGecko</span>
                </a>
              ${
                homepage[0]
                  ? `<a href="${homepage[0]}" class="linkItem">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" class=""><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z" class=""></path></svg>
                      <span>Website</span>
                    </a>`
                  : ""
              }
              ${
                repos_url.github[0]
                  ? `<a href="${repos_url.github[0]}" class="linkItem">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class=""><path fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z" class=""></path></svg>
                  <span>Source Code</span>
                </a>`
                  : ""
              }
              ${
                announcement_url[0]
                  ? `<a href="${announcement_url[0]}" class="linkItem">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bullhorn" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class=""><path fill="currentColor" d="M576 240c0-23.63-12.95-44.04-32-55.12V32.01C544 23.26 537.02 0 512 0c-7.12 0-14.19 2.38-19.98 7.02l-85.03 68.03C364.28 109.19 310.66 128 256 128H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h33.7c-1.39 10.48-2.18 21.14-2.18 32 0 39.77 9.26 77.35 25.56 110.94 5.19 10.69 16.52 17.06 28.4 17.06h74.28c26.05 0 41.69-29.84 25.9-50.56-16.4-21.52-26.15-48.36-26.15-77.44 0-11.11 1.62-21.79 4.41-32H256c54.66 0 108.28 18.81 150.98 52.95l85.03 68.03a32.023 32.023 0 0 0 19.98 7.02c24.92 0 32-22.78 32-32V295.13C563.05 284.04 576 263.63 576 240zm-96 141.42l-33.05-26.44C392.95 311.78 325.12 288 256 288v-96c69.12 0 136.95-23.78 190.95-66.98L480 98.58v282.84z" class=""></path></svg>
                      <span>Announcement</span>
                    </a>`
                  : ""
              }
              ${
                chat_url[0]
                  ? `<a href="${chat_url[0]}" class="linkItem">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z" class=""></path></svg>
                      <span>Chat</span>
                    </a>`
                  : ""
              }
              ${
                subreddit_url
                  ? `<a href="${subreddit_url}" class="linkItem">
                      <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="reddit-alien" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M440.3 203.5c-15 0-28.2 6.2-37.9 15.9-35.7-24.7-83.8-40.6-137.1-42.3L293 52.3l88.2 19.8c0 21.6 17.6 39.2 39.2 39.2 22 0 39.7-18.1 39.7-39.7s-17.6-39.7-39.7-39.7c-15.4 0-28.7 9.3-35.3 22l-97.4-21.6c-4.9-1.3-9.7 2.2-11 7.1L246.3 177c-52.9 2.2-100.5 18.1-136.3 42.8-9.7-10.1-23.4-16.3-38.4-16.3-55.6 0-73.8 74.6-22.9 100.1-1.8 7.9-2.6 16.3-2.6 24.7 0 83.8 94.4 151.7 210.3 151.7 116.4 0 210.8-67.9 210.8-151.7 0-8.4-.9-17.2-3.1-25.1 49.9-25.6 31.5-99.7-23.8-99.7zM129.4 308.9c0-22 17.6-39.7 39.7-39.7 21.6 0 39.2 17.6 39.2 39.7 0 21.6-17.6 39.2-39.2 39.2-22 .1-39.7-17.6-39.7-39.2zm214.3 93.5c-36.4 36.4-139.1 36.4-175.5 0-4-3.5-4-9.7 0-13.7 3.5-3.5 9.7-3.5 13.2 0 27.8 28.5 120 29 149 0 3.5-3.5 9.7-3.5 13.2 0 4.1 4 4.1 10.2.1 13.7zm-.8-54.2c-21.6 0-39.2-17.6-39.2-39.2 0-22 17.6-39.7 39.2-39.7 22 0 39.7 17.6 39.7 39.7-.1 21.5-17.7 39.2-39.7 39.2z" class=""></path></svg>
                      <span>Reddit</span>
                    </a>`
                  : ""
              }
              ${
                twitter_screen_name
                  ? `<a href="https://twitter.com/${twitter_screen_name}" class="linkItem">
                      <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class=""><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" class=""></path></svg>
                      <span>Twitter</span>
                    </a>`
                  : ""
              }
              ${
                blockchain_site && blockchain_site[0]
                  ? `<div class="explorer">
                      <div class="explorerTitle"><?xml version="1.0" encoding="UTF-8"?><svg width="15px" class="feather feather-search" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg><span>Explore more</span></div>`
                  : ""
              }
              ${
                blockchain_site && blockchain_site[0]
                  ? blockchain_site
                      .map((item) =>
                        item
                          ? `<div class="explorerOuter">
                          <a href="${item}" class="explorerLink">
                            <span>${item}</span>
                          </a>
                        </div>`
                          : ""
                      )
                      .join("")
                  : ""
              }
              ${blockchain_site && blockchain_site[0] ? `</div>` : ""}
              </div>
            ${
              last_updated
                ? `<p class="priceLabel">Last updated on ${new Date(
                    last_updated
                  ).toLocaleString("en-US")}</p>`
                : ``
            }
          </div>
          </div>
          <div class="sideCol cryptoSideContain">
            ${
              market_cap_rank
                ? `<h3 class="rank">Ranked <span>${market_cap_rank}</span> by CoinGecko</h3>`
                : ``
            }
            <div class="supplyContain">
              ${
                market_cap.usd
                  ? `<div class="priceItem">
                    <p class="priceLabel">Market Cap</p>
                    <h1 class="price">${formatNumber(
                      market_cap.usd.toFixed(0)
                    )} <span>USD</span></h1>
                  </div>`
                  : ``
              }
              ${
                total_volume.usd
                  ? `<div class="priceItem">
                    <p class="priceLabel">Volume 24h</p>
                    <h1 class="price">${formatNumber(
                      total_volume.usd.toFixed(0)
                    )} <span>USD</span></h1>
                  </div>`
                  : ``
              }
              ${
                circulating_supply
                  ? `<div class="priceItem">
                    <p class="priceLabel">Circulating Supply</p>
                    <h1 class="price">${formatNumber(circulating_supply)}</h1>
                  </div>`
                  : ``
              }
              ${
                total_supply
                  ? `<div class="priceItem">
                    <p class="priceLabel">Total Supply</p>
                    <h1 class="price">${formatNumber(total_supply)}</h1>
                  </div>`
                  : ``
              }
            </div>
          </div>
        </div>
      </div>
      <style>
        .answerRow {
          display:flex;
        }
        .cryptoAnswerCol {
          flex: 1;
        }
        .answerInner {
          flex: 1;
          display: flex;
          flex-flow: row nowrap;
          width: calc(95% - 70px);
          margin: 15px auto 15px 70px;
          max-width: 1200px;
        }
        .cryptoMainCol {
          padding: 15px;
          box-sizing: border-box;
        }
        .mainCol {
          width: 50%;
          display: flex;
        }
        .cryptoSideContain {
          box-sizing: border-box;
          padding: 0 15px 15px 60px;
        }
        .headerRow {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        }
        .logo {
          height: 30px;
          width: 30px;
          margin-right: 15px;
        }
        .name {
          margin: 0;
          font-size: 24px;
        }
        .tag {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 10px;
          border-radius: 5px;
          background-color: #09C;
          color: white;
          margin: 5px 0 5px 15px;
          font-size: 10px;
        }
        .priceRow {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          padding: 30px 0 10px;
        }
        .priceItem {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding-bottom: 10px;
        }
        .priceLabel {
          font-size: 10px;
          color: #666;
          margin: 0;
        }
        .price {
          font-size: 20px;
          font-weight: normal;
          color: #444;
          margin: 5px 0;
        }
        .price span {
          font-size: 14px;
          color: #666;
        }
        .linkItem {
          display: inline-flex;
          flex-direction: row;
          padding: 8px 10px;
          background-color: #ddd;
          margin: 5px 5px 5px 0;
          border-radius: 5px;
          text-decoration: none;
          transition: opacity .2s;
        }
        .linkItem:hover {
          opacity: 0.6;
        }
        .linkItem span {
          margin-left: 8px;
          font-size: 14px;
          color: #4e616c;
        }
        .linkItem svg {
            display: inline-block;
            height: 1em;
            width: 1em;
            color: #4e616c;
        }
        .explorer {
          padding: 20px 0 15px;
          word-wrap: anywhere;
        }
        .explorerTitle {
          font-size: 14px;
          color: #444;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding-bottom: 10px;
        }
        .explorerTitle span {
          margin-left: 4px;
        }
        .explorerOuter {
          padding: 4px 0;
          overflow: hidden;
        }
        .explorerLink {
          transition: opacity .2s
        }
        .explorerLink:hover {
          opacity: 0.6;
        }
        .explorerLink span {
          color: #1a0dab;
        }
        .explorerLink:visited {
          color: #609;
        }
        .rank {
          margin: 0;
        }
        .rank span {
          background-color: #0c9;
          padding: 0 15px;
          margin: 0 5px;
          border-radius: 20px;
          font-size: 14px;
          min-width: 40px;
          line-height: 40px;
          color: white;
          box-sizing: border-box;
          display: inline-block;
        }
        .supplyContain {
          padding: 20px 0 0;
        }

        @media screen and (max-width: 840px) {
          .answerInner {
            flex-direction: column;
            margin: 0;
            width: 100%;
          }
          .answerRow {
            flex-direction: column;
          }
          .sideContain {
            padding: 0 15px;
          }
          .sideCol {
            padding-left: 20px;
          }
          .priceRow {
            flex-direction: column;
            align-items: flex-start;
          }
          .mainCol {
            width: 100%;
          }
          .mainCol1 {
            width: calc(100vw - 2rem) !important;
          }
          .rank {
            padding-top: 10px;
          }
        }
      </style>
    `;
  } catch (error) {
    console.error(error);
  }
}

async function trigger(query) {
  query = query.toLowerCase();
  for (let coin of coin_list) {
    if (
      (coin.id === query ||
        coin.name.toLowerCase() === query ||
        coin.symbol === query) &&
      !coin.symbol.toLowerCase().includes(".cx")
    )
      return true;
  }

  return false;
}

module.exports = { cryptoInfo, trigger };
