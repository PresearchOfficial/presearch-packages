"use strict";
const axios = require("axios");
const coin_list = require("./coin_list.json");
const coin_metadata = require("./coin_metadata.json");

const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/";

async function cryptoInfo(query, API_KEY) {
    try {
        if (!API_KEY) return;
        query = query.toLowerCase();
        let coinId;
        for (let coin of coin_list) {
            if (coin.name.toLowerCase() === query || coin.symbol.toLowerCase() === query || coin.slug.toLowerCase() === query) {
                coinId = coin.id;
                break;
            }
        }

        const headers = { Accept: "application/json", "X-CMC_PRO_API_KEY": API_KEY };

        const [priceInfo, historical] = await Promise.all([
          axios.get(CMC_API_URL + `quotes/latest?id=${coinId}`, { headers }).catch(error => ({error})),
          axios.get(CMC_API_URL + `quotes/historical?id=${coinId}&count=3000&interval=15m`, { headers }).catch(error => ({error}))
        ]);

        // get data about price, supply etc.
        if (!priceInfo || !priceInfo.data || priceInfo.error) return { error: priceInfo.error ? priceInfo.error.message : "Failed to get latest quotes from CMC" };

        const priceData = priceInfo.data.data[coinId];

        // get historical data for price graph
        if (!historical || !historical.data || historical.error) return { error: historical.error ? historical.error.message : "Failed to get historical quotes from CMC" };;

        const historicalData = historical.data.data;
        let { quotes } = historicalData;
        if (!quotes || !quotes.length) return { error: "Failed to get historical quotes from CMC" }
        quotes = quotes.reverse();

        // generate data points of historical data for each period
        const generateDataPoints = (quotes, days) => {
            let counter = 0;
            // returned data points every 15 min, so 24h == 96 data points
            const dataPointsAll = quotes.filter((el, i) => i <= 95 * days);
            // filter them out to get exact 96 data points for each peroid
            const dataPointsFiltered = dataPointsAll.filter((el, i) => {
                if (i === 0) return true;
                counter++;
                if (counter === days) {
                    counter = 0;
                    return true;
                }
                return false;
            });
            return dataPointsFiltered.reverse();
        };

        const periods = {
            "24h": generateDataPoints(quotes, 1),
            "3d": generateDataPoints(quotes, 3),
            "7d": generateDataPoints(quotes, 7),
            "30d": generateDataPoints(quotes, 30),
        };

        const { name, symbol, logo, slug } = coin_metadata[coinId];
        const { website, twitter, chat, explorer, reddit, source_code } = coin_metadata[coinId].urls;
        const { circulating_supply, total_supply, cmc_rank } = priceData;
        const tag = coin_metadata[coinId].platform ? "Token" : "Coin";
        const { price, volume_24h, percent_change_24h, percent_change_7d, market_cap, last_updated } = priceData.quote.USD;

        // filter out low mcap coins
        const MIN_VOLUME = 10000;
        const MIN_RANK = 2000;
        if (volume_24h < MIN_VOLUME || cmc_rank > MIN_RANK) {
          return { returnedNull: true };
        }

        const formatNumber = (num) => {
          var parts = num.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
        };
        let displayPrice;
        if (price < 0.0001) {
          for (let i = 1; i <= 4; i++) {
            let check = Math.pow(10, i)
            if (price * 10000 * check >=1) {
              displayPrice = price.toFixed(4 + i);
              break;
            }
          }
        } else {
          displayPrice = price.toFixed(4);
        }

        return `
      <div class="answerCol cryptoAnswerCol">
        <div class="answerRow">
          <div class="mainCol cryptoMainCol">
          <div class="mainCol1">
            <div class="headerRow">
              ${name && symbol ? `<h2 class="name">${name} (${symbol.toUpperCase()})</h2>` : ``}
              <div class="tag" style="backgroundColor: #0c9">
                ${tag.toUpperCase()}
              </div>
            </div>
            <div class="priceRow">
              ${
                  price
                      ? `<div class="priceItem">
                    <p class="priceLabel">Price</p>
                    <h1 class="price ${percent_change_24h > 0 ? `price-green` : `price-red `}"> 
                      ${displayPrice ? formatNumber(displayPrice) : "<0.00000001"}<span class="textGray400"> USD</span>
                    </h1>
                  </div>`
                      : ``
              }
              ${
                  percent_change_24h
                      ? `<div class="priceItem">
                    <p class="priceLabel">Daily</p>
                    <h1 class="price ${percent_change_24h > 0 ? `price-green` : `price-red `}">
                      ${percent_change_24h.toFixed(4)}%
                    </h1>
                  </div>`
                      : ``
              }
              ${
                  percent_change_7d
                      ? `<div class="priceItem">
                    <p class="priceLabel">Weekly</p>
                    <h1 class="price ${percent_change_7d > 0 ? `price-green` : `price-red `}">
                      ${percent_change_7d.toFixed(4)}%
                    </h1>
                  </div>`
                      : ``
              }
            </div>
            <div class="rangeButtons">
              <p class="textGray buttonActive" style="opacity:.7;" id="button1">24h</p>
              <p class="textGray" style="opacity:.7;" id="button7">7 days</p>
              <p class="textGray" style="opacity:.7;" id="button30">30 days</p>
            </div>
            <div class="graphCointainer" style="position: relative; width:500px; height:300px; margin-bottom:20px; margin-top:-20px" class="bg-white dark:bg-dark-700">
                <canvas id="graph" style="position: absolute; z-index: 1;" width="500" height="300"></canvas>
                <canvas id="info" style="position: absolute; z-index: 3;" width="500" height="300"></canvas>
                <div id="infoBox" class="boxItem" style="display:none; border:0; font-family: Sans-Serif; position: absolute; font-size:14px; z-index: 2; top:0px; left:0px; border-radius:2px; padding: 4px;"></div>
                <div id="infoBoxLeft" class="boxItem" style="display:none; border:0; font-family: Sans-Serif; position: absolute; font-size:11px; z-index: 4; top:0px; left:0px; border-radius:2px; padding: 4px;"></div>
                <div id="infoBoxBottom" class="boxItem" style="display:none; border:0; font-family: Sans-Serif; position: absolute; font-size:11px; z-index: 4; top:0px; left:0px; border-radius:2px; padding: 4px;"></div>
            </div>
            
            ${last_updated ? `<p class="priceLabel textGray">Last updated on ${new Date(last_updated).toLocaleString("en-US")}</p>` : ``}
          
          </div>
          <div class="sideCol cryptoSideContain">
            ${cmc_rank ? `<h3 class="rank"><a href="https://coinmarketcap.com/currencies/${slug}">Ranked <span class="ranking">${cmc_rank}</span> by CoinMarketCap</a></h3>` : ``}
            <div class="supplyContain">
              ${
                  market_cap
                      ? `<div class="priceItem">
                    <p class="priceLabel textGray">Market Cap</p>
                    <h1 class="price textGray">${formatNumber(market_cap.toFixed(0))} <span class="textGray400">USD</span></h1>
                  </div>`
                      : ``
              }
              ${
                  volume_24h
                      ? `<div class="priceItem">
                    <p class="priceLabel textGray">Volume 24h</p>
                    <h1 class="price textGray">${formatNumber(volume_24h.toFixed(0))} <span class="textGray400">USD</span></h1>
                  </div>`
                      : ``
              }
              ${
                  circulating_supply
                      ? `<div class="priceItem">
                    <p class="priceLabel textGray">Circulating Supply</p>
                    <h1 class="price textGray">${formatNumber(circulating_supply.toFixed(0))}</h1>
                  </div>`
                      : ``
              }
              ${
                  total_supply
                      ? `<div class="priceItem">
                    <p class="priceLabel textGray">Total Supply</p>
                    <h1 class="price textGray">${formatNumber(total_supply.toFixed(0))}</h1>
                  </div>`
                      : ``
              }
            </div>
            <div class="linkContain">
              <div class="buttons">
                <a href="https://coinmarketcap.com/currencies/${slug}" class="linkItem">
                <svg style="width: 18px; height: 18px;" fill="currentColor" class="textGray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 358.5 361.9"><path class="prefix__st0" d="M180.1 19C90.7 19 18 91.5 18 181.1c0 89.5 72.7 162 162.1 162 44.3 0 84.6-17.8 113.7-46.6 2.2-7.2 3.9-19-5.4-21.6-6-1.6-11.3-.7-15.6 1.1-24 23.2-56.8 37.6-92.7 37.6-39 0-74.3-16.8-98.7-43.5l69.7-109.5v55.6s2 24.8 20.1 29.1S202 224 202 224l41.6-64.4v36.3s2 49.1 48.5 49.2c1.6 0 3.3 0 4.7-.3 0 0 0 .1-.1.1.8-.1 1.8-.3 2.7-.4 5.2-.7 9.6-2.3 13.7-4.3 15.5-7.5 23-21.1 26.3-29.4.1-.8.3-1.6.4-2.4 1.2-7.6 2-15.2 2.2-23v-4.2C342.3 91.5 269.6 19 180.1 19zm111.3 197c-16 .3-18.3-15.6-18.3-15.6s1.8-40-.3-51.9c-2-11.9-4.7-23.7-20.1-27.5-15.3-3.8-28.2 13.6-28.2 13.6l-43.8 68.9s1.8-57.6-.5-74.3c-2.4-16.7-10.7-20.3-19.9-21.7-9.2-1.4-18.3 12.2-18.3 12.2L62.7 243.5c-10.2-18.8-16-40.5-16-63.4 0-73.7 59.8-133.5 133.5-133.5S313.8 106.3 313.8 180c0 6.9-.5 13.7-1.5 20.3-4.6 7.1-11.8 15.5-20.9 15.7z"/></svg>
                    <span class="textGray">View on CoinMarketCap</span>
                </a>
              ${
                  website[0]
                      ? `<a href="${website[0]}" class="linkItem">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" class="textGray"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z" class=""></path></svg>
                      <span class="textGray">Website</span>
                    </a>`
                      : ""
              }
              ${
                  source_code[0]
                      ? `<a href="${source_code[0]}" class="linkItem">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="textGray"><path fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z" class=""></path></svg>
                  <span class="textGray">Source Code</span>
                </a>`
                      : ""
              }
              ${
                  chat[0]
                      ? `<a href="${chat[0]}" class="linkItem">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="comment" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="textGray"><path fill="currentColor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z" class=""></path></svg>
                      <span class="textGray">Chat</span>
                    </a>`
                      : ""
              }
              ${
                  reddit[0]
                      ? `<a href="${reddit[0]}" class="linkItem">
                      <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="reddit-alien" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="textGray"><path fill="currentColor" d="M440.3 203.5c-15 0-28.2 6.2-37.9 15.9-35.7-24.7-83.8-40.6-137.1-42.3L293 52.3l88.2 19.8c0 21.6 17.6 39.2 39.2 39.2 22 0 39.7-18.1 39.7-39.7s-17.6-39.7-39.7-39.7c-15.4 0-28.7 9.3-35.3 22l-97.4-21.6c-4.9-1.3-9.7 2.2-11 7.1L246.3 177c-52.9 2.2-100.5 18.1-136.3 42.8-9.7-10.1-23.4-16.3-38.4-16.3-55.6 0-73.8 74.6-22.9 100.1-1.8 7.9-2.6 16.3-2.6 24.7 0 83.8 94.4 151.7 210.3 151.7 116.4 0 210.8-67.9 210.8-151.7 0-8.4-.9-17.2-3.1-25.1 49.9-25.6 31.5-99.7-23.8-99.7zM129.4 308.9c0-22 17.6-39.7 39.7-39.7 21.6 0 39.2 17.6 39.2 39.7 0 21.6-17.6 39.2-39.2 39.2-22 .1-39.7-17.6-39.7-39.2zm214.3 93.5c-36.4 36.4-139.1 36.4-175.5 0-4-3.5-4-9.7 0-13.7 3.5-3.5 9.7-3.5 13.2 0 27.8 28.5 120 29 149 0 3.5-3.5 9.7-3.5 13.2 0 4.1 4 4.1 10.2.1 13.7zm-.8-54.2c-21.6 0-39.2-17.6-39.2-39.2 0-22 17.6-39.7 39.2-39.7 22 0 39.7 17.6 39.7 39.7-.1 21.5-17.7 39.2-39.7 39.2z" class=""></path></svg>
                      <span class="textGray">Reddit</span>
                    </a>`
                      : ""
              }
              ${
                  twitter[0]
                      ? `<a href="${twitter[0]}" class="linkItem">
                      <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="textGray"><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" class=""></path></svg>
                      <span class="textGray">Twitter</span>
                    </a>`
                      : ""
              }
                </div>
              ${
                  explorer && explorer[0]
                      ? `<div class="explorer">
                      <div class="explorerTitle textGray"><?xml version="1.0" encoding="UTF-8"?><svg width="15px" class="feather feather-search" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg><span>Explore more</span></div><div class="explorerContainer">`
                      : ""
              }
              ${
                  explorer && explorer[0]
                      ? explorer
                            .map((item, i) =>
                                item
                                    ? `<div class="explorerOuter">
                          <a href="${item}" class="explorerLink">
                            <span class="textBlue300">${item.split("://")[1].split("/")[0]}</span>
                          </a>${(i < explorer.length -1) ? "<span style='margin-left:-4px; margin-right:4px;'>,</span>" : ""} 
                        </div>`
                                    : ""
                            )
                            .join("")
                      : ""
              }
              ${explorer && explorer[0] ? `</div></div>` : ""}
              </div>
              </div>
          </div>
        </div>
      </div>
      <style>
        .buttonActive {
          opacity: 1 !important;
        }
        .rangeButtons {
          display:flex;
          flex-wrap: wrap;
          margin-bottom: 10px;
          margin-top:-10px;
          position: relative;
          z-index:5;
        }
        .rangeButtons p {
          font-size:14px;
          margin-right:10px;
          padding: 5px 7px;
          background-color: #ddd;
          margin: 5px 5px 5px 0;
          border-radius: 5px;
          transition: opacity .2s;
          cursor: pointer;
          color:#4e616c;
        }
        .rangeButtons p:hover {
          opacity:.6
        }
        .answerRow .price-red {
          color: #ff5050;
        }
        .answerRow .price-green {
          color: #00b386;
        }
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
          display: flex;
        }
        .buttons {
          display: flex;
          flex-wrap: wrap;
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
          font-weight: bold;
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
        }
        .price span {
          font-size: 14px;
          color: #666;
        }
        .linkItem {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          padding: 5px 7px;
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
          padding: 10px 0 15px;
          word-wrap: anywhere;
        }
        .explorerContainer {
          display:flex;
          flex-wrap: wrap;
        }
        .explorerTitle {
          font-size: 14px;
          color: #444;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .explorerTitle span {
          margin-left: 4px;
        }
        .explorerOuter {
          overflow: hidden;
        }
        .explorerLink {
          transition: opacity .2s
        }
        .explorerLink:hover {
          opacity: 0.6;
        }
        .explorerLink span {
          color: #3083e5;
          font-size: 14px;
        }
        .rank {
          margin: 0;
          font-weight: bold;
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
        .answerCol .textWhite {
          color: #fff;
        }
        .dark .answerCol {
          color: #D1D5DB;
        }
        .dark .answerCol .priceLabel {
          color: #D1D5DB;
        }
        .dark .answerRow .price-green {
          color:#6EE7B7
        }
        .dark .answerRow .price-red {
          color:#F87171
        }
        .dark .linkItem, .dark .boxItem, .dark .rangeButtons p {
          color: #D1D5DB;
          background: #1e1e1e;
          border: 1px solid #191919;
        }
        .dark .textGray {
          color: #D1D5DB;
        }
        .dark .textGray400 {
          color:#9CA3AF
        }
        .dark .ranking {
          background: #34D399;
          color: #2e2e2e;
        }
        .dark .textDark800 {
          color: #1e1e1e;
        }
        .dark .textBlue300 {
          color: #93C5FD;
        }
        .boxItem {
          background-color: #ddd;
          color: #4e616c;
          border-radius: 5px;
        }
        .mainCol1 {
          flex: 0.55;
        }
        @media screen and (max-width: 980px) {
          .priceRow .price, .priceItem h1, .rank {
            font-size: 17px;
          }
          .headerRow .name {
            font-size: 17px;
          }
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
            padding: 0;
          }
          .priceRow {
            align-items: flex-start;
            padding: 16px 0 6px;
          }
          .priceRow .price, .priceItem h1, .rank {
            font-size: 16px;
          }
          .headerRow .name {
            font-size: 16px;
          }
          .mainCol {
            width: 100%;
            padding: 0;
            flex-direction:column
          }
          .answerRow h1 {
            line-height: 1.5;
          }
          .mainCol1 {
            width: 100%;
          }
          .rank {
            padding-top: 10px;
          }
          .supplyContain {
            padding: 10px 0;
          }
        }
      </style>
      <script>
      (function graph() {
        let packageContainer = document.querySelector(".mainCol1");
        const main = (CANVAS_HEIGHT, CANVAS_WIDTH, RANGE) => {
          // !------ start ofvariables ----- //
          if (CANVAS_WIDTH <= 400) CANVAS_HEIGHT = 260;
          const NET_LINES = 8;
          const TIMELINE_LINES = 6;
          const infoBoxDiv = document.querySelector("#infoBox");
          const infoBoxLeftDiv = document.querySelector("#infoBoxLeft");
          const infoBoxBottomDiv = document.querySelector("#infoBoxBottom");
      
          const DARK_MODE = document.querySelector("html").className.includes("dark");
          const COLOR_RED = "#ff5050";
          const COLOR_GREEN = "#00b386";
          const TEXT_COLOR = DARK_MODE ? "#D1D5DB" : "#4e616c";
      
          const DATE_RANGE = RANGE;
      
          const positions = [];
      
          let formatNumberHighestLength = 0;
          let infoBoxLeftMargin;
      
          let data;
          if (selectedRange === 1) data = JSON.parse('${JSON.stringify(periods["24h"])}');
          else if (selectedRange === 7) data = JSON.parse('${JSON.stringify(periods["7d"])}');
          else if (selectedRange === 30) data = JSON.parse('${JSON.stringify(periods["30d"])}');
      
          data = data.map((el) => ({ price: el.quote.USD.price, timestamp: el.quote.USD.timestamp, volume: el.quote.USD.volume_24h }));
          const priceArray = [];
          const timestampsArray = [];
          data.forEach((el) => {
            priceArray.push(el.price);
            timestampsArray.push(el.timestamp);
          });
      
          const highestPrice = priceArray.reduce((a, b) => (a > b ? a : b));
          const lowestPrice = priceArray.reduce((a, b) => (a < b ? a : b));
          const difference = highestPrice - lowestPrice;
          // space between data points on y axis
          const step = difference / 6;
      
          // canvas for graph
          const canvasGraph = document.querySelector("#graph");
          const ctxGraph = canvasGraph.getContext("2d");
      
          // canvas for info (mouseover)
          const canvasInfo = document.querySelector("#info");
          const ctxInfo = canvasInfo.getContext("2d");
      
          canvasGraph.parentElement.style.width = CANVAS_WIDTH + "px";
          canvasGraph.parentElement.style.height = CANVAS_HEIGHT + "px";
          canvasGraph.style.width = CANVAS_WIDTH + 2 + "px";
          canvasInfo.style.width = CANVAS_WIDTH + 2 + "px";
          canvasGraph.style.height = CANVAS_HEIGHT + "px";
          canvasInfo.style.height = CANVAS_HEIGHT + "px";
      
          const rect = canvasGraph.getBoundingClientRect();
      
          // increase the actual size of our canvas
          canvasGraph.width = rect.width * devicePixelRatio;
          canvasGraph.height = rect.height * devicePixelRatio;
          canvasInfo.width = rect.width * devicePixelRatio;
          canvasInfo.height = rect.height * devicePixelRatio;
      
          // ensure all drawing operations are scaled
          ctxGraph.scale(devicePixelRatio, devicePixelRatio);
          ctxInfo.scale(devicePixelRatio, devicePixelRatio);
      
          // scale everything down using CSS
          canvasGraph.style.width = rect.width + "px";
          canvasGraph.style.height = rect.height + "px";
          canvasInfo.style.width = rect.width + "px";
          canvasInfo.style.height = rect.height + "px";
      
          // adjust the position of start of the graph based on digts (y axis)
          const margin = {
            0: 28,
            1: 36,
            2: 42,
            3: 48,
            4: 54,
            5: 60,
            6: 66,
            9: 72,
          };
      
          const getHeight = (i) => {
            let height = (CANVAS_HEIGHT / NET_LINES) * i;
            height = height % 1 === 0 ? height + 0.5 : height;
            return height;
          };
      
          // check of small is the number (how much 0's after '.')
          const numberOfZeros = priceArray.reduce((a, b, i) => {
            // if the number is greather than 1, we don't need to check number of zeroes
            // except for the case where we have very small diff between highest and lowest value (mostly stable coins)
            // in this case, we should display longer value to compare, like 1.000032, instead of 1
            if (a >= 1 && difference > 0.01) return 0;
            if (b >= 1 && difference > 0.01) return 0;
      
            let firstItem = a.toString().split(".")[1];
            let firstItemZeros = 0;
      
            let secondItem = b.toString().split(".")[1];
            let secondItemZeros = 0;
      
            // support for very small numbers, like 1.2e-7
            let smallNumFirst;
            let smallNumSecond;
            if (firstItem && firstItem.includes("e-")) {
              smallNumFirst = true;
              firstItemZeros = parseInt(firstItem.split("e-")[1]) - 1;
            }
            if (firstItem && !smallNumFirst) {
              for (let i = 0; i < firstItem.length; i++) {
                if (firstItem[i] !== "0") {
                  firstItemZeros = i;
                  break;
                }
              }
            }
      
            if (secondItem && secondItem.includes("e-")) {
              smallNumSecond = true;
              secondItemZeros = parseInt(secondItem.split("e-")[1]) - 1;
            }
      
            if (secondItem && !smallNumSecond) {
              for (let i = 0; i < secondItem.length; i++) {
                if (secondItem[i] !== "0") {
                  secondItemZeros = i;
                  break;
                }
              }
            }
      
            let highestValue = firstItemZeros > secondItemZeros ? firstItemZeros : secondItemZeros;
            if (i === 1) return highestValue;
            return a > highestValue ? a : highestValue;
          });
      
          // map of the field where we are drawing price graph
          const graphMap = {
            start: margin[numberOfZeros > 6 ? (numberOfZeros > 8 ? 9 : 6) : numberOfZeros] + 2.5,
            end: CANVAS_WIDTH,
            top: getHeight(1),
            bottom: getHeight(NET_LINES - 1),
            width: CANVAS_WIDTH - (margin[numberOfZeros > 6 ? 6 : numberOfZeros] + 2.5),
            height: getHeight(NET_LINES - 1) - getHeight(1),
          };
      
          // coordson Y axis of the vertical line at the start of the graph
          const verticalLine = {
            top: (CANVAS_HEIGHT / NET_LINES) * 0.6,
            bottom: CANVAS_HEIGHT - (CANVAS_HEIGHT / NET_LINES) * 0.6,
          };
      
          // space on x axis between data points
          const spacer = graphMap.width / priceArray.length;
          // space on y axis
          const oneStep = step / (CANVAS_HEIGHT / NET_LINES);
      
          // !------ end of variables ----- //
      
          const formatNumber = (number) => {
            if (number >= 1.01) {
              function nFormatter(num, digits) {
                const lookup = [
                  { value: 1, symbol: "" },
                  { value: 1e3, symbol: "k" },
                  { value: 1e6, symbol: "M" },
                ];
                const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
                var item = lookup
                  .slice()
                  .reverse()
                  .find(function (item) {
                    return num >= item.value;
                  });
                let data = item ? num / item.value : "0";
                // use max 3 digts in numbers
                if (data) {
                  let temp = data.toString();
                  if (temp.length > 3) temp = temp.substr(0, 4);
                  data = parseFloat(temp);
                }
                return item ? data.toFixed(digits).replace(rx, "$1") + item.symbol : "0";
              }
              let value = nFormatter(number, 2);
              if (value) {
                if (value.length > formatNumberHighestLength) formatNumberHighestLength = value.length;
                if (value.includes("k") || value.includes("M")) {
                  // adjust the values to have the same length ie. with
                  if (value.length < formatNumberHighestLength) {
                    let letter = value.includes("k") ? "k" : "M";
                    if (value.includes(".")) {
                      value = value.split(letter).join("0" + letter);
                    } else {
                      value = value.split(letter).join(".0" + letter);
                    }
                  }
                } else if (value.length < formatNumberHighestLength) {
                  let diff = formatNumberHighestLength - value.length;
                  if (value.includes(".")) {
                    value = diff === 1 ? value + "0" : value;
                  } else {
                    value = diff === 1 ? value + ".0" : formatNumberHighestLength < 4 ? value + ".00" : value + ".0";
                  }
                }
              }
              return value;
            }
            let digts = 3;
            if (numberOfZeros > 6) {
              const digtsVariation = {
                7: 2,
                8: 1,
              };
              digts = digtsVariation[numberOfZeros];
            }
            return number.toFixed(numberOfZeros + digts);
          };
      
          const drawNet = () => {
            ctxGraph.strokeStyle = "#99999920";
            ctxGraph.lineWidth = 1;
      
            // draw horizontal lines and labels
            for (let i = 1; i < NET_LINES; i++) {
              let height = (CANVAS_HEIGHT / NET_LINES) * i;
              height = height % 1 === 0 ? height + 0.5 : height;
              let price = numberOfZeros > 8 ? "<0.000000001" : formatNumber(highestPrice - step * (i - 1));
              ctxGraph.beginPath();
              // draw label
              ctxGraph.font = "11px sans-serif";
              ctxGraph.fillStyle = TEXT_COLOR;
              ctxGraph.fillText(price, 0, height + 2);
              // draw horizontal line
              ctxGraph.moveTo(graphMap.start, height);
              ctxGraph.lineTo(graphMap.start + spacer * (priceArray.length - 1), height);
              ctxGraph.stroke();
              ctxGraph.closePath();
            }
            // draw vertical line on start
            ctxGraph.beginPath();
            ctxGraph.moveTo(graphMap.start, verticalLine.top);
            ctxGraph.lineTo(graphMap.start, verticalLine.bottom);
            ctxGraph.stroke();
            ctxGraph.closePath();
          };
      
          const drawTimeline = () => {
            ctxGraph.strokeStyle = "#aaa";
            ctxGraph.lineWidth = 1;
            const distance = timestampsArray.length / TIMELINE_LINES;
            let counter = 0;
            const drawData = (timestamp, position) => {
              let date = new Date(timestamp);
              if (DATE_RANGE === 30 || DATE_RANGE === 7) {
                date = date.toLocaleString("en-US", { day: "numeric", month: "short", hour12: true });
              } else if (DATE_RANGE === 1) {
                date = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
              }
      
              let x = position * spacer + graphMap.start;
              x = x.toFixed();
              if (x % 1 === 0) {
                x = parseInt(x - 1) + ".5";
              }
              let y = verticalLine.bottom;
              ctxGraph.beginPath();
              ctxGraph.moveTo(x, y - 6);
              ctxGraph.lineTo(x, y);
              ctxGraph.closePath();
              ctxGraph.stroke();
              ctxGraph.beginPath();
              // draw label
              ctxGraph.font = "11px sans-serif";
              let textWidth = ctxGraph.measureText(date).width;
              ctxGraph.fillStyle = TEXT_COLOR;
              ctxGraph.fillText(date, x - textWidth / 2, y + 16);
              ctxGraph.closePath();
      
              ctxGraph.stroke();
            };
            timestampsArray.forEach((timestamp, i) => {
              if (i === 0) return;
              counter++;
              if (counter === distance) {
                counter = 0;
                drawData(timestamp, i);
              }
            });
            ctxGraph.stroke();
          };
      
          drawTimeline();
      
          // draw graph
          ctxGraph.beginPath();
          priceArray.forEach((price, i) => {
            let percentage = price - lowestPrice;
            percentage = percentage / difference;
            let vertical = graphMap.bottom - graphMap.height * percentage;
            vertical = vertical.toFixed(1);
            if (i === 0) {
              const coords = { x: graphMap.start.toFixed(2), y: vertical };
              positions.push(coords);
              ctxGraph.moveTo(coords.x, coords.y);
            } else {
              const coords = { x: (graphMap.start + spacer * i).toFixed(2), y: vertical };
              positions.push(coords);
              ctxGraph.lineTo(coords.x, coords.y);
            }
          });
          ctxGraph.lineWidth = 2;
          ctxGraph.lineJoin = "round";
          ctxGraph.lineCap = "round";
          ctxGraph.strokeStyle = priceArray[0] < priceArray[priceArray.length - 1] ? COLOR_GREEN : COLOR_RED;

          ctxGraph.save()
          ctxGraph.stroke()
      
          ctxGraph.restore();
          ctxGraph.lineTo(positions[positions.length-1].x, graphMap.bottom)
          ctxGraph.lineTo(graphMap.start, graphMap.bottom )
          // add linear gradient
          const gradient = ctxGraph.createLinearGradient(0, 0, 0, graphMap.bottom);
          let topColor = priceArray[0] < priceArray[priceArray.length - 1] ? COLOR_GREEN : COLOR_RED
          gradient.addColorStop(0, DARK_MODE ? topColor + "50" : topColor + "90"); 
          gradient.addColorStop(1, topColor + "10");
          ctxGraph.fillStyle = gradient;
          //ctxGraph.stroke();
          ctxGraph.fill()
          ctxGraph.closePath();
      
          // draw dates
          ctxGraph.beginPath();
      
          // !--- variables --- //
          const xAxisDifference = positions[1].x - positions[0].x;
          // !--- end of variables --- //
      
          ctxInfo.lineJoin = "round";
          ctxInfo.lineCap = "round";
          ctxInfo.lineWidth = 1;
          ctxGraph.strokeStyle = TEXT_COLOR;
          const mouseOverFunction = (x, y) => {
            ctxInfo.clearRect(0, 0, CANVAS_WIDTH + 10, CANVAS_HEIGHT);
            let currentElement = (x - graphMap.start) / xAxisDifference;
            currentElement = Math.round(currentElement);
      
            // draw vertical cursor line
            if (x > graphMap.start - spacer * 0.5 && x < graphMap.end - spacer * 0.5) {
              ctxInfo.beginPath();
              for (let i = 0; i < CANVAS_HEIGHT; i++) {
                if (i % 4 == 0) {
                  ctxInfo.moveTo(x + 0.5, 0 + i);
                  ctxInfo.lineTo(x + 0.5, i);
                } else {
                  ctxInfo.moveTo(x + 0.5, 0 + i);
                }
              }
              ctxInfo.closePath();
              ctxInfo.strokeStyle = TEXT_COLOR;
              ctxInfo.lineWidth = 1;
              ctxInfo.stroke();
      
              // bottom info box (date)
              let divWidth = infoBoxBottomDiv.offsetWidth;
              let date = new Date(timestampsArray[currentElement]);
              date = date.toLocaleString("en-US", { day: "numeric", month: "short", hour: "numeric", minute: "numeric", hour12: true });
              infoBoxBottomDiv.style.display = "flex";
              let positionLeft = x - divWidth / 2;
              if (positionLeft + divWidth >= CANVAS_WIDTH - 8 || infoBoxBottomDiv.offsetHeight > 30) {
                positionLeft = "";
                infoBoxBottomDiv.style.right = 0;
              }
              if (positionLeft) {
                infoBoxBottomDiv.style.right = "";
              }
              infoBoxBottomDiv.style.left = positionLeft ? positionLeft + "px" : "";
              infoBoxBottomDiv.style.top = verticalLine.bottom + 2 + "px";
              infoBoxBottomDiv.innerHTML = date;
            }
            // draw horizontal cursor line
            if (y >= verticalLine.top && y <= verticalLine.bottom) {
              ctxInfo.beginPath();
              for (let i = 0; i < CANVAS_WIDTH; i++) {
                if (i % 4 == 0) {
                  ctxInfo.moveTo(0 + i, y + 0.5);
                  ctxInfo.lineTo(i, y + 0.5);
                } else {
                  ctxInfo.moveTo(0 + i, y + 0.5);
                }
              }
              ctxInfo.closePath();
              ctxInfo.strokeStyle = TEXT_COLOR;
              ctxInfo.lineWidth = 1;
              ctxInfo.stroke();
            }
            // draw 'bullet'
            if (x > graphMap.start - spacer * 0.5 && x < graphMap.end) {
              let radius = 5;
              ctxInfo.beginPath();
      
              if (positions[currentElement]) {
                ctxInfo.arc(positions[currentElement].x, positions[currentElement].y, radius, 0, 2 * Math.PI, false);
                ctxInfo.fillStyle = priceArray[0] < priceArray[priceArray.length - 1] ? COLOR_GREEN : COLOR_RED;
                ctxInfo.fill();
                ctxInfo.lineWidth = 2;
                ctxInfo.strokeStyle = "#fff";
                ctxInfo.stroke();
              }
              ctxInfo.closePath();
            }
            // info box (large)
            if ((x || y) && x > graphMap.start - spacer * 0.5) {
              infoBoxDiv.style.display = "flex";
              infoBoxDiv.style.top = (y < 48 ? y + 18 : y - 38) + "px";
              let divWidth = infoBoxDiv.offsetWidth;
              infoBoxDiv.style.left = (x + divWidth + 16 < graphMap.end ? x + 16 : x - 16 - divWidth) + "px";
              let price = priceArray[currentElement] ? priceArray[currentElement].toFixed(numberOfZeros + 5) : "";
              if (price && parseFloat(price) > 1000) price = parseFloat(price).toLocaleString("en-US");
              // ensure that we have always 3 digts after the dot
              let priceCheck = price ? price.split(".") : "";
              if (priceCheck.length > 1) {
                if (priceCheck[1].length < 3) {
                  price = priceCheck[1].length === 1 ? priceCheck.join(".") + "00" : priceCheck.join(".") + "0";
                }
              }
              infoBoxDiv.innerHTML = price ? "$" + price : "";
              if (!infoBoxDiv.innerHTML) infoBoxDiv.style.display = "none";
            }
            if ((!x && !y) || x < graphMap.start - spacer * 0.5) {
              infoBoxDiv.style.display = "none";
            }
      
            // left info box (small)
            if ((x || y) && x > graphMap.start - spacer * 0.5 && y >= verticalLine.top && y <= verticalLine.bottom) {
              let temp = y - graphMap.top;
              let price = highestPrice - oneStep * temp;
              infoBoxLeftDiv.style.display = "flex";
              infoBoxLeftDiv.style.top = y - 10 + "px";
              if (numberOfZeros > 8) {
                infoBoxLeftDiv.innerHTML = price.toFixed(numberOfZeros + 3);
              } else {
                infoBoxLeftDiv.innerHTML = "$" + formatNumber(price);
              }
      
              // set margin only once, to prevent left info box from 'jumping' in some cases
              if (!infoBoxLeftMargin) {
                let boxWidth = infoBoxLeftDiv.offsetWidth;
                infoBoxLeftMargin = boxWidth - graphMap.start;
              }
              infoBoxLeftDiv.style.marginLeft = -infoBoxLeftMargin - 1 + "px";
            }
            if ((!x && !y) || x < graphMap.start - spacer * 0.5 || y < verticalLine.top || y > verticalLine.bottom) {
              infoBoxLeftDiv.style.display = "none";
            }
      
            // disable bottom info box (date)
            if ((!x && !y) || y > verticalLine.bottom) {
              infoBoxBottomDiv.style.display = "none";
            }
          };
      
          canvasInfo.addEventListener("mousemove", (e) => {
            mouseOverFunction(e.layerX, e.layerY);
          });
      
          canvasInfo.addEventListener("mouseleave", () => {
            mouseOverFunction(0, 0);
          });
      
          drawNet();
        };
        const calculateWidth = () => {
          let windowWidth = window.innerWidth;
          if (windowWidth >= 1200) {
            return 490;
            // mobile
          } else if (windowWidth <= 840) {
            return packageContainer.offsetWidth - 20;
          } else {
            let diff = 1200 - windowWidth;
            return 480 - (diff / 2).toFixed();
          }
        };
        let selectedRange = 1;
        main(300, calculateWidth(), selectedRange);
      
        // refresh canvas when toggling dark mode
        const htmlDOM = document.querySelector("html");
        function callback(mutationsList, observer) {
          mutationsList.forEach((mutation) => {
            if (mutation.attributeName === "class") {
              main(300, calculateWidth(), selectedRange);
            }
          });
        }
        const mutationObserver = new MutationObserver(callback);
        mutationObserver.observe(htmlDOM, { attributes: true });
      
        const packageDiv = document.querySelector(".answerRow");
        let previousPackageDivWidth = packageDiv.offsetWidth;
      
        // adjust canvas size live on browser window resize
        window.addEventListener("resize", () => {
          let currentPackageDivWidth = packageDiv.offsetWidth;
          let difference = previousPackageDivWidth - currentPackageDivWidth;
          if (difference < 0) difference *= -1;
          if (difference > 40) {
            previousPackageDivWidth = currentPackageDivWidth;
            main(300, calculateWidth(), selectedRange);
          }
        });
      
        const button1 = document.querySelector("#button1");
        const button7 = document.querySelector("#button7");
        const button30 = document.querySelector("#button30");
        document.querySelector("#button1").addEventListener("click", () => {
          selectedRange = 1;
          button1.classList.add("buttonActive");
          button7.classList.remove("buttonActive");
          button30.classList.remove("buttonActive");
          main(300, calculateWidth(), selectedRange);
        });
      
        document.querySelector("#button7").addEventListener("click", () => {
          selectedRange = 7;
          button1.classList.remove("buttonActive");
          button7.classList.add("buttonActive");
          button30.classList.remove("buttonActive");
          main(300, calculateWidth(), selectedRange);
        });
      
        document.querySelector("#button30").addEventListener("click", () => {
          selectedRange = 30;
          button1.classList.remove("buttonActive");
          button7.classList.remove("buttonActive");
          button30.classList.add("buttonActive");
          main(300, calculateWidth(), selectedRange);
        });
      })();
      
      

      </script>
    `;
    } catch (error) {
        return { error };
    }
}

async function trigger(query) {
    query = query.toLowerCase();
    for (let coin of coin_list) {
        if (coin.name.toLowerCase() === query || coin.symbol.toLowerCase() === query || coin.slug.toLowerCase() === query) return true;
    }

    return false;
}

module.exports = { cryptoInfo, trigger };
