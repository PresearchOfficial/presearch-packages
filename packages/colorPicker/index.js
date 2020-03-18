'use strict';

function colorPicker(query) {

    return `
    <style>
     #colorpicker {
         border: 0;
         overflow: hidden;
         width: 1200px;
         height: 350px;
     }
     </style>
    <iframe id="colorpicker" src="https://jejo.dev/colorpicker" />
    `
  }
  
  function trigger(query) {
    query = query.toLowerCase();
    return query === 'color picker' || query === 'html color picker' || query === 'rgb palette' || query === 'rgb color' || query === 'rgb color code' 
    || query === 'rgb code' || query === 'rgb picker' || query === 'hex color' || query === 'hex color code' || query === 'hex to rgb' || query === 'rgb to hex';
  }
  
  module.exports = { colorPicker, trigger };