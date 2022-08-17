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
    <head>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
     </head>
    <div id="presearchPackage">
      <div id="packageContainer">
          <div id="title" class="title"><a href="/loremIpsumGenerator?q=lorem+100">Lorem ipsum placeholder text has been created</a></div>
          <div id="output"></div>
          <span id="copy" class="material-symbols-outlined" title="Copy">content_copy</span>
      </div>
      <div class="disclaimer">
          <div class="disclaimer_example"><b>Examples</b></div>
          <div class="disclaimer_sample"><a href="/loremIpsumGenerator?q=lorem+10">Lorem Ipsum 10</a> generates 10 words</div>
          <div class="disclaimer_sample"><a href="/loremIpsumGenerator?q=lorem+ipsum+64">Lorem Ipsum 64</a> generates 64 words</div>
          <div class="disclaimer_sample"><a href="/loremIpsumGenerator?q=ipsum+100">Lorem Ipsum 100</a> generates 100 words</div>
      </div>
    </div>

    <script>
    function copyToClipboard(containerId) {
        const range = document.createRange();
        range.selectNode(document.getElementById(containerId));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
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
      copyToClipboard("output");
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
       color: #127fff;
    }

    #output {
        margin: 8px 0;
        padding: 8px 24px;
        text-align: left;
        font-weight: 400;
        border-left: 4px solid #127fff;
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        letter-spacing: 2px;
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

    .material-symbols-outlined {
      font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 48
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
    .disclaimer_sample{
      color: #127fff;
    }
    .disclaimer a {
      text-decoration: underline;
      color: grey;
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
