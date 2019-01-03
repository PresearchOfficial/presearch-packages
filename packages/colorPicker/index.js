'use strict';
const fs = require('fs');

const path = require("path");
const css = fs.readFileSync(path.resolve(__dirname, "./main.css")); // css style file
const script = fs.readFileSync(path.resolve(__dirname, "./jscolor.js")); // javascript file


function colorPicker(query) {

    return `
    <style>
        ${css}
        .answerInner {max-width: 1920px !important;}
    </style>
    <script>
        ${script}
    </script>	
    <div id="color-picker">

        <div id="picker-preview" style="background-color: rgb(171, 37, 103); border-color: rgb(255, 255, 255); color: rgb(255, 255, 255);">
            <p>Foreground preview</p>
        </div>

        <div class="panel bgcolor">
            <button id="bgcolor-button" style="background-image: none; background-color: rgb(171, 37, 103); color: rgb(255, 255, 255);" class="">Choose background</button>
            <table>
                <tbody><tr><th>RGB</th><td><input id="bgcolor-rgb" onchange="setString('bgcolor', this.value)"></td></tr>
                <tr><th>HEX</th><td><input id="bgcolor-hex" onchange="setString('bgcolor', this.value)"></td></tr>

                <tr><th>H</th><td><input id="bgcolor-hue" class="short" onchange="setHSV('bgcolor', this.value, null, null)"> &#xB0;</td></tr>
                <tr><th>S</th><td><input id="bgcolor-sat" class="short" onchange="setHSV('bgcolor', null, this.value, null)"> %</td></tr>
                <tr><th>V</th><td><input id="bgcolor-val" class="short" onchange="setHSV('bgcolor', null, null, this.value)"> %</td></tr>

                <tr class="red"><th>R</th><td><input id="bgcolor-red" class="short" onchange="setRGB('bgcolor', this.value, null, null)"></td></tr>
                <tr class="grn"><th>G</th><td><input id="bgcolor-grn" class="short" onchange="setRGB('bgcolor', null, this.value, null)"></td></tr>
                <tr class="blu"><th>B</th><td><input id="bgcolor-blu" class="short" onchange="setRGB('bgcolor', null, null, this.value)"></td></tr>
            </tbody></table>
        </div>


        <div class="panel fgcolor">
            <button id="fgcolor-button" style="background-image: none; background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);" class="">Choose foreground</button>
            <table>
                <tbody><tr><td><input id="fgcolor-rgb" onchange="setString('fgcolor', this.value)"></td><th>RGB</th></tr>
                <tr><td><input id="fgcolor-hex" onchange="setString('fgcolor', this.value)"></td><th>HEX</th></tr>

                <tr><td>&#xB0; <input id="fgcolor-hue" class="short" onchange="setHSV('fgcolor', this.value, null, null)"></td><th>H</th></tr>
                <tr><td>% <input id="fgcolor-sat" class="short" onchange="setHSV('fgcolor', null, this.value, null)"></td><th>S</th></tr>
                <tr><td>% <input id="fgcolor-val" class="short" onchange="setHSV('fgcolor', null, null, this.value)"></td><th>V</th></tr>

                <tr class="red"><td><input id="fgcolor-red" class="short" onchange="setRGB('fgcolor', this.value, null, null)"></td><th>R</th></tr>
                <tr class="grn"><td><input id="fgcolor-grn" class="short" onchange="setRGB('fgcolor', null, this.value, null)"></td><th>G</th></tr>
                <tr class="blu"><td><input id="fgcolor-blu" class="short" onchange="setRGB('fgcolor', null, null, this.value)"></td><th>B</th></tr>
            </tbody></table>
            
        </div>
        <p>Color picker script by <a href="http://jscolor.com/" target="_blank">jscolor.com</a></p>
        <script>
        var options = {
            valueElement: null,
            width: 300,
            height: 120,
            sliderSize: 20,
            position: 'top',
            borderColor: '#CCC',
            insetColor: '#CCC',
            backgroundColor: '#202020'
        };

        var pickers = {};

        pickers.bgcolor = new jscolor('bgcolor-button', options);
        pickers.bgcolor.onFineChange = "update('bgcolor')";
        pickers.bgcolor.fromString('53acfd');

        pickers.fgcolor = new jscolor('fgcolor-button', options);
        pickers.fgcolor.onFineChange = "update('fgcolor')";
        pickers.fgcolor.fromString('FFFFFF');

        function update (id) {
            document.getElementById('picker-preview').style.backgroundColor =
                pickers.bgcolor.toHEXString();

            document.getElementById('picker-preview').style.color =
            document.getElementById('picker-preview').style.borderColor =
                pickers.fgcolor.toHEXString();

            document.getElementById(id + '-rgb').value = pickers[id].toRGBString();
            document.getElementById(id + '-hex').value = pickers[id].toHEXString();

            document.getElementById(id + '-hue').value = Math.round(pickers[id].hsv[0]);
            document.getElementById(id + '-sat').value = Math.round(pickers[id].hsv[1]);
            document.getElementById(id + '-val').value = Math.round(pickers[id].hsv[2]);

            document.getElementById(id + '-red').value = Math.round(pickers[id].rgb[0]);
            document.getElementById(id + '-grn').value = Math.round(pickers[id].rgb[1]);
            document.getElementById(id + '-blu').value = Math.round(pickers[id].rgb[2]);
        }

        function setHSV (id, h, s, v) {
            pickers[id].fromHSV(h, s, v);
            update(id);
        }

        function setRGB (id, r, g, b) {
            pickers[id].fromRGB(r, g, b);
            update(id);
        }

        function setString (id, str) {
            pickers[id].fromString(str);
            update(id);
        }

        update('bgcolor');
        update('fgcolor');
        </script>
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