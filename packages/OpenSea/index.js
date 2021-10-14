"use strict";

// @ts-ignore
const fetch = require("node-fetch");

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

  // return null when there's no response from OpenSea API;
  if (!assets) {
    return null;
  }

  const mainAsset = assets &&
    assets.find((asset) =>
        getNestedObject(asset, ["owner", "address"]) === query ||
        getNestedObject(asset, ["asset_contract", "address"]) === query
    );

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
      --border: 1px solid #e5e5e5;
    }

    .Package-wrapper .text-grey-web { color: var(--gray-web); }
    .Package-wrapper .text-grey-web--dark { color: var(--gray-web-dark); }
    .Package-wrapper .text-bluetiful { color: var(--bluetiful); }

    .Package-wrapper {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }

    .Package-wrapper .MainAsset {
      max-width: 750px;
      min-height: 450px;
      padding: 2rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-right: 2rem;
      background: var(--white);
    }

    .Package-wrapper .MainAsset .MainAsset--imgWrapper {
      width: 40%;
      padding: 0 0;
      display: flex;
      align-items: start;
      justify-content: center;
      overflow: hidden;
      border-radius: 4px;
      border: var(--border);
      background: var(--white);
    }

    .Package-wrapper .MainAsset .MainAsset--content {
      display: flex;
      align-items: start;
      flex-direction: column;
      padding: 1rem;
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
      padding: 1rem 0;
      flex: 1;
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
      max-width: 500px;
      border-radius: .25rem!important;
      margin: 0;
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
    }

    .Package-wrapper .OtherAssets .OtherAssets-cardWrapper {
      padding: 0.4rem;
      width: 47%;
      min-width: 200px;
    }

    .Package-wrapper .OtherAssets .OtherAssets--card {
       border: var(--border);
       background: var(--white);
       padding: 0.5rem;
       display: flex;
       flex-flow: column nowrap;
       border-radius: .25rem!important;
    }

    .Package-wrapper .OtherAssets .OtherAssets--card img {
       border: var(--border);
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
      }

      .Package-wrapper .OtherAssets {
        width: 100%;
        justify-content: flex-start;
        max-width: 100%;
      }

      .Package-wrapper .OtherAssets .OtherAssets-cardWrapper {
        width: 40%;
        margin: 0 0.5rem;
      }

      .Package-wrapper .OtherAssets .OtherAssets-cardWrapper .OtherAssets--card {
        width: 100%;
      }
    }
  </style>

  <div class="Package-wrapper">
    <div class="MainAsset">
      <div class="MainAsset--imgWrapper">
        <img
          width="400px"
          height="380px"
          src="${
            mainAsset
              ? mainAsset.image_url ||
                mainAsset.image_thumbnail_url ||
                mainAsset.image_preview_url
              : ""
          }"
          alt="${mainAsset ? mainAsset.name || "N/A" : ""}"
        />
      </div>

      <div class="MainAsset--content">
        <strong class="MainAsset--name">${
          mainAsset ? mainAsset.name || "NA" : ""
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
            href="${mainAsset ? mainAsset.profile_img_url | "#" : ""}"
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
              .filter((asset) => mainAsset.id !== asset.id)
              .filter((_asset, i) => i < 4)
              .map(
                (asset) => `
                <div class="OtherAssets-cardWrapper">
                  <div class="OtherAssets--card">
                    <img
                      src="${
                        asset.image_thumbnail_url ||
                        asset.image_preview_url ||
                        asset.image_url
                      }"
                      width="100%"
                      height="170px"
                    />
                    <small class="OtherAssets--assetCaption text-grey-web">${
                      asset.collection.name
                    }</small>
                    <a
                      href="${asset.external_link || asset.permalink}"
                      class="OtherAssets--assetName"
                    >
                      ${asset.name || asset.collection.name || "NA"}
                    </a>
                  </div>
                </div>
                `
              )
              .join("")
          : ""
      }
    </div>
  </div>`;
}

async function trigger(query) {
  return query.indexOf("0x") >= 0;
}

module.exports = { openSea, trigger };
