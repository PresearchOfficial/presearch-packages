'use strict';
const fs = require('fs');

const path = require("path");
const script = fs.readFileSync(path.resolve(__dirname, "./main.js")); // javascript file


function colorPicker(query) {

    return `
    <script>${script}</script>
    <style>
    .colors {
    padding: 5px 0 5px 0;
    box-sizing: border-box;
    border: none;
    font-weight: 600;
    background: #c0c0c0;
    text-align: center;
    margin:0;
  }
  .copied {
    background: #50cc64 !important;
  }
</style>
    <div class="main" style="background: #eff2f5; margin-left: 0px; margin-top: 0;">
        <div style="position: relative;">
            <canvas id="layer1" width="255" height="255" 
              style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>
            <canvas id="layer2" width="255" height="255" 
              style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>
           </div>
           <p style="margin-left: 325px;margin-bottom: 10px;font-weight: 600;">Preview: </p>
           <canvas id="result" style='margin-left: 280px; margin-bottom:5px; margin-top: 0px;' width="150px" height="150px"></canvas>
           <div style='margin-left: 280px; width:150px !important;'><input class="colors" style="width:150px !important;" type="text" id="hex" readonly="readonly"/></div>
           <div style='margin-left: 280px; width:150px !important;'><input class="colors" style="width:150px !important;" type="text" id="rgb" readonly="readonly"/></div>
      
           <div style="position: relative; margin-top: 30px;">
            <canvas id="layer1-small" width="306" height="20" 
              style="position: absolute; left: 0; top: 0; z-index: 0; margin-top:3px;"></canvas>
            <canvas id="layer2-small" width="306" height="26" 
              style="position: absolute; left: 0; top: 0; z-index: 1; border: 0;"></canvas>
           </div>
    </div>
    `;
  }
  
  // This line is for testing package with browserify bundle 
  // window.starWarsQuote = starWarsQuote();
  
  function trigger(query) {
    query = query.toLowerCase();
    return query === 'color picker' || query === 'html color picker' || query === 'rgb palette' || query === 'rgb color' || query === 'rgb color code' 
    || query === 'rgb code' || query === 'rgb picker' || query === 'hex color' || query === 'hex color code' || query === 'hex to rgb' || query === 'rgb to hex';
  }
  
  module.exports = { colorPicker, trigger };