'use strict';
// @ts-ignore
const fetch = require('node-fetch');

const loadAssets = async () => {
  const response = await fetch(
    'https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=50'
  );
  const data = await response.text();
  const { assets } = JSON.parse(data);
  return assets;
};

async function OpenSea(query) {
  const q = query.toLowerCase().split(' ');
  const assets = await loadAssets();
  console.log(assets[0])
  let filteredTraits = []
  const searchedAsset = assets && assets.find((asset) => {
    if (asset.name && q.every((el) => asset.name.toLowerCase().indexOf(el) > -1)) {
      return true
    } else if (asset.traits.some(trait => trait.trait_type)) {
    }
  });

  // console.log(searchedAsset);

  return `<div class="min-vh-screen w-full flex flex-col items-start bg-cultured">
    <div style="width: 1000px; height: 450px; padding: 2rem;" class="flex bg-light-white justify-between">
      <div style="width: 40%; padding: 1rem; overflow: hidden;" class="border flex justify-center items-center bg-white">
        <img width="400px" height="380px" src="${searchedAsset.image_thumbnail_url}" alt="${
    searchedAsset.name
  }" />
      </div>
      <div class="flex flex-col items-start" style="width: 55%; padding: 1rem; flex: 1;">
        <h3>${searchedAsset.name}</h3>
        <a href="${
          searchedAsset.external_link || searchedAsset.permalink
        }" class="text-grey-web">View on OpenSea</a>
        <span class="flex items-center text-grey-web" style="margin-top: 1rem;">
          <span style="height: 25px; width: 25px; overflow: hidden; border-radius: 50%; margin-right: 0.5rem;" class="flex justify-center items-center">
            <img src="${searchedAsset.owner.profile_img_url}" width="40px" />
          </span>
          Owned by &nbsp; <a class="text-bluetiful" href="${searchedAsset.owner.profile_img_url}">${
    searchedAsset.owner.user ? searchedAsset.owner.user.username : 'N/A'
  }</a>
        </span>
        <div style="margin-top: 1rem;" class="border h-full w-full">
          <div style="padding: 1rem;" class="border-bottom w-full">
            <strong class="text-grey-web">Ends in </strong>
          </div>
          <div style="padding: 1rem; flex: 1;" class="flex flex-col justify-start items-start">
            <span class="text-grey-web">Listed for</span>
            <span>
              <h1 style="font-size: 2.2rem;">0.003</h1>
            </span>
            <button class="btn-primary rounded" style="border: 0; padding: 0.8rem 2.5rem; margin-bottom: 1rem;">
              BUY THIS ITEM
            </button>
          </div>
          <div style="padding: 1rem;" class="border-top w-full flex items-center">
            <strong class="">Earn 0.00003</strong>
            <span class="text-grey-web">by referring this asset</span>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

async function trigger(query) {
  const assets = await loadAssets();
  const q = query.toLowerCase().split(' ');
  return (
    assets &&
    assets.some((asset) => asset.name && q.every((el) => asset.name.toLowerCase().indexOf(el) > -1))
  );
}

module.exports = { OpenSea, trigger };
