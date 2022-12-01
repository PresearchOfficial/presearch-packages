'use strict';

const axios = require("axios");
const dayjs = require("dayjs");
const relativeTimePlugin = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTimePlugin);

const LBRY_API_URL = "https://api.na-backend.odysee.com/api/v1/proxy";
const LBRY_PRESEARCH_CHANNEL_ID = "4f4fb7a173dcad5ccd95a56dac2e8e9efe9bdfa6";
const MEDIUM_FEED_URL = "https://medium.com/feed/@presearch";
const MEDIUM_FEED_NORMALIZER_URL = `https://api.rss2json.com/v1/api.json?rss_url=${MEDIUM_FEED_URL}`;
const THUMBNAL_OPTIMIZATION_URL = "https://thumbnails.odycdn.com/optimize/s:300:165/quality:85/plain";
const NEWS_COUNT_TO_FETCH_BY_SOURCE = 5;

async function presearchNews(query, API_KEY) {
    const news = await getNews();

    if (!news || !news.length || news.error) {
        return null;
    }

    const recentNews = news[0];
    const previousNews = news.slice(1);

    const createNews = () =>
        previousNews.map((news) => `
            <li class="news-item">
                <a href="${news.url}">
                    <div class="overlay-play-button">
                        <div class="news-thumbnail" style="background-image: url(${news.image})"></div>
                        <div class="${news.type === "video" ? "": "hidden"} overlay-play-button__overlay">
                            <div class="overlay-play-button__play">
                                <i class="play-button-icon"></i>
                            </div>
                        </div>
                    </div>

                    <div class="news-item-release">
                        ${news.release}
                    </div>
                    <div class="news-item-title link">
                        ${news.title}
                    </div>
                </a>
            </li>`).join('');

    return `
    <div id="presearch-presearchnews-package">
        <section>
            <div class="recent-news">
                <div class="news-item-title">
                    <a class="link" href="${recentNews.url}">
                        ${recentNews.title}
                    </a>
                </div>
                <div class="news-item-main flex flex-col md:flex-row">
                    <a href="${recentNews.url}">
                        <div class="overlay-play-button">
                            <div class="news-thumbnail" style="background-image: url(${recentNews.image})"></div>
                            <div class="${recentNews.type === "video" ? "": "hidden"} overlay-play-button__overlay">
                                <div class="overlay-play-button__play">
                                    <i class="play-button-icon"></i>
                                </div>
                            </div>
                        </div>
                    </a>
                    <div class="recent-news-details">
                        <div class="news-item-release">
                            ${recentNews.release}
                        </div>
                        <pre class="news-item-description">${recentNews.description}</pre>
                    </div>
                </div>
            </div>

            <div class="previous-news-header">
                Previous news
            </div>

            <ol class="previous-news">
                ${createNews()}
            </ol>
        </section>
    </div>

    <style>
        #presearch-presearchnews-package {
            color: #666666;
            cursor: default;
        }

        .dark #presearch-presearchnews-package {
            color: #ced5e2;
        }

        #presearch-presearchnews-package .news-item {
            width: 200px;
            min-width: 200px;
            font-weight: bold;
            font-size: 14px;
            border-radius: 5px;
        }
        
        #presearch-presearchnews-package .link:hover {
            color: #71a7ff;
        }
        
        #presearch-presearchnews-package .recent-news {
            cursor: pointer;
        }

        #presearch-presearchnews-package .recent-news .news-item-title {
            font-size: 20px;
            font-weight: bold;
            margin: 0 5px 10px 5px;
            max-height: 60px;
        }

        #presearch-presearchnews-package .news-item-title {
            margin: 0px 8px 12px 8px;
            max-height: 60px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: clip;
        }

        #presearch-presearchnews-package .news-item:hover {
            background-color: #dddddd;
        }
        
        #presearch-presearchnews-package .news-item:hover .link,
        #presearch-presearchnews-package .recent-news:hover .link {
            color: #6797e6;
        }

        .dark #presearch-presearchnews-package .news-item:hover {
            background-color: #3d3e40;
        }

        #presearch-presearchnews-package .news-thumbnail {
            object-fit: cover;
            background: black;
            height: 105px;
            margin-bottom: 5px;
            background-size: 100%;
            background-position: center;
            border-radius: 5px; 
            margin: 5px;
        }

        #presearch-presearchnews-package .news-item:hover .news-thumbnail,
        #presearch-presearchnews-package .recent-news:hover .news-thumbnail {
            -moz-transition: background-size 0.2s ease-in;
            -web-kit-transition: background-size 0.2s ease-in;
            transition: background-size 0.2s ease-in;
            background-size: 105%;
            border: 2px solid #6797e6;
        }
        
        #presearch-presearchnews-package .news-item:hover {
            color: #363636;
        }

        .dark #presearch-presearchnews-package .news-item:hover {
            color: white;
        }
        
        #presearch-presearchnews-package .recent-news .news-thumbnail {
            width: 300px;
            height: 165px;
        }
        #presearch-presearchnews-package .news-item-main:not(.flex) .news-thumbnail {
            margin-top: 15px;
        }
        
        #presearch-presearchnews-package .flex {
            display: flex;
        }

        #presearch-presearchnews-package .recent-news-details {
            margin-left: 5px;
            cursor: default;
        }

        #presearch-presearchnews-package .news-item-main.flex .recent-news-details {
            margin-left: 15px;
        }
        
        #presearch-presearchnews-package .recent-news .news-item-description {
            font-size: 12px;
            height: 145px;
            overflow:auto;
            white-space: break-spaces;
        }
        
        #presearch-presearchnews-package .recent-news .news-item-description h3 {
            font-size: 14px;
            line-height: 20px;
        }
        
        #presearch-presearchnews-package .news-item-description a {
            color: #71a7ff;
        }

        #presearch-presearchnews-package .news-item-release {
            margin: 0px 6px;
            font-weight: normal;
            font-style: italic;
        }
        #presearch-presearchnews-package .recent-news .news-item-release {
            margin: 0px 0px 5px 0px;
        }

        #presearch-presearchnews-package .previous-news {
            display: flex;
            overflow-x: auto;
            margin: 10px 0;
        }
        
        #presearch-presearchnews-package .previous-news-header {
            font-size: 18px;
            margin-left: 5px;
            margin-top: 5px;
            border-bottom: 1px solid gray;
            padding-bottom: 3px;
            font-weight: bold;
        }

        #presearch-presearchnews-package .play-button-icon {
            background: transparent;
            box-sizing: border-box;
            width: 0;
            height: 55px;

            border-color: transparent transparent transparent #404040;
            transition: 100ms all ease;
            cursor: pointer;

            border-style: solid;
            border-width: 29px 0 29px 49px;
        }

        #presearch-presearchnews-package .previous-news .play-button-icon {
            border-width: 18px 0 18px 30px;
            height: 34px;
        }

        #presearch-presearchnews-package .news-item:hover .play-button-icon, 
        #presearch-presearchnews-package .recent-news:hover .play-button-icon {
            border-color: transparent transparent transparent #313131;
            -moz-transition: transform 0.2s ease-in;
            -web-kit-transition: transform 0.2s ease-in;
            transition: transform 0.2s ease-in;
            transform: scale(1.2);
        }

        #presearch-presearchnews-package .overlay-play-button {
            position: relative;
        }
        
        #presearch-presearchnews-package .hidden {
            display: none !important;
        }

        #presearch-presearchnews-package .overlay-play-button__overlay {
            left: 0;
            position: absolute;
            top: 0;
            height: 100%;
            width: 100%;
            align-items: center;
            display: flex;
            justify-content: center;
        }

        #presearch-presearchnews-package .overlay-play-button__play {
            align-items: center;
            display: flex;
            justify-content: center;
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

async function getNews() {
    try {
        var news = await Promise.all([getVideos(), getArticles()]);
        return news.filter(x => !x.error)
            .flat()
            .sort((a, b) => (a.release < b.release ? 1 : -1))
            .map(n => ({ ...n, release: dayjs().to(n.release) }));
    }
    catch (error) {
        return { error };
    }
}

async function getVideos() {
    const toContract = async (data) => {
        const anchorify = (text) => {
            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            var text1 = text.replace(exp, "<a href='$1'>$1</a>");
            var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
        };

        const items = data.result.items.map(async (item) => {
            const url = `https://odysee.com${item.canonical_url.replace(/^lbry:\//i, "")}`;
            const image = `${THUMBNAL_OPTIMIZATION_URL}/${item.value.thumbnail.url}`;

            return {
                title: item.value.title,
                url: url,
                type: "video",
                image: await urlToBase64(image),
                description: anchorify(item.value.description),
                release: dayjs(item.timestamp * 1000)
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
                    page_size: NEWS_COUNT_TO_FETCH_BY_SOURCE
                }
            });

        return toContract(data);
    }
    catch (error) {
        return { error };
    }
}

async function getArticles() {
    const toContract = async (data) => {
        const items = data.items.slice(0, NEWS_COUNT_TO_FETCH_BY_SOURCE)
            .map(async (item) => {
                const image = `${THUMBNAL_OPTIMIZATION_URL}/${item.thumbnail}`;
                const content = item.content.replace(/<img .*?>/g, '');

                return {
                    title: item.title,
                    url: item.link,
                    type: "article",
                    image: await urlToBase64(image),
                    description: content,
                    release: dayjs(item.pubDate)
                };
            });

        return await Promise.all(items);
    };

    try {
        const { data } = await axios.get(MEDIUM_FEED_NORMALIZER_URL);
        return toContract(data);
    }
    catch (error) {
        return { error };
    }
}

async function urlToBase64(url) {
    try {
        const base64 = Buffer.from((await axios.get(url, { responseType: "arraybuffer", })).data, "utf-8").toString("base64");
        return `data:image/webp;base64,${base64}`;
    }
    catch (error) {
        return ""
    }
};

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