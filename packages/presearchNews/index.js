'use strict';

const axios = require("axios");
const dayjs = require("dayjs");
const relativeTimePlugin = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTimePlugin);

const LBRY_API_URL = "https://api.lbry.tv/api/v1/proxy";
const LBRY_PRESEARCH_CHANNEL_ID = "4f4fb7a173dcad5ccd95a56dac2e8e9efe9bdfa6";

async function presearchNews(query, API_KEY) {
    const data = await getVideos();
    if (!data || data.error) {
        return null;
    }

    const videos = data;
    const recentVideo = videos[0];
    const olderVideos = videos.slice(1);

    const createVideos = () =>
        olderVideos.map((v) => `
            <li class="video-item">
                <a href="${v.url}">
                    <div class="video-thumbnail" style="background-image: url(${v.image})"></div>
                    <div class="video-item-title">
                        ${v.title}
                    </div>
                    <div class="video-item-release">
                        ${v.release}
                    </div>
                </a>
            </li>`).join('');

    return `
    <div id="presearch-presearchnews-package">
        <section class="video-section">
            <div class="recent-video">
                <div class="video-item-title">
                    <a href="${recentVideo.url}">
                        ${recentVideo.title}
                    </a>
                </div>
                <div class="video-item-main flex">
                    <a href="${recentVideo.url}">
                        <div class="video-thumbnail" style="background-image: url(${recentVideo.image})"></div>
                    </a>
                    <div class="recent-video-details">
                        <div class="video-item-release">
                            ${recentVideo.release}
                        </div>
                        <pre class="video-item-description">${recentVideo.description}</pre>
                        <div class="video-item-expand-container">
                            <button class="video-item-expand">
                                <i class="chevron-double-down"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="older-videos-header">Previous episodes</div>
            <ol class="older-videos">
                ${createVideos()}
                <li class="video-more">
                    <a href="https://odysee.com/@Presearch#${LBRY_PRESEARCH_CHANNEL_ID}">
                        <i class="chevron-double-down"></i>
                    </a>
                </li>
            </ol>
        </section>
    </div>

    <script>
        (() => {
            const expandButton = document.querySelector("#presearch-presearchnews-package .video-item-expand");
            expandButton?.addEventListener("click", (event) => {
                const element = document.querySelector('#presearch-presearchnews-package .video-item-description');
                element.classList.toggle('expanded');
                expandButton.classList.toggle('up');
                const container = document.querySelector('#presearch-presearchnews-package .video-item-main');
                container.classList.toggle('flex');
            });
        })();
        
    </script>

    <style>
        #presearch-presearchnews-package {
            color: #666666;
            cursor: default;
        }

        .dark #presearch-presearchnews-package {
            color: #ced5e2;
        }

        #presearch-presearchnews-package .video-item {
            width: 200px;
            min-width: 200px;
            font-weight: bold;
            font-size: 14px;
            border-radius: 5px;
        }
        
        #presearch-presearchnews-package .video-more {
            display: flex;
            align-items: center;
            cursor: pointer;
            border-radius: 5px; 
        }
        
        #presearch-presearchnews-package .video-more a {
            width: 50px;
            margin: 0 10px;
            height: 50px;
            border: 2px solid gray;
            border-radius: 50%;
            font-size: 30px;
            text-align: center;
            display: flex;
        }
        
        #presearch-presearchnews-package .video-more a i {
            align-self: center;
            margin: auto;
            transform: rotate(270deg);
            color: gray;
        }

        #presearch-presearchnews-package .video-more:hover a i {
            color: #363636;
        }
        
        .dark #presearch-presearchnews-package .video-more:hover a i {
            color: #ced5e2;
        }

        #presearch-presearchnews-package .video-more:hover a {
            border-color: #363636;
        }

        .dark #presearch-presearchnews-package .video-more:hover a {
            border-color: #ced5e2;
        }

        #presearch-presearchnews-package .recent-video .video-item-title {
            font-size: 20px;
            font-weight: bold;
            margin: 0 5px 10px 5px;
        }

        #presearch-presearchnews-package .video-item-title {
            margin: 5px 8px 0px 8px;
        }

        #presearch-presearchnews-package .video-item:hover, 
        #presearch-presearchnews-package .video-more:hover {
            background-color: #dddddd;
        }

        .dark #presearch-presearchnews-package .video-item:hover,
        .dark #presearch-presearchnews-package .video-more:hover  {
            background-color: #3d3e40;
        }

        #presearch-presearchnews-package .video-thumbnail {
            object-fit: cover;
            background: black;
            height: 105px;
            margin-bottom: 5px;
            background-size: 100%;
            background-position: center;
            border-radius: 5px; 
            margin: 5px;
        }

        #presearch-presearchnews-package .video-item:hover .video-thumbnail {
            -moz-transition: background-size 0.2s ease-in;
            -web-kit-transition: background-size 0.2s ease-in;
            transition: background-size 0.2s ease-in;
            background-size: 105%;
        }
        
        #presearch-presearchnews-package .recent-video .video-thumbnail:hover {
            -moz-transition: background-size 0.2s ease-in;
            -web-kit-transition: background-size 0.2s ease-in;
            transition: background-size 0.2s ease-in;
            background-size: 105%;
        }
        
        #presearch-presearchnews-package .video-item:hover {
            color: #363636;
        }

        .dark #presearch-presearchnews-package .video-item:hover {
            color: white;
        }
        
        #presearch-presearchnews-package .recent-video .video-thumbnail {
            width: 300px;
            height: 165px;
        }
        #presearch-presearchnews-package .video-item-main:not(.flex) .video-thumbnail {
            margin-top: 15px;
        }
        
        #presearch-presearchnews-package .flex {
            display: flex;
        }

        #presearch-presearchnews-package .recent-video-details {
            margin-left: 5px;
        }

        #presearch-presearchnews-package .video-item-main.flex .recent-video-details {
            margin-left: 15px;
        }
        
        #presearch-presearchnews-package .recent-video .video-item-description {
            font-size: 12px;
            height: 145px;
            -webkit-mask-image: -webkit-gradient(linear, left 55%, left bottom, from(black), to(rgba(0, 0, 0, 0)));
            mask-image: -webkit-gradient(linear, left 55%, left bottom, from(black), to(rgba(0, 0, 0, 0)));
            overflow-wrap: anywhere;
            white-space: break-spaces;
        }
        
        #presearch-presearchnews-package .video-item-description a {
            color: #3b82f6;
        }

        #presearch-presearchnews-package .video-item-release {
            margin: 0px 8px 5px 8px;
            font-weight: normal;
            font-style: italic;
        }
        #presearch-presearchnews-package .recent-video .video-item-release {
            margin: 0px 0px 5px 0px;
        }

        #presearch-presearchnews-package .older-videos {
            display: flex;
            overflow-x: auto;
            margin: 10px 0;
        }
        
        #presearch-presearchnews-package .older-videos-header {
            font-size: 18px;
            margin-left: 5px;
            margin-top: 5px;
            border-bottom: 1px solid gray;
            padding-bottom: 3px;
        }

        #presearch-presearchnews-package .video-item-expand {
            width: 45px;
            height: 45px;
            position: absolute;
            top: -25px;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-bottom: 1px;
        }

        #presearch-presearchnews-package .video-item-expand.up {
            transform: rotate(180deg);
        }
        
        #presearch-presearchnews-package .video-item-description.expanded {
            height: inherit;
            mask-image: none;
            -webkit-mask-image: none;
        }

        #presearch-presearchnews-package .video-item-expand-container {
            position: relative;
            opacity: 0.8;
        }

        #presearch-presearchnews-package .chevron-double-down::after,
        #presearch-presearchnews-package .chevron-double-down::before {
            content: "";
            display: block;
            box-sizing: border-box;
            width: 8px;
            height: 8px;
            border-bottom: 2px solid;
            border-right: 2px solid;
            transform: rotate(45deg);
            left: 7px;
            top: 3px
        }
        #presearch-presearchnews-package .chevron-double-down::after {
            top: 8px
        }

        @media only screen and (min-width: 768px) {
            #presearch-presearchnews-package {
                width: 554px;
            }
        }
        
        @media only screen and (min-width: 1024px) {
            #presearch-presearchnews-package {
                width: 644px;
            }
        }
    </style> 
    `;
}

