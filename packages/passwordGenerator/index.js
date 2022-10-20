'use strict';
const { parseAndNormalize, generate } = require('./services');
async function passwordGenerator(query) {
  const length = parseAndNormalize(query);
  if (!length) {
    return { error: "Failed to parse query." };
  }
  const generatedStr = generate(length);
  if (!generatedStr) {
    return { error: "Failed to generate password." };
  }

  return `
    <div id="presearchPackage">
      <div id="passwordGenerator">
          <div id="title" class="title">Random password has been created</div>
          <div id="pw-container">
            <div id="pw"></div>
            <span id="copy" title="Copy">
              <svg style="width:20px;" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M502.6 70.63l-61.25-61.25C435.4 3.371 427.2 0 418.7 0H255.1c-35.35 0-64 28.66-64 64l.0195 256C192 355.4 220.7 384 256 384h192c35.2 0 64-28.8 64-64V93.25C512 84.77 508.6 76.63 502.6 70.63zM464 320c0 8.836-7.164 16-16 16H255.1c-8.838 0-16-7.164-16-16L239.1 64.13c0-8.836 7.164-16 16-16h128L384 96c0 17.67 14.33 32 32 32h47.1V320zM272 448c0 8.836-7.164 16-16 16H63.1c-8.838 0-16-7.164-16-16L47.98 192.1c0-8.836 7.164-16 16-16H160V128H63.99c-35.35 0-64 28.65-64 64l.0098 256C.002 483.3 28.66 512 64 512h192c35.2 0 64-28.8 64-64v-32h-47.1L272 448z"/></svg>
            </span>
          </div>
         
      </div>
      <div class="disclaimer">
          <div class="disclaimer_example"><b>Examples</b></div>
          <div class="disclaimer_sample"><a href="/search?q=pass+8">Pass 8</a> generates 8 chars password</div>
          <div class="disclaimer_sample"><a href="/search?q=password+12">Password 12</a> generates 12 chars password</div>
          <div class="disclaimer_sample"><a href="/search?q=random+pw+32">Random pw 20</a> generates 20 chars password</div>
      </div>
    </div>
   
    <script>
    const copyTextToClipboard  = (text) => {
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
    const pw = document.querySelector("#pw");
    const copy = document.querySelector("#copy");
    pw.textContent = "${generatedStr}";
    copy.addEventListener(isMobile ? "touchstart" : "mousedown", () => {
      copyTextToClipboard(pw.textContent);
      let temp = copy.innerHTML;
      copy.innerHTML = "Copied!";
      setTimeout(() => {
        copy.innerHTML = temp;
      }, 500);
    });
    </script>
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
    }

    #copy {
      margin-left: 12px;
      cursor: pointer;
      user-select: none;
    }

    #copy:hover {
      transition: all;
      opacity: 0.6;
    }

    #pw-container {
      display:flex;
      align-items:center;
    }
    #pw {
        text-align: left;
        font-weight: 400;
        margin: 8px 0;
        padding: 8px 24px;
        border-left: 4px solid #127fff;
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        width: max-content;
        max-width: 90%;
        word-break: break-all;
    }
    #pw:hover{
      transition: all ease 200ms;
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

module.exports = { passwordGenerator, trigger };
