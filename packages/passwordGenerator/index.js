'use strict';

const { parseAndNormalize, generate } = require('./services');

async function passwordGenerator(query) {
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
      <div id="passwordGenerator" >
          <div class="title"><a href="/passwordGenerator?q=pass+8">Random password has been created</a></div>
          <div id="pw"></div>
          <span title="Copy" class="material-symbols-outlined" id="copy">content_copy</span>
      </div>
      <div class="disclaimer">
          <div><b>Examples</b></div>
          <div><a href="/passwordGenerator?q=pass+8">pass 8</a> generates 8 chars password</div>
          <div><a href="/passwordGenerator?q=password+12">password 12</a> generates 12 chars password</div>
          <div><a href="/passwordGenerator?q=random+pw+32">random pw 20</a> generates 20 chars password</div>
      </div>
    </div>
    <style>

    #passwordGenerator {
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

    #pw {
        margin: 16px 0;
        padding: 16px;
        text-align: left;
        border-left: 4px solid #127fff;
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
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

    .dark #passwordGenerator {
      color: white;
    }

    .disclaimer {
      font-size: x-small;
      color: grey;
    }

    .disclaimer a {
      text-decoration: underline;
    }
    @media only screen and (max-width:400px) {
      .to.shrink {
        font-size: large;
        margin-bottom: 2px;
      }
    }
    </style>

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
    const pw = document.querySelector("#pw");
    const copy = document.querySelector("#copy");
    pw.textContent = "${generatedStr}";

    copy.addEventListener(isMobile ? "touchstart" : "mousedown", () => {
      copyToClipboard("pw");

      let temp = pw.textContent;
      pw.textContent = "Copied!";
      setTimeout(() => {
        pw.textContent = temp;
      }, 500);

    });

    </script>
  `;
}

function trigger(query) {
  return parseAndNormalize(query.toLowerCase()) !== undefined;
}

module.exports = { passwordGenerator, trigger };