async function getVideos() {
    const toContract = async (data) => {
        const anchorify = (text) => {
            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            var text1 = text.replace(exp, "<a href='$1'>$1</a>");
            var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
        };

        const urlToBase64 = async (url) => {
            try {
                const base64 = Buffer.from((await axios.get(url, { responseType: "arraybuffer", })).data, "utf-8").toString("base64");
                return `data:image/webp;base64,${base64}`;
            }
            catch (error) {
                return ""
            }
        };

        const items = data.result.items.map(async (item)=>{
            const url = `https://odysee.com${item.canonical_url.replace(/^lbry:\//i, "")}`;
            const image = `https://thumbnails.odycdn.com/optimize/s:300:165/quality:85/plain/${item.value.thumbnail.url}`;

            return {
                title: item.value.title,
                url: url,
                image: await urlToBase64(image),
                description: anchorify(item.value.description),
                release: dayjs().to(item.timestamp * 1000)
            };
        });

        return await Promise.all(items);
    };

    try {
        const { data } = await axios.post(LBRY_API_URL,
            {
                method: "claim_search",
                params: {
                    channel_ids: [LBRY_PRESEARCH_CHANNEL_ID],
                    claim_type: ["stream"],
                    order_by: ["release_time"],
                    page: 1,
                    page_size: 6
                }
            });

        return toContract(data);
    }
    catch (error) {
        return { data: { error } }
    }
}

async function trigger(query) {
    const parts = ((query || "").toLowerCase()).split(" ");

    if (parts.length < 2) {
        return false;
    }

    const prePart = ["presearch", "pre"];
    const otherPart = ["news", "video", "videos", "weekly", "update", "updates"];

    return parts.some(p => prePart.indexOf(p) !== -1) && parts.some(p => otherPart.indexOf(p) !== -1);
}

module.exports = { presearchNews, trigger };