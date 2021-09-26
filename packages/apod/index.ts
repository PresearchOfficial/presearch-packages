import { IApod } from "./types";

// @ts-ignore
const fetch = require("node-fetch");

const APOD_API_KEY = "bLhnNpy0ntfp1QzvG61uXC6m52fbcFKmtyJCYvbA";

async function apod(): Promise<string> {
  const res: Response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${APOD_API_KEY}`
  );
  const json = await res.text();
  const data: IApod = JSON.parse(json);

  return `
    <div class="answerCol">
      <h3 class="apodLabel">Astronomy Picture of the Day</h3>
      <div class="answerRow">
        <div class="mainCol">
          ${
            data.url
              ? data.media_type === "video"
                ? `<iframe src="${data.url}" title="${data.title}" class="apodIframe" type="text/html" frameBorder="0"></iframe>`
                : `<img src="${data.url}" class="apodImage" alt="${data.title}" />`
              : ``
          }
        </div>
        <div class="sideCol apodSideContain">
          ${data.title ? `<h2 class="apodName">${data.title}</h2>` : ``}
          ${
            data.copyright
              ? `<p class="apodAuthor">By ${data.copyright}</p>`
              : ``
          }
          ${data.date ? `<p class="apodDate">${data.date}</p>` : ``}
          ${
            data.explanation
              ? `<p class="apodDesc">${data.explanation}</p>`
              : ``
          }
          <a href="https://apod.nasa.gov" class="apodLink">apod.nasa.gov</a>
        </div>
      </div>
    </div>
    <style>
      .apodLabel {
        margin: 5px 15px 0;
      }
      .apodImage {
        width: 100%;
        margin-top: 15px;
      }
      .apodIframe {
        width: 100%;
        height: 300px;
        margin-top: 15px;
      }
      .apodSideContain {
        box-sizing: border-box;
        padding: 0 15px;
      }
      .apodName {
        margin: 15px 0 0;
      }
      .apodAuthor {
        margin: 0;
        color: gray;
      }
      .apodDate {
        margin: 10px 0;
      }
      .apodDesc {
        margin: 5px 0;
      }
      .apodLink {
        color: #1a0dab;
        text-decoration: none;
        transition: .2s;
      }
      .apodLink:hover {
        opacity: .6;
      }
      .dark .apodLink {
        color: #69b9fd;
        text-decoration: none;
      }
      .dark .answerCol {
        color: #d1d5db;
      }

      @media screen and (min-width: 840px) {
        .apodIframe {
          height: calc(30vw - 55px) !important;
          min-height: 330px;
        }
        .apodSideContain {
          padding: 0 30px;
        }
      }
    </style>
  `;
}

// This line is for testing package with browserify bundle
// window.apod = apod();
// @ts-ignore
const trigger = (query: string): boolean => query.toLowerCase() === "apod";

module.exports = { apod, trigger };
