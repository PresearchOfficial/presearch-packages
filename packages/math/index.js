"use strict";
const mathjs = require("mathjs");

async function math(query) {
  const data = mathjs.evaluate(query);

  return `
     
<div class="mainCol mathContain">
      <form name="calculator">
   <table>
      <tr>
         <td colspan="4">
            <input  type="text" name="resultDisplay" value=${
              typeof data === "number" ? data : ``
            } id="resultDisplay" disabled>
            
   
         </td>
      </tr>
      <tr>
            <td><input type="button" name="one" value="1" onclick="calculator.resultDisplay.value += '1'"></td>
            <td><input type="button" name="two" value="2" onclick="calculator.resultDisplay.value += '2'"></td>
            <td><input type="button" name="three" value="3" onclick="calculator.resultDisplay.value += '3'"></td>
            <td><input type="button" class="operator" name="plus" value="+" onclick="calculator.resultDisplay.value += '+'"></td>
     </tr>
     <tr>
            <td><input type="button" name="four" value="4" onclick="calculator.resultDisplay.value += '4'"></td>
            <td><input type="button" name="five" value="5" onclick="calculator.resultDisplay.value += '5'"></td>
            <td><input type="button" name="six" value="6" onclick="calculator.resultDisplay.value += '6'"></td>
            <td><input type="button" class="operator" name="minus" value="-" onclick="calculator.resultDisplay.value += '-'"></td>
     </tr>
     <tr>
            <td><input type="button" name="seven" value="7" onclick="calculator.resultDisplay.value += '7'"></td>
            <td><input type="button" name="eight" value="8" onclick="calculator.resultDisplay.value += '8'"></td>
            <td><input type="button" name="nine" value="9" onclick="calculator.resultDisplay.value += '9'"></td>
            <td><input type="button" class="operator" name="times" value="x" onclick="calculator.resultDisplay.value += '*'"></td>
     </tr>
     <tr>
            <td><input type="button" id="clear" name="clear" value="c" onclick="calculator.resultDisplay.value = ''"></td>
            <td><input type="button" name="zero" value="0" onclick="calculator.resultDisplay.value += '0'"></td>
            <td><input type="button" name="doit" value="=" onclick="calculator.resultDisplay.value = eval(calculator.resultDisplay.value)"></td>
            <td><input type="button" class="operator" name="div" value="/" onclick="calculator.resultDisplay.value += '/'"></td>
      
      </tr>
   </table>
</form>
</div>
 

    <style>
.dark .mathContain {
        color:#d1d5db;
      }
      .mathContain {
        padding: 0 15px;
        box-sizing: border-box;
      }
      
table {
   background-color: #1e1e1e;
  width: 295px;
  max-width: 295px;
  height: 325px;
  text-align: center;
  border-radius: 8px;
  padding-right: 10px;
}

input {
  outline: 0;
  position: relative;
  left: 5px;
  top: 5px;
  border: 0;
  color: #495069;
  background-color:#d1d5db;
  border-radius: 4px;
  width: 60px;
  height: 50px;
  float: left;
  margin: 5px;
  font-size: 20px;
  box-shadow: 0 4px rgba(0,0,0,0.2);
  margin-bottom: 15px;
}

input:hover {
    color: #495069;
  background-color: #fff;
  border-radius: 4px;
  width: 60px;
  height: 50px;
  float: left;
  font-size: 20px;
  }

input:active {
  top: 4px;
  border: 0 solid #000;
  color: #495069;
  background-color: #fff;
  border-radius: 4px;
  width: 60px;
  height: 50px;
  float: left;
  margin: 5px;
  font-size: 20px;
  box-shadow: none;
}

#resultDisplay {
  width: 265px;
  max-width: 270px;
  font-size: 26px;
  text-align: right;
  background-color:  #d1d5db;
  float: left;
}

.operator {
  background-color: #cee9ef;
  position: relative;
}

.operator:hover {

  color: #495069;
  
}

.operator:active {
  top: 4px;
  box-shadow: none;
}

#clear {
  float: left;
  position: relative;
  resultDisplay: block;
  background-color: #ff9fa8;
}

#clear:hover {
  float: left;
  resultDisplay: block;
  background-color: #F297A0;
  margin-bottom: 15px;
  
}

#clear:active {
  float: left;
  top: 4px;
  resultDisplay: block;
  background-color: #F297A0;
  margin-bottom: 15px;
  box-shadow: none;
}

    </style>
  `;
}

// This line is for testing package with browserify bundle
// window.math = math("2 + 2");

async function trigger(query) {
  const chars = new RegExp(/([a-zA-Z])+/g);
  if (!isNaN(query) || chars.test(query)) return false;
  try {
    mathjs.evaluate(query);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { math, trigger };
