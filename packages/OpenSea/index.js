'use strict';
// @ts-ignore
const fetch = require('node-fetch');

const loadAssets = async () => {
  const response = await fetch(
    'https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=100'
  );
  const data = await response.text();
  const { assets } = JSON.parse(data);
  return assets;
};

async function OpenSea(query) {
  const q = query.toLowerCase().split(' ');
  const assets = await loadAssets();
  const searchedAsset =
    assets &&
    assets.find(
      (asset) => asset.name && q.every((el) => asset.name.toLowerCase().indexOf(el) > -1)
    );

  console.log(searchedAsset);

  return `<div class="min-vh-screen w-full flex flex-col items-start bg-cultured">
    <div style="width: 1000px; height: 450px; padding: 2rem;" class="flex bg-light-white justify-between">
      <div style="width: 40%; padding: 1rem; overflow: hidden;" class="border flex justify-center items-center bg-white">
        <img width="400px" height="400px" src="${searchedAsset.image_thumbnail_url}" alt="${searchedAsset.name}" />
      </div>
      <div class="flex flex-col items-start" style="width: 55%; padding: 1rem; flex: 1;">
        <h3>${searchedAsset.name}</h3>
        <a href="${searchedAsset.permalink}" class="text-grey-web">View on OpenSea</a>
        <span class="flex items-center text-grey-web" style="margin-top: 1rem;">
          <span style="height: 25px; width: 25px; overflow: hidden; border-radius: 50%; margin-right: 0.5rem;" class="flex justify-center items-center">
            <img src="${searchedAsset.owner.profile_img_url}" width="40px" />
          </span>
          Owned by &nbsp; <a class="text-bluetiful" href="${searchedAsset.owner.profile_img_url}">${searchedAsset.owner.user.username || 'N\A'}</a>
        </span>
      </div>
    </div>
  </div>`;
}

async function trigger(query) {
  const assets = await loadAssets();
  const q = query.toLowerCase().split(' ');
  console.log(assets);
  return (
    assets &&
    assets.some((asset) => asset.name && q.every((el) => asset.name.toLowerCase().indexOf(el) > -1))
  );
}

module.exports = { OpenSea, trigger };
