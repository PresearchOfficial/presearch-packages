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
      <link rel="stylesheet" type="text/css" href="/css/passwordgenerator.css">
     </head>
    <div id="presearchPackage">
      <div id="passwordGenerator">
          <div id="title" class="title"><a href="/passwordGenerator?q=pass+8">Random password has been created</a></div>
          <div id="pw"></div>
          <span id="copy" class="material-symbols-outlined" title="Copy">content_copy</span>
      </div>
      <div class="disclaimer">
          <div class="disclaimer_example"><b>Examples</b></div>
          <div class="disclaimer_sample"><a href="/passwordGenerator?q=pass+8">Pass 8</a> generates 8 chars password</div>
          <div class="disclaimer_sample"><a href="/passwordGenerator?q=password+12">Password 12</a> generates 12 chars password</div>
          <div class="disclaimer_sample"><a href="/passwordGenerator?q=random+pw+32">Random pw 20</a> generates 20 chars password</div>
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
