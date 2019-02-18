'use strict';

function colorPicker(query) {

    return `
    <script>const color = {r:0, g:255, b:0}; // set up a start color
    const mainPickerPos = {x:100, y:100};
    let updateColor = false;

    function rgbColor(r,g,b){
      return 'rgb('+r +','+ g +','+ b +')';
    }
    
    function rgbToHex(rgb) { 
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
             hex = '0' + hex;
        }
        return hex;
    };
    
    function fullColorHex(r,g,b) {   
        let red = rgbToHex(r);
        let green = rgbToHex(g);
        let blue = rgbToHex(b);
        return ('#' + red+green+blue).toUpperCase();
    };
    
    function layer1F() {
        const layer1 = document.getElementById('layer1');
        const ctx1 = layer1.getContext('2d');
    
        let grd =  ctx1.createLinearGradient(0, 0, 0, 255);
    
        for(let x = 0; x<255; ++x){ // fill canvas with gradient
    
    
            let r = 255 - color.r;
            let g = 255 - color.g;
            let b = 255 - color.b;
    
            let add = {r:0, g:0, b:0};
    
            if(r > 0) {
                add.r = 1
            } else {
                add.r = 0
            }
    
            if(g > 0) {
                add.g = 1
            } else {
                add.g = 0
            }
    
            if(b > 0) {
                add.b = 1
            } else {
                add.b = 0
            }
    
            color.r += add.r;
            color.g += add.g;
            color.b += add.b;
            grd.addColorStop(0, rgbColor(color.r, color.g, color.b));
            grd.addColorStop(1, 'black');
    
            ctx1.fillStyle = grd;
            ctx1.fillRect(x,0,1,255);
    
    
        }
    }
    
    function layer2F() {
    
        const layer1 = document.getElementById('layer1');
        const ctx1 = layer1.getContext('2d');
    
        const result = document.getElementById('result');
        const resultContext = result.getContext('2d');
    
        const layer2 = document.getElementById('layer2');
        const ctx2 = layer2.getContext('2d');
    
        const startPos = {x:100, y:100}; // picker (circle) starting pos
    
        // current color values and preview
        let currentColor = ctx1.getImageData(mainPickerPos.x, mainPickerPos.y, 1, 1);
        resultContext.fillStyle = rgbColor(currentColor.data[0], currentColor.data[1], currentColor.data[2]);
        resultContext.fillRect(0,0, result.width, result.height);
        hex.value = fullColorHex(currentColor.data[0], currentColor.data[1], currentColor.data[2]);         
        rgb.value = rgbColor(currentColor.data[0], currentColor.data[1], currentColor.data[2]);
    
        function isInPath(x, y) { // check if mouse is on the picker (circle)
            x -= startPos.x;
            y -= startPos.y;
            if((x > 59 && x < 79) && (y > 15 && y < 33)){
                return true;
            }
            return false;
      }
    
        // draw function for picker (circle)
        function draw() {
            ctx2.beginPath();
            ctx2.arc(100, 100, 8, 0, 2 * Math.PI);
            ctx2.fillStyle = rgbColor(currentColor.data[0], currentColor.data[1], currentColor.data[2]);
            
            ctx2.fill();
            ctx2.strokeStyle = '#fff';
            ctx2.stroke();
        }
    
        function clear() {
            ctx2.save();
            ctx2.setTransform(1, 0, 0, 1, 0, 0);
            ctx2.clearRect(0, 0, layer2.width, layer2.height);
            ctx2.restore();
        }
        var drag = false;
        var dragStart;
        var dragEnd;
        draw();
        if(!updateColor){
            layer2.addEventListener('mousedown', function(event) {
                if(isInPath(event.pageX, event.pageY)){
                    dragStart = {
                        x: event.pageX - layer2.offsetLeft,
                        y: event.pageY - layer2.offsetTop
                        }
                    
                        drag = true;
                }
            });
    
            layer2.addEventListener('mousemove', function(event) {
    
                if(isInPath(event.pageX, event.pageY)){ // change the cursor when mouse is on picker
                    this.style.cursor='pointer';
                } else {
                    this.style.cursor='default';
                }
    
                if (drag) {
                    dragEnd = {
                        x: event.pageX - layer2.offsetLeft,
                        y: event.pageY - layer2.offsetTop
                    };
                    
                        startPos.x += (dragEnd.x - dragStart.x);
                        startPos.y += (dragEnd.y - dragStart.y);
                        mainPickerPos.x = startPos.x;
                        mainPickerPos.y = startPos.y;
                        ctx2.translate(dragEnd.x - dragStart.x, dragEnd.y - dragStart.y);
    
                    // update current color values
                    currentColor = ctx1.getImageData(startPos.x, startPos.y, 1, 1);
                    resultContext.fillStyle = rgbColor(currentColor.data[0], currentColor.data[1], currentColor.data[2]);
                    resultContext.fillRect(0,0, result.width, result.height);
                    hex.value = fullColorHex(currentColor.data[0], currentColor.data[1], currentColor.data[2]);            
                    rgb.value = rgbColor(currentColor.data[0], currentColor.data[1], currentColor.data[2]);
    
                    clear();
                    draw();
                    dragStart = dragEnd;
                }
            });
            
            layer2.addEventListener('mouseup',function(event) {
                drag = false;
    
                mainPickerPos.x = startPos.x;
                mainPickerPos.y = startPos.y;

                // update current color values
                currentColor = ctx1.getImageData(startPos.x, startPos.y, 1, 1);
                hex.value = fullColorHex(currentColor.data[0], currentColor.data[1], currentColor.data[2]);            
                rgb.value = rgbColor(currentColor.data[0], currentColor.data[1], currentColor.data[2]);
            });
        }
        updateColor = false;
    }
    
    
    
    function layer1Small() { // generate 'rainbow' for small canvas
    
        const canvas = document.getElementById('layer1-small');
        const context = canvas.getContext('2d');
        let y = 5;
    
        for(let x = 0; x<51; ++x){
            context.fillStyle = 'rgb(255,' + y + ',0)';
            context.fillRect(x,0,1,20);
            y += 5;
        }
        y = 255;
        for(let x = 0; x<51; ++x){
            context.fillStyle = 'rgb(' + y + ',255,0)';
            context.fillRect(x + 51,0,1,20);
            y -= 5;
        }
        y=5;
    
        for(let x = 0; x<51; ++x){
            context.fillStyle = 'rgb(0,255,' + y + ')';
            context.fillRect(x + 102,0,1,20);
            y += 5;
        }
    
        y = 255;
        for(let x = 0; x<51; ++x){
            context.fillStyle = 'rgb(0,' + y + ',255)';
            context.fillRect(x + 153,0,1,20);
            y -= 5;
        }
    
        y=5;
    
        for(let x = 0; x<51; ++x){
            context.fillStyle = 'rgb(' + y + ',0,255)';
            context.fillRect(x + 204,0,1,20);
            y += 5;
        }
        y = 255;
        for(let x = 0; x<51; ++x){
            context.fillStyle = 'rgb(255,0,' + y +')';
            context.fillRect(x + 255,0,1,20);
            y -= 5;
        }
    
    }
    
    function updatePickerColor() {
        updateColor = true;
    }
    
    function layer2Small() {
    
        const layerUpdate = document.getElementById('layer1');
        const ctxupdate = layerUpdate.getContext('2d');
    
        const layer1Small = document.getElementById('layer1-small');
        const ctx1Small = layer1Small.getContext('2d');
    
        const layer2 = document.getElementById('layer2-small');
        const ctx2 = layer2.getContext('2d');
    
        const startPosSmall = {x:152, y:14};
    
        let currentColor = ctx1Small.getImageData(startPosSmall.x, startPosSmall.y, 1, 1);
    
    
        function isInPath(x, y) { // check if mouse is on the circle
            x -= startPosSmall.x;
            y -= startPosSmall.y;
            if((x > 57 && x < 83)){
                return true;
            }
            return false;
      }
    
        function draw() {
            ctx2.beginPath();
            ctx2.arc(152, 14, 13, 0, 2 * Math.PI);
            ctx2.fillStyle = rgbColor(currentColor.data[0], currentColor.data[1], currentColor.data[2]);
            ctx2.fill();
            ctx2.strokeStyle = '#fff';
            ctx2.stroke();
        }
    
        function clear() {
            ctx2.save();
            ctx2.setTransform(1, 0, 0, 1, 0, 0);
            ctx2.clearRect(0, 0, layer2.width, layer2.height);
            ctx2.restore();
        }
        var drag = false;
        var dragStart;
        var dragEnd;
        draw();
        layer2.addEventListener('mousedown', function(event) {
            if(isInPath(event.pageX, event.pageY)){
                dragStart = {
                    x: event.pageX - layer2.offsetLeft,
                    }
                
                 drag = true;
            }
    
        });
    
        layer2.addEventListener('mousemove', function(event) {
    
            if(isInPath(event.pageX, event.pageY)){ // change the cursor when mouse is on pick
                this.style.cursor='pointer';
            } else {
                this.style.cursor='default';
            }
    
            if (drag) {
                dragEnd = {
                    x: event.pageX - layer2.offsetLeft,
                }
                startPosSmall.x += (dragEnd.x - dragStart.x);
                ctx2.translate(dragEnd.x - dragStart.x, 0);
                clear();
                draw();
                dragStart = dragEnd;
                currentColor = ctx1Small.getImageData(startPosSmall.x, startPosSmall.y, 1, 1);
    
                color.r = currentColor.data[0];
                color.g = currentColor.data[1];
                color.b = currentColor.data[2];
            }
    
        });
        
        layer2.addEventListener('mouseup',function(event){
            if(isInPath(event.pageX, event.pageY)){
                drag = false;
                layer1F();
                updatePickerColor();
                
                layer2F();
                
            }
        });
    }
    
    window.onload = function() {
        layer1F();
        layer2F();
        layer1Small();
        layer2Small();
        const hex = document.getElementById('hex');
        const rgb = document.getElementById('rgb');
        [hex,rgb].forEach(item => {
            item.addEventListener('mouseover', function(event) {
                this.style.cursor='pointer';
            });
            item.addEventListener('mouseout', function(event) {
                this.style.cursor='default';
            });
            item.addEventListener('mousedown', function(event) {
                item.className += ' copied';
                let temp = item.value; 
                item.focus();
                item.select();
                document.execCommand('copy');
                item.value ='Copied!';
                setTimeout(() => {
                    item.className = 'colors';
                    item.value = temp;
                },500);
            });
        });
    }</script>
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
  
  function trigger(query) {
    query = query.toLowerCase();
    return query === 'color picker' || query === 'html color picker' || query === 'rgb palette' || query === 'rgb color' || query === 'rgb color code' 
    || query === 'rgb code' || query === 'rgb picker' || query === 'hex color' || query === 'hex color code' || query === 'hex to rgb' || query === 'rgb to hex';
  }
  
  module.exports = { colorPicker, trigger };