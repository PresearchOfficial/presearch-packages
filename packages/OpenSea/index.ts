'use strict';

import { IAsset } from './types';

// @ts-ignore
const fetch = require('node-fetch');

const loadAssets = async (): Promise<Array<IAsset>> => {
  const response = await fetch(
    'https://api.opensea.io/api/v1/assets?order_by=num_sales&order_direction=desc&offset=0&limit=50'
  );
  const data = await response.text();
  const { assets } = JSON.parse(data);
  return assets;
};

async function OpenSea(query: string): Promise<string> {
  const q = query.toLowerCase().split(' ');
  const assets = await loadAssets();
  // full text Search through asset name/description,
  // collection name/description and asset contract name
  let searchedAssets =
    (assets &&
      assets.filter(
        (asset) =>
          asset &&
          (q.every((el) => (asset.name || '').toLowerCase().indexOf(el) > -1) ||
            q.every((el) => (asset.description || '').toLowerCase().indexOf(el) > -1) ||
            q.every((el) => asset.collection && (asset.collection.name || '').toLowerCase().indexOf(el) > -1) ||
            q.every((el) => asset.collection && (asset.collection.description || '').toLowerCase().indexOf(el) > -1) ||
            q.every((el) => asset.asset_contract && (asset.asset_contract.name || '').toLowerCase().indexOf(el) > -1))
      )) ||
    ([] as IAsset[]);

  const searchedAsset = searchedAssets[0];
  searchedAssets.splice(0, 1);

  console.log(searchedAsset);

  return `<div class="w-full flex flex-col items-start bg-cultured">
    <div style="max-width: 1100px; min-height: 450px; padding: 2rem;" class="flex bg-light-white justify-between">
      <div style="width: 40%; padding: 1rem; overflow: hidden;" class="border flex justify-center items-center bg-white">
        <img width="400px" height="380px" src="${searchedAsset ? searchedAsset.image_url : ''}" alt="${
    searchedAsset ? searchedAsset.name : ''
  }" />
      </div>
      <div class="flex flex-col items-start" style="width: 55%; padding: 1rem; flex: 1;">
        <h3 class="fw-bold">${searchedAsset ? searchedAsset.name : ''}</h3>
        <a style="margin-bottom: 1rem;" href="${
          searchedAsset ? searchedAsset.external_link || searchedAsset.permalink : ''
        }" class="text-grey-web">View on OpenSea</a>
        <span class="text-grey-web--dark">${searchedAsset ? searchedAsset.description : ''}</span>
        <span class="flex items-center text-grey-web" style="margin-top: 1rem;">
          <span style="height: 25px; width: 25px; overflow: hidden; border-radius: 50%; margin-right: 0.5rem;" class="flex justify-center items-center">
            <img src="${
              searchedAsset && searchedAsset.owner ? searchedAsset.owner.profile_img_url : ''
            }" width="40px" />
          </span>
          Owned by &nbsp; <a class="text-bluetiful" href="${
            searchedAsset ? searchedAsset.external_link : ''
          }">${
    searchedAsset && searchedAsset.owner && searchedAsset.owner.user ? searchedAsset.owner.user.username : 'N/A'
  }</a>
        </span>
        <div style="margin-top: 0.6rem;" class="border h-full w-full">
          <div style="padding: 1rem;" class="border-bottom w-full flex items-center">
          <span style="font-size: 16px; margin-right: 0.5rem;" class="material-icons text-grey-web">
            schedule
          </span>
            <strong class="text-grey-web">Ends in </strong>
          </div>
          <div style="padding: 1rem; flex: 1;" class="flex flex-col justify-start items-start">
            <span class="text-grey-web">Listed for</span>
            <span>
              <h1 style="font-size: 2.2rem;">
              <span class="material-icons">
                filter_list
              </span>
              0.003
              </h1>
            </span>
            <a href="${searchedAsset ? searchedAsset.permalink : ''}">
              <button class="btn--primary cursor-pointer flex items-center rounded" style="border: 0; padding: 0.8rem 2.5rem; margin-bottom: 1rem;">
                BUY THIS ITEM
                <span style="margin-left: 0.5rem;" class="material-icons">
                  keyboard_arrow_right
                </span>
              </button>
            </a>
          </div>
          <div style="padding: 1rem;" class="border-top w-full flex items-center">
            <strong class="flex items-center">
            Earn&nbsp;<span style="font-size: 17px;" class="material-icons">
            filter_list
          </span>&nbsp;0.00003
            </strong>
            <span class="text-grey-web">&nbsp;by referring this asset</span>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 100%;" class="p-4 my-5 border rounded flex container-fluid w-100 bg-cultured">
      <div class="row w-100">
        ${
          searchedAssets
            ? searchedAssets
                .map(
                  (asset) => `
                <div class="p-2 col-md-3">
                  <div class="border bg-white p-2 d-flex flex-col">
                    <img src="${asset.image_thumbnail_url}" width="100%" class="border" />
                    <small class="text-grey-web mt-2">${asset.collection.name}</small>
                    <a href="${asset.external_link}" class="mb-3 mt-1 fw-bolder cursor-pointer">${asset.name}</a>
                  </div>
                </div>
                `
                )
                .join('')
            : ''
        }
      </div>
    </div>
  </div>`;
}

async function trigger(query: string): Promise<boolean> {
  const assets = await loadAssets();
  const q = query.toLowerCase().split(' ');
  let filteredAssets = assets.filter(
    (asset) =>
      asset &&
      (q.every((el) => (asset.name || '').toLowerCase().indexOf(el) > -1) ||
        q.every((el) => (asset.description || '').toLowerCase().indexOf(el) > -1) ||
        q.every((el) => asset.collection && (asset.collection.name || '').toLowerCase().indexOf(el) > -1) ||
        q.every((el) => asset.collection && (asset.collection.description || '').toLowerCase().indexOf(el) > -1) ||
        q.every((el) => asset.asset_contract && (asset.asset_contract.name || '').toLowerCase().indexOf(el) > -1))
  );
  if (filteredAssets.length) {
    return true;
  }
  return true;
}

module.exports = { OpenSea, trigger };
