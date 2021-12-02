"use strict";

// @ts-ignore
const fetch = require("node-fetch");
const ethereum_address = require('ethereum-address');

const defaultImg = `
<svg width="100%" height="100%" viewBox="0 0 80 75" fill="currentColor" class="text-black dark:text-white" xmlns="http://www.w3.org/2000/svg">
<path d="M71.1111 8.33333H8.8889C7.71016 8.33333 6.5797 8.77231 5.74621 9.55372C4.91271 10.3351 4.44446 11.3949 4.44446 12.5V62.5C4.44446 63.6051 4.91271 64.6649 5.74621 65.4463C6.5797 66.2277 7.71016 66.6667 8.8889 66.6667H71.1111C72.2899 66.6667 73.4203 66.2277 74.2538 65.4463C75.0873 64.6649 75.5556 63.6051 75.5556 62.5V12.5C75.5556 11.3949 75.0873 10.3351 74.2538 9.55372C73.4203 8.77231 72.2899 8.33333 71.1111 8.33333V8.33333ZM8.8889 62.5V12.5H71.1111V62.5H8.8889Z" fill="currentColor"/>
<path d="M19.8222 29.1667C21.1408 29.1667 22.4297 28.8001 23.526 28.1134C24.6224 27.4266 25.4769 26.4505 25.9814 25.3084C26.486 24.1664 26.6181 22.9097 26.3608 21.6974C26.1036 20.485 25.4686 19.3713 24.5363 18.4973C23.6039 17.6232 22.4161 17.0279 21.1228 16.7868C19.8296 16.5456 18.4892 16.6694 17.271 17.1424C16.0528 17.6155 15.0117 18.4166 14.2791 19.4444C13.5466 20.4722 13.1556 21.6805 13.1556 22.9167C13.1556 24.5743 13.858 26.164 15.1082 27.3361C16.3584 28.5082 18.0541 29.1667 19.8222 29.1667V29.1667ZM19.8222 19.5833C20.5264 19.5792 21.216 19.7712 21.8036 20.135C22.3913 20.4987 22.8504 21.0179 23.123 21.6266C23.3955 22.2353 23.4691 22.9061 23.3344 23.5541C23.1997 24.2021 22.8629 24.798 22.3665 25.2662C21.8701 25.7345 21.2366 26.054 20.5463 26.1844C19.856 26.3147 19.14 26.2499 18.489 25.9982C17.838 25.7465 17.2814 25.3193 16.8897 24.7707C16.498 24.2221 16.2889 23.5768 16.2889 22.9167C16.2947 22.0398 16.6689 21.2005 17.3302 20.5804C17.9916 19.9604 18.8869 19.6096 19.8222 19.6042V19.5833Z" fill="currentColor"/>
<path d="M50.6222 32.0208L38.6222 43.2708L29.7334 34.9375C29.317 34.5495 28.7538 34.3317 28.1667 34.3317C27.5796 34.3317 27.0164 34.5495 26.6 34.9375L13.1556 47.7083V53.6042L28.2445 39.4583L35.5556 46.2083L27.2222 54.0208H33.3334L52.1111 36.4167L66.6667 50V44.125L53.7556 32.0208C53.3392 31.6328 52.776 31.415 52.1889 31.415C51.6018 31.415 51.0386 31.6328 50.6222 32.0208V32.0208Z" fill="currentColor"/>
</svg>
`;

