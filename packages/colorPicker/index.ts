"use strict";

function colorPicker(_query: string): string {
  return `
    <style>
    #layer1 {
        border-radius: 10px;
        position: absolute;
        left: 50px;
        top: 50px;
    }
    #layer2 {
        border-radius: 10px;
        position: absolute;
        left: 35px;
        top: 35px;
    }
    #result {
        position: absolute;
        left: 400px;
        top: 50px;
        width:100px;
        height:100px;
    }

    #outer-layer1{
        position: absolute;
        top: 50px;
        left: 320px;
        border-radius: 5px;
    }

    #outer-layer2 {
        position: absolute;
        top: 45px;
        left: 315px;
    }

    #color-values {
        position: absolute;
        left: 375px;
        top: 180px;
        width:100px;
        height:100px;
    }
    .colors {
        padding: 5px 0 5px 0;
        box-sizing: border-box;
        border: none;
        font-weight: 600;
        background: #c0c0c0;
        text-align: center;
        margin:0;
      }
    </style>
    <div style='position: relative; height: 340px;'>
    <canvas id='layer1' width='250' height='250' style='z-index: 1;'></canvas>
    <canvas id='layer2' width='280' height='280' style='z-index: 2;'></canvas>
    <canvas id='outer-layer1' width='30' height='250' style='z-index: 3;'></canvas>
    <canvas id='outer-layer2' width='40' height='260' style='z-index: 4;'></canvas>
    <div id='result'>
      <svg version='1.1' id='colorpicker_logo' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
         viewBox='0 0 100 100' xml:space='preserve'>
      <title>presearch-logo</title>
      <path d='M35.3,62h9.7c2.8,0,5.5-0.6,8-1.8c2.4-1.2,4.5-2.8,6.3-4.8c1.7-2.1,3.1-4.4,4-7c1-2.6,1.4-5.3,1.4-8.1
        c0-2.7-0.5-5.3-1.5-7.8c-1-2.5-2.4-4.8-4.2-6.8c-1.8-2-4-3.7-6.4-4.9c-2.5-1.3-5.2-1.9-8-1.9H19V81h16.3V62z M35.3,33.9h8.3
        c1.1,0.1,2.2,0.6,3,1.5c1,1,1.6,2.6,1.6,5.3c0,2.6-0.6,4.2-1.4,5c-0.7,0.9-1.7,1.4-2.8,1.4h-8.7V33.9z'/>
      <path d='M0,5.7v88.5c0,3.2,2.6,5.7,5.7,5.7h0h88.5c3.2,0,5.7-2.6,5.8-5.7V5.7c0-3.2-2.6-5.7-5.8-5.7H5.7
        C2.6,0,0,2.6,0,5.7z M82.5,88.2H17.4c-3.2,0-5.7-2.6-5.8-5.7V17.4c0-3.2,2.6-5.7,5.8-5.7h65.1c3.2,0,5.8,2.5,5.8,5.7c0,0,0,0,0,0.1
        v65.1C88.3,85.7,85.7,88.2,82.5,88.2C82.5,88.2,82.5,88.2,82.5,88.2z'/>
      <rect x='42.7' y='69.3' width='38.3' height='11.8'/>
      </svg>
    </div>
    <div id='color-values'>
      <input class='colors' style='width:150px !important;' type='text' id='hex' readonly='readonly'/>
      <input class='colors' style='width:150px !important;' type='text' id='rgb' readonly='readonly'/>
    </div>
  </div>
  <script>
  (function () {
    const layer1 = document.getElementById('layer1');
    const layer1_ctx = layer1.getContext('2d');
    const layer2 = document.getElementById('layer2');
    const layer2_ctx = layer2.getContext('2d');
    const outer_layer1_ctx = document.getElementById('outer-layer1').getContext('2d');
    const outer_layer2 = document.getElementById('outer-layer2');
    const outer_layer2_ctx = outer_layer2.getContext('2d');
    const result = document.querySelector('#colorpicker_logo');
    const hex = document.getElementById('hex');
    const rgb = document.getElementById('rgb');

    function rgbaToRgb(r, g, b, a) {
        let rR, rG, rB;
        rR = ((1 - a) * 255) + (a * r);
        rG = ((1 - a) * 255) + (a * g);
        rB = ((1 - a) * 255) + (a * b);
        rR = (rR < 255) ? Math.round(rR) : 255;
        rG = (rG < 255) ? Math.round(rG) : 255;
        rB = (rB < 255) ? Math.round(rB) : 255;
        return [rR, rG, rB];
    }

    function rgbToHex(rgb) {
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        return hex;
    };

    function fullColorHex(r, g, b) {
        let red = rgbToHex(r);
        let green = rgbToHex(g);
        let blue = rgbToHex(b);
        return ('#' + red + green + blue).toUpperCase();
    };

    const startPos = {
        x: 125,
        y: 125
    };
    const mainSwitchPos = {
        x: 125,
        y: 125
    };

    let dragStart = {
        x: 140,
        y: 140
    };

    const sideSwitchPos = {
        x: 3,
        y: 2
    };

    let drag, sideDrag, dragEnd, sideY;

    // draw side layer gradient
    const someColors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', ];
    let outer_layer1_gr = outer_layer1_ctx.createLinearGradient(0, 0, 0, 250);
    for (i = 0; i < someColors.length; i++) {
        let color = someColors[i];
        let part = 1 / (someColors.length - 1);
        outer_layer1_gr.addColorStop(part * i, color);
    }
    outer_layer1_ctx.fillStyle = outer_layer1_gr;
    outer_layer1_ctx.fillRect(0, 0, outer_layer1_ctx.canvas.width, outer_layer1_ctx.canvas.height);

    // side layer switch
    outer_layer2_ctx.fillStyle = '#000';
    outer_layer2_ctx.strokeStyle = '#000';
    outer_layer2_ctx.lineWidth = 2;
    outer_layer2_ctx.rect(5, 1, 30, 10);
    outer_layer2_ctx.stroke();

    // layer1 (color)
    function drawColorLayer(color = '#ff0000') {
        let layer1_gr = layer1_ctx.createLinearGradient(0, 0, 250, 0);
        layer1_gr.addColorStop(1, color);
        layer1_gr.addColorStop(.95, color);
        layer1_gr.addColorStop(0, '#fff');
        layer1_ctx.fillStyle = layer1_gr;
        layer1_ctx.fillRect(0, 0, layer1_ctx.canvas.width, layer1_ctx.canvas.height);
    }

    // layer1 (black n white)
    function drawBlackNWhiteLayer() {
        let layer1_gr2 = layer1_ctx.createLinearGradient(0, 0, 0, 250);
        layer1_gr2.addColorStop(1, 'rgba(0,0,0,1)');
        layer1_gr2.addColorStop(.95, 'rgba(0,0,0,1)');
        layer1_gr2.addColorStop(.5, 'rgba(0,0,0,0.2)');
        layer1_gr2.addColorStop(.4, 'rgba(0,0,0,0.1)');
        layer1_gr2.addColorStop(.1, 'rgba(0,0,0,0)');
        layer1_ctx.fillStyle = layer1_gr2;
        layer1_ctx.fillRect(0, 0, layer1_ctx.canvas.width, layer1_ctx.canvas.height);
    }

    // draw bg layers (color, black and white gradient)
    drawColorLayer();
    drawBlackNWhiteLayer();

    // set current color on main and side layers
    let currentColor = layer1_ctx.getImageData(mainSwitchPos.x, mainSwitchPos.y, 1, 1).data;
    let alpha = (currentColor[3] / 255).toFixed(2);
    currentColor = rgbaToRgb(currentColor[0], currentColor[1], currentColor[2], alpha)
    let sideColor = outer_layer1_ctx.getImageData(sideSwitchPos.x, sideSwitchPos.y, 1, 1).data;
    let sideAlpha = (sideColor[3] / 255).toFixed(2);
    sideColor = rgbaToRgb(sideColor[0], sideColor[1], sideColor[2], sideAlpha);

    // display color values on the page
    rgb.value = 'rgb(' + currentColor[0] + ', ' + currentColor[1] + ', ' + currentColor[2] + ')';
    hex.value = fullColorHex(currentColor[0], currentColor[1], currentColor[2]);

    result.style = 'fill: rgb(' + sideColor[0] + ', ' + sideColor[1] + ', ' + sideColor[2] + ')';


    // check if mouse is on switch
    function isMouseOnSwitch(layerX, layerY, switchPosX, switchPosY, switchSizeX, switchSizeY) {
        if (layerX > switchPosX && layerX < switchPosX + switchSizeX && layerY > switchPosY && layerY < switchPosY + switchSizeY) {
            return true;
        } else return false;
    }

    // draw function for the main switch
    function draw() {
        layer2_ctx.beginPath();
        layer2_ctx.arc(140, 140, 8, 0, 2 * Math.PI);
        layer2_ctx.fillStyle = 'rgb(' + currentColor[0] + ', ' + currentColor[1] + ', ' + currentColor[2] + ')';
        layer2_ctx.fill();
        if (currentColor[1] > 180) layer2_ctx.strokeStyle = '#000';
        else layer2_ctx.strokeStyle = '#fff';
        layer2_ctx.stroke();
    }

    draw();

    // clear function for the main switch
    function clear() {
        layer2_ctx.save();
        layer2_ctx.setTransform(1, 0, 0, 1, 0, 0);
        layer2_ctx.clearRect(0, 0, layer2.width, layer2.height);
        layer2_ctx.restore();
    }

    layer2.addEventListener('mousedown', e => {
        if (isMouseOnSwitch(e.layerX, e.layerY, mainSwitchPos.x + 5, mainSwitchPos.y + 5, 18, 18)) {
            dragStart = {
                x: e.layerX,
                y: e.layerY
            };
            drag = true;
        }
    });

    layer2.addEventListener('mousemove', e => {

        if (isMouseOnSwitch(e.layerX, e.layerY, mainSwitchPos.x + 5, mainSwitchPos.y + 5, 18, 18)) {
            layer2.style.cursor = 'pointer';
        } else layer2.style.cursor = 'default';

        if (drag) {
            dragEnd = {
                x: e.layerX,
                y: e.layerY
            };

            // set translate to 0 if switch is on max top/bottom/left/right (block switch to move out of range)
            mainY = ((mainSwitchPos.y < 2 && dragEnd.y - dragStart.y < 0) || (mainSwitchPos.y > 248 && dragEnd.y - dragStart.y > 0)) ? 0 : dragEnd.y - dragStart.y;
            mainX = ((mainSwitchPos.x < 2 && dragEnd.x - dragStart.x < 0) || (mainSwitchPos.x > 248 && dragEnd.x - dragStart.x > 0)) ? 0 : dragEnd.x - dragStart.x;

            startPos.x += mainX;
            startPos.y += mainY;
            mainSwitchPos.x = startPos.x;
            mainSwitchPos.y = startPos.y;
            layer2_ctx.translate(mainX, mainY);
            currentColor = layer1_ctx.getImageData(mainSwitchPos.x, mainSwitchPos.y, 1, 1).data;
            alpha = (currentColor[3] / 255).toFixed(2);
            currentColor = rgbaToRgb(currentColor[0], currentColor[1], currentColor[2], alpha);
            clear();
            draw();
            dragStart = dragEnd;

            result.style = 'fill: rgb(' + currentColor[0] + ', ' + currentColor[1] + ', ' + currentColor[2] + ')';


            // display color values on the page
            hex.value = fullColorHex(currentColor[0], currentColor[1], currentColor[2]);
            rgb.value = 'rgb(' + currentColor[0] + ', ' + currentColor[1] + ', ' + currentColor[2] + ')';
        }
    });

    layer2.addEventListener('mouseup', e => {
        drag = false;
        dragEnd = {
            x: e.layerX,
            y: e.layerY
        };

        // set translate to 0 if switch is on max top/bottom/left/right (block switch to move out of range)
        mainY = ((mainSwitchPos.y < 2 && dragEnd.y - dragStart.y < 0) || (mainSwitchPos.y > 248 && dragEnd.y - dragStart.y > 0)) ? 0 : dragEnd.y - dragStart.y;
        mainX = ((mainSwitchPos.x < 2 && dragEnd.x - dragStart.x < 0) || (mainSwitchPos.x > 248 && dragEnd.x - dragStart.x > 0)) ? 0 : dragEnd.x - dragStart.x;

        startPos.x += mainX;
        startPos.y += mainY;
        mainSwitchPos.x = startPos.x;
        mainSwitchPos.y = startPos.y;
        layer2_ctx.translate(mainX, mainY);
        currentColor = layer1_ctx.getImageData(mainSwitchPos.x, mainSwitchPos.y, 1, 1).data;
        alpha = (currentColor[3] / 255).toFixed(2);
        currentColor = rgbaToRgb(currentColor[0], currentColor[1], currentColor[2], alpha)
        clear();
        draw();
        dragStart = dragEnd;
        layer2.style.cursor = 'pointer';

        result.style = 'fill: rgb(' + currentColor[0] + ', ' + currentColor[1] + ', ' + currentColor[2] + ')';

        // display color values on the page
        hex.value = fullColorHex(currentColor[0], currentColor[1], currentColor[2]);
        rgb.value = 'rgb(' + currentColor[0] + ', ' + currentColor[1] + ', ' + currentColor[2] + ')';
    });


    outer_layer2.addEventListener('mousemove', e => {

        if (isMouseOnSwitch(e.layerX, e.layerY, sideSwitchPos.x, sideSwitchPos.y, 34, 14)) outer_layer2.style.cursor = 'pointer';
        else outer_layer2.style.cursor = 'default';

        if (sideDrag) {
            sideDragEnd = {
                x: e.layerX,
                y: e.layerY
            };

            // set translate to 0 if switch is on max top/bottom (block switch to move out of range)
            sideY = ((sideSwitchPos.y < 2 && sideDragEnd.y - sideDragStart.y < 0) || (sideSwitchPos.y > 248 && sideDragEnd.y - sideDragStart.y > 0)) ? 0 : sideDragEnd.y - sideDragStart.y;
            sideSwitchPos.y += sideY;

            // move the switch (translate), clear and draw again
            outer_layer2_ctx.translate(0, sideY);
            outer_layer2_ctx.clearRect(0, 0, outer_layer2.width, outer_layer2.height);
            outer_layer2_ctx.clearRect(0, 0, outer_layer2.width, -outer_layer2.height);
            outer_layer2_ctx.beginPath();
            outer_layer2_ctx.rect(5, 2, 30, 10);
            outer_layer2_ctx.stroke();

            sideColor = outer_layer1_ctx.getImageData(sideSwitchPos.x, sideSwitchPos.y, 1, 1).data;
            sideDragStart = sideDragEnd;

            // draw bg layers (color, black and white gradient)
            drawColorLayer('rgba(' + sideColor[0] + ', ' + sideColor[1] + ', ' + sideColor[2] + ', ' + sideAlpha + ')');

            drawBlackNWhiteLayer();

            // save current color value from main switch position
            currentColor = layer1_ctx.getImageData(mainSwitchPos.x, mainSwitchPos.y, 1, 1).data;
            alpha = (currentColor[3] / 255).toFixed(2);
            currentColor = rgbaToRgb(currentColor[0], currentColor[1], currentColor[2], alpha);

            result.style = 'fill: rgb(' + currentColor[0] + ', ' + currentColor[1] + ', ' + currentColor[2] + ')';

            clear();
            draw();
            hex.value = fullColorHex(currentColor[0], currentColor[1], currentColor[2]);
            rgb.value = 'rgb(' + currentColor[0] + ', ' + currentColor[1] + ', ' + currentColor[2] + ')';

        }
    })

    outer_layer2.addEventListener('mousedown', e => {
        if (isMouseOnSwitch(e.layerX, e.layerY, sideSwitchPos.x, sideSwitchPos.y, 34, 14)) {
            sideDragStart = {
                x: e.layerX,
                y: e.layerY
            };
            sideDrag = true;
        }
    });

    outer_layer2.addEventListener('mouseup', e => {
        sideDrag = false;
    });

    // copy the value of the color (rgb or hex) after mouse click
    [hex, rgb].forEach(item => {
        item.addEventListener('mouseover', e => {
            item.style.cursor = 'pointer';
        });
        item.addEventListener('mouseout', e => {
            item.style.cursor = 'default';
        });
        item.addEventListener('mousedown', e => {
            item.className += ' copied';
            let temp = item.value;
            item.focus();
            item.select();
            document.execCommand('copy');
            item.value = 'Copied!';
            setTimeout(() => {
                item.className = 'colors';
                item.value = temp;
            }, 500);
        });
    });
    })();
  </script>
    `;
}

// @ts-ignore
function trigger(query: string | string[]): boolean {
  query = (query as string).toLowerCase().split(" ");
  const queryList = [
    "color picker",
    "colorpicker",
    "html color picker",
    "rgb palette",
    "rgb color",
    "rgb color code",
    "rgb code",
    "rgb picker",
    "hex color",
    "hex color code",
    "hex to rgb",
    "rgb to hex",
  ];
  const filteredList = queryList.filter((item) =>
    (query as string[]).every(
      (el: string) => item.toLowerCase().indexOf(el) > -1
    )
  );
  return !!filteredList.length;
}

module.exports = { colorPicker, trigger };
