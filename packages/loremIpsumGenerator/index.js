'use strict';
const { parseAndNormalize, generate } = require('./services');
async function loremIpsumGenerator(query) {
  const length = parseAndNormalize(query);
  if (!length) {
    return undefined;
  }
  const generatedStr = generate(length);
  if (!generatedStr) {
    return undefined;
  }

  return `
    <div id="presearchPackage">
      <div id="packageContainer">
          <div id="title" class="title">Lorem ipsum placeholder text has been created</div>
          <div id="output"></div>
          <span id="copy" title="Copy">
            <svg style="width:20px;" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z"/></svg>
          </span>
      </div>
      <div class="disclaimer">
          <div class="disclaimer_example"><b>Examples</b></div>
          <div class="disclaimer_sample"><a href="/search?q=lorem+10">Lorem Ipsum 10</a> generates 10 words</div>
          <div class="disclaimer_sample"><a href="/search?q=lorem+ipsum+64">Lorem Ipsum 64</a> generates 64 words</div>
          <div class="disclaimer_sample"><a href="/search?q=ipsum+100">Lorem Ipsum 100</a> generates 100 words</div>
      </div>
    </div>

    <script>
    const copyTextToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
      }, (err) => {
        console.error('Async: Could not copy text: ', err);
      });
    }
  	let isMobile = false;
  	if (window.innerWidth < 500) {
    	isMobile = true;
    }
    const title = document.querySelector(".title");
    const output = document.querySelector("#output");
    const copy = document.querySelector("#copy");
    output.textContent = "${generatedStr}";
    copy.addEventListener(isMobile ? "touchstart" : "mousedown", () => {
      copyTextToClipboard("${generatedStr}");
      let temp = output.textContent;
      output.textContent = "Copied!";
      setTimeout(() => {
        output.textContent = temp;
      }, 500);
    });
    </script>
    <style>

    #packageContainer {
      box-sizing: border-box;
      border: none;
      margin: 0;
      color: #000;
      text-align: left;
      display: block;
      width: auto;
      position: relative;
    }

    .title {
       padding-bottom: 6px;
       width: 90%;
    }

    #output {
        margin: 8px 0;
        padding: 8px 24px;
        text-align: left;
        font-weight: 400;
        border-left: 4px solid #127fff;
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
    #output:hover{
      transition: all ease 200ms;
    }

    #copy {
      position: absolute;
      top: 0;
      right: 0;
      padding: 6px;
      cursor: pointer;
    }

    .dark #packageContainer {
      color: white;
    }

    .disclaimer {
      font-size: x-small;
      color: grey;
    }
    .disclaimer_example{
      color: grey;
    }
    .disclaimer a {
      text-decoration: underline;
      color: #3083e3;
    }
    .dark .disclaimer a {
      color: #80baff;
    }
    @media only screen and (max-width:400px) {
      .to.shrink {
        font-size: large;
        margin-bottom: 2px;
      }
    }
    </style>
  `;
}

function trigger(query) {
  return parseAndNormalize(query.toLowerCase()) !== undefined;
}

module.exports = { loremIpsumGenerator, trigger };
