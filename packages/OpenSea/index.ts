'use strict';

import { IAsset } from './types';

// @ts-ignore
const fetch = require('node-fetch');

const loadAssets = async (): Promise<Array<IAsset>> => {
  const response = await fetch(`https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=50`);
  const data = await response.text();
  const { assets } = JSON.parse(data);
  return assets;
};

async function OpenSea(query: string): Promise<string> {
  const q = query.toLowerCase().split(' ');
  const assets = await loadAssets();

  console.log(assets);

  const firstAsset =
    assets &&
    assets.find((asset) => {
      return (
        asset &&
        (q.every((el) => (asset.name || '').toLowerCase().indexOf(el) > -1) ||
          q.every((el) => (asset.description || '').toLowerCase().indexOf(el) > -1) ||
          q.every((el) => asset.collection && (asset.collection.name || '').toLowerCase().indexOf(el) > -1) ||
          q.every((el) => asset.collection && (asset.collection.description || '').toLowerCase().indexOf(el) > -1) ||
          q.every((el) => asset.asset_contract && (asset.asset_contract.name || '').toLowerCase().indexOf(el) > -1))
      );
    });

  // console.log(firstAsset);

  if (!firstAsset) {
    return `<div className="d-flex justify-center items-center">
      <span>Sorry, no NFT’s found for "${query}"</span>
    </div>`;
  }

  return `<div style="min-width: 90vw;" class="w-full flex flex-column flex-md-row flex-md-nowrap items-start bg-cultured">
    <div style="max-width: 900px; min-height: 450px; padding: 2rem 1rem;" class="flex bg-light-white justify-between items-start me-3">
      <div style="width: 40%; padding: 1rem 0; overflow: hidden;" class="border flex justify-center items-start bg-white">
        <img width="400px" height="380px" src="${
          firstAsset ? firstAsset.image_url || firstAsset.image_thumbnail_url || firstAsset.image_preview_url : ''
        }" alt="${firstAsset ? firstAsset.name || 'N/A' : ''}" />
      </div>
      <div class="flex flex-col items-start ps-3 py-3 pr-0" style="width: 55%; flex: 1;">
        <strong class="fw-bold fs-5">${firstAsset ? firstAsset.name || 'NA' : ''}</strong>
        <a style="margin-bottom: 1rem;" href="${
          firstAsset ? firstAsset.external_link || firstAsset.permalink : ''
        }" class="text-grey-web">View on OpenSea</a>
        <span class="text-grey-web--dark">${
          firstAsset
            ? firstAsset.description || firstAsset.name || (firstAsset.collection && firstAsset.collection.description)
            : ''
        }</span>
        <span class="flex items-center text-grey-web" style="margin-top: 1rem;">
          <span style="height: 25px; width: 25px; overflow: hidden; border-radius: 50%; margin-right: 0.5rem;" class="flex justify-center items-center">
            <img src="${firstAsset && firstAsset.owner ? firstAsset.owner.profile_img_url : ''}" width="40px" />
          </span>
          Owned by &nbsp; <a class="text-bluetiful" href="${
            firstAsset ? firstAsset.external_link || firstAsset.permalink : ''
          }">${
    firstAsset && firstAsset.owner && firstAsset.owner.user ? firstAsset.owner.user.username.replace('Null', '') : 'N/A'
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
            <a href="${firstAsset ? firstAsset.permalink || firstAsset.external_link : ''}">
              <button class="btn--primary cursor-pointer flex items-center rounded" style="border: 0; padding: 0.8rem 2.5rem; margin-bottom: 1rem;">
                VIEW THIS ITEM
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

    <div style="max-width: 500px;" class="mx-2 rounded flex flex-column container-fluid bg-cultured">
      <div class="row w-100">
        ${
          assets
            ? assets
                .filter((asset) => firstAsset.id !== asset.id)
                .filter((_asset, i) => i < 4)
                .map(
                  (asset) => `
                <div class="p-2 col-md-6">
                  <div class="border rounded bg-white p-2 d-flex flex-col">
                    <img src="${
                      asset.image_thumbnail_url || asset.image_preview_url || asset.image_url
                    }" width="100%" height="170px" class="border" />
                    <small class="text-grey-web mt-2">${asset.collection.name}</small>
                    <a href="${asset.external_link || asset.permalink}" class="mb-3 mt-1 fw-bolder cursor-pointer">${
                    asset.name || asset.collection.name || 'NA'
                  }</a>
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
  if (assets && assets.length) {
    return true;
  }
  if (q.every((el) => 'NFT'.toLowerCase().indexOf(el) > -1)) {
    return true;
  }
  return false;
}

module.exports = { OpenSea, trigger };