// Used for accessing nested object properties and to avoid using multiple `&&`.
const getNestedObject = (nestedObj, objPropsArr = []) => {
  return objPropsArr.reduce(
    (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
    nestedObj
  );
};

const truncate = (fullStr, strLen, separator = "...") => {
  if (fullStr.length <= strLen) return fullStr;

  const sepLen = separator.length;
  const charsToShow = strLen - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return `${fullStr.substr(0, frontChars)}${separator}${fullStr.substr(
    fullStr.length - backChars
  )}`;
};

const loadAssets = async (query) => {
  const [response1, response2] = await Promise.all([
    fetch(
      `https://api.opensea.io/api/v1/assets?format=json&asset_contract_address=${query}&order_direction=desc&offset=0&limit=5`
    ).catch(error => ({error})),
    fetch(
      `https://api.opensea.io/api/v1/assets?format=json&owner=${query}&order_direction=desc&offset=0&limit=5`
    ).catch(error => ({error})),
  ]);

  // eturn null when there's no response from OpenSea API;
  if (!response1 || response1.error || !response2 || response2.error) {
    return null;
  }

  const [data1, data2] = await Promise.all([
    response1.json(),
    response2.json(),
  ]);

  if (data1.assets.length) {
    return data1.assets;
  }
  // return null when there's no response from OpenSea API;
  if (!data2 || typeof data2 === "string") {
     return null;
  }

  return data2.assets;
};

async function openSea(query) {
  const assets = await loadAssets(query);

  if (!assets) {
    return null;
  }

  let mainAsset =
    assets &&
    assets.find(
      (asset) =>
        getNestedObject(asset, ["owner", "address"]) === query ||
        getNestedObject(asset, ["asset_contract", "address"]) === query
    );

    if (!mainAsset) {
      return null;
    }

  // prevent package from crashing, when title or description includes "`";
  mainAsset.description = mainAsset.description ? mainAsset.description.split("`").join("'") : "";
  mainAsset.title = mainAsset.title ? mainAsset.title.split("`").join("'") : "";

  return `
  <style>
    .Package-wrapper {
      --cultured: #f3f4f6;
      --white: #ffffff;
      --light-white: #fbfbfb;
      --gray-web: #7C7C7C;
      --gray-web-dark: #555555;
      --primary: #359ed8;
      --bluetiful: #0066FF;
      --black: #191919;
      --border: 1px solid #e5e5e5;
      
      --eeric-black: #191919;
      --jet: #2e2e2e;
      --light-gray: #d1d5da;
      --aero: #8bbaed;
      --caribbean-green: #34d399;
      --onyx: #3D3D3D;
    }

    .Package-wrapper .text-black { color: var(--black); }
    .Package-wrapper .text-grey-web { color: var(--gray-web); }
    .Package-wrapper .text-grey-web--dark { color: var(--gray-web-dark); }
    .Package-wrapper .text-bluetiful { color: var(--bluetiful); }

    .dark .Package-wrapper .text-grey-web, .dark .Package-wrapper .text-grey-web--dark, .dark .Package-wrapper .text-black { color: var(--light-gray); }

    .Package-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: var(--white);
    }

    .dark .Package-wrapper {
      background: var(--jet);
    }

    .Package-wrapper .MainAsset {
      padding: 2rem 1rem;
      display: flex;
      flex:1;
      background: var(--white);
    }

    .dark .Package-wrapper .MainAsset {
      background: var(--jet);
    }

    .Package-wrapper .MainAsset .MainAsset--imgWrapper {
      width: 40%;
      max-height: 350px;
      padding: 0 0;
      display: flex;
      align-items: start;
      justify-content: center;
      overflow: hidden;
      border-radius: 4px;
      background: var(--white);
    }

    .dark .Package-wrapper .MainAsset .MainAsset--imgWrapper {
      background: var(--jet);
    }

    .Package-wrapper .MainAsset .MainAsset--imgWrapper img {
      height: auto;
      width: 100%;
    }

    .Package-wrapper .MainAsset .MainAsset--content {
      display: flex;
      align-items: start;
      flex-direction: column;
      padding: 0 1rem;
      padding-right: 0;
      width: 55%;
      flex: 1;
    }

    .Package-wrapper .MainAsset .MainAsset--name {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .Package-wrapper .MainAsset .MainAsset--viewOnOpensea {
      margin-bottom: 1rem;
      margin-top: 0.3rem;
    }

    .Package-wrapper .MainAsset .MainAsset--ownerInfo {
      display: flex;
      align-items: center;
      margin-top: 1rem;
    }

    .Package-wrapper .MainAsset .MainAsset--ownerInfo--profile {
      height: 25px;
      width: 25px;
      overflow: hidden;
      border-radius: 50%;
      margin-right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .Package-wrapper .MainAsset .MainAsset--buttonWrapper {
      padding: 0;
      padding-top: 1rem;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items:center;
      width:100%;
    }

    .Package-wrapper .MainAsset .MainAsset--buttonWrapper .MainAsset--button {
      background: var(--primary);
      color: var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      padding: 0.8rem 2.5rem;
      margin-bottom: 1rem;
      border-radius: .25rem!important;
    }

    .Package-wrapper .OtherAssets {
      border-radius: .25rem!important;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      width:100%;
    }

    .Package-wrapper .OtherAssets .OtherAssets-cardWrapper {
      padding: 0.4rem;
      width: 30%;
      min-width: 150px;
      max-width: 250px;
      flex: 1;
    }

    .Package-wrapper .OtherAssets a {
      font-size: 14px;
    }

    .Package-wrapper .OtherAssets .OtherAssets--card {
       border: 1px solid #e5e5e5;
       background: var(--white);
       padding: 0.5rem;
       display: flex;
       flex-flow: column nowrap;
       border-radius: .25rem!important;
    }

    .Package-wrapper .OtherAssets .OtherAssets--card .OtherAssets--card--imgWrapper {
      max-height: 300px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dark .Package-wrapper .OtherAssets .OtherAssets--card {
       border-color: var(--onyx);
       background: var(--jet);
    }

    .Package-wrapper .OtherAssets .OtherAssets--card img {
       border: 1px solid #e5e5e5;
       height: auto;
    }

    .dark .Package-wrapper .OtherAssets .OtherAssets--card img {
       border-color: var(--jet);
    }

    .Package-wrapper .OtherAssets .OtherAssets--assetCaption {
      margin-top: 0.5rem;
    }

    .Package-wrapper .OtherAssets .OtherAssets--assetName {
      margin-top: 0.2rem;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 0.75rem;
    }

    @media screen and (max-width: 839px) {
      .Package-wrapper {
        flex-direction: column;
      }

      .Package-wrapper .MainAsset {
        margin-right: 0;
        width: 100%;
      }

      .Package-wrapper .OtherAssets {
        width: 100%;
        justify-content: flex-start;
        max-width: 100%;
      }

      .Package-wrapper .OtherAssets .OtherAssets-cardWrapper {
        width: 50%;
        padding: 0.4rem;
      }

      .Package-wrapper .OtherAssets .OtherAssets-cardWrapper .OtherAssets--card {
        width: 100%;
      }

      .Package-wrapper .OtherAssets .OtherAssets--card img {
        height: auto;
     }
    }

    @media screen and (max-width: 737px) {
      .Package-wrapper .MainAsset {
        flex-direction: column;
        margin-bottom: 1rem;
        padding: 0;
      }

      .Package-wrapper .MainAsset .MainAsset--imgWrapper {
        width: 100%;
        height: auto;
      }

      .Package-wrapper .MainAsset .MainAsset--imgWrapper img {
        height: 100%;
        width: auto;
      }

      .Package-wrapper .MainAsset .MainAsset--content {
        width: 100%;
        padding: 0;
        padding-top: 1rem;
      }

      .Package-wrapper .OtherAssets .OtherAssets-cardWrapper {
        width: 100% !important;
        margin: 0 10px 0 0;
        padding: 0.5rem 0;
      }
      .Package-wrapper .OtherAssets {
        overflow-x: auto;
      }
    }
  </style>

  <div class="Package-wrapper">
    <div class="MainAsset">
      <div class="MainAsset--imgWrapper">
      ${mainAsset ? (function(){
        if (mainAsset.image_url || mainAsset.image_thumbnail_url || mainAsset.image_preview_url) {
          return (
            `<img
              width="auto"
              height="100%"
              src="${
                mainAsset
                  ? mainAsset.image_url ||
                    mainAsset.image_thumbnail_url ||
                    mainAsset.image_preview_url
                  : ""
                }"
                alt="${mainAsset ? mainAsset.name || "N/A" : ""}"
              />`
          );
        }
        if (mainAsset.collection && mainAsset.collection.image_url) {
          return `<img width="auto" height="100%" src="${mainAsset.collection.image_url}" alt="collection image" />`
        }
        return defaultImg;
      })() : ''}
        
      </div>

      <div class="MainAsset--content">
        <strong class="MainAsset--name text-black">${
          mainAsset ? mainAsset.name || (mainAsset.collection ? mainAsset.collection.name : false) : ""
        }</strong>

        <a
          href="${
            mainAsset ? mainAsset.external_link || mainAsset.permalink : ""
          }"
          class="MainAsset--viewOnOpensea text-grey-web"
        >
          <small>View on openSea</small>
        </a>

        <span class="text-grey-web--dark">
          ${
            mainAsset
              ? mainAsset.description ||
                mainAsset.name ||
                getNestedObject(mainAsset, ["collection", "description"])
              : ""
          }
        </span>

        <div class="MainAsset--ownerInfo text-grey-web">
          <span class="MainAsset--ownerInfo--profile">
            <img
              src="${
                getNestedObject(mainAsset, ["owner"])
                  ? mainAsset.owner.profile_img_url
                  : ""
              }"
              width="40px"
            />
          </span>
          Owned by &nbsp;
          <a
            class="text-bluetiful"
          >
            ${
              getNestedObject(mainAsset, ["owner", "user"])
                ? mainAsset.owner
                  ? truncate(mainAsset.owner.address, 12)
                  : ""
                : "N/A"
            }
          </a>
        </div>
        <div class="MainAsset--buttonWrapper">
          <a href="${
            mainAsset ? mainAsset.permalink || mainAsset.external_link : ""
          }">
            <button class="MainAsset--button">
              VIEW THIS ITEM
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            </button>
          </a>
        </div>
      </div>
    </div>

    <div class="OtherAssets">
      ${
        assets
          ? assets
              .filter((asset) => (mainAsset.id !== asset.id && (asset.external_link || asset.permalink)))
              .filter((_asset, i) => i < 4)
              .map(
                (asset) => {
                  const imageUrl = asset.image_thumbnail_url || asset.image_preview_url || asset.image_url || (asset.collection ? asset.collection.image_url : false);
                  const image = `
                    <img
                      src="${imageUrl}"
                      width="100%"
                      height="auto"
                    />
                  `
                  return `
                    <div class="OtherAssets-cardWrapper">
                      <div class="OtherAssets--card">
                        <div class="OtherAssets--card--imgWrapper">
                        <a style="width:100%" href="${asset.external_link || asset.permalink}">${imageUrl ? image : defaultImg}</a>
                        </div>
                        <small class="OtherAssets--assetCaption text-grey-web">${
                          asset.collection.name
                        }</small>
                        <a
                          href="${asset.external_link || asset.permalink}"
                          class="OtherAssets--assetName text-black"
                        >
                          ${asset.name || asset.collection.name || "NA"}
                        </a>
                      </div>
                    </div>
                  `
                })
              .join("")
          : ""
      }
    </div>
  </div>
  `;
}

async function trigger(query) {
  return ethereum_address.isAddress(query);
}

module.exports = { openSea, trigger };
