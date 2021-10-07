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
            <td><input type="button" name="one" value="1" onclick="addValue('1')"></td>
            <td><input type="button" name="two" value="2" onclick="addValue('2')"></td>
            <td><input type="button" name="three" value="3" onclick="addValue('3')"></td>
            <td><input style="margin-right:14px;" type="button" class="operator" name="plus" value="+" onclick="addValue('+')"></td>
     </tr>
     <tr>
            <td><input type="button" name="four" value="4" onclick="addValue('4')"></td>
            <td><input type="button" name="five" value="5" onclick="addValue('5')"></td>
            <td><input type="button" name="six" value="6" onclick="addValue('6')"></td>
            <td><input type="button" class="operator" name="minus" value="-" onclick="addValue('-')"></td>
     </tr>
     <tr>
            <td><input type="button" name="seven" value="7" onclick="addValue('7')"></td>
            <td><input type="button" name="eight" value="8" onclick="addValue('8')"></td>
            <td><input type="button" name="nine" value="9" onclick="addValue('9')"></td>
            <td><input type="button" class="operator" name="times" value="x" onclick="addValue('*')"></td>
     </tr>
     <tr>
            <td><input type="button" id="clear" name="clear" value="C" onclick="calculator.resultDisplay.value = '0'"></td>
            <td><input type="button" name="zero" value="0" onclick="addValue('0')"></td>
            <td><input type="button" name="doit" value="=" onclick="calculator.resultDisplay.value = summary(calculator.resultDisplay.value)"></td>
            <td><input type="button" class="operator" name="div" value="/" onclick="addValue('/')"></td>
      </tr>
   </table>
  </form>
</div>

<script>
const addValue = (addedValue) => {
  const getValue = (value) => {
    //* check if the value is an operator or a number
    const isOperator = (value = "") => {
      if (!value.match(/[0-9]/)) return true;
      return false;
    }
    let currentValue = calculator.resultDisplay.value;
    const previousValue = currentValue && currentValue.length ? currentValue[currentValue.length-1] : "";
    const newValue = currentValue + addedValue;
    //* check if we have two operators one by one, but allow (*- and /-)
    const twoOperators = (isOperator(value) && isOperator(previousValue)) && ((!newValue.includes("*-") && !newValue.includes("/-")) || newValue.includes("--"));
    //* reset calculator when we will start with 0 value
    if (currentValue === "0") currentValue = "";
    if (value && value.length) {
      //* do nothing if the previous value vas an operator, or if the first value is an operator (except '-')
      if (twoOperators || (currentValue.length === 1 && currentValue[0] !== "-" && isOperator(currentValue[0]))) {
        return currentValue;
      }
      return newValue;
    }
    return currentValue;
  }

  calculator.resultDisplay.value = getValue(addedValue);
};
const summary = (value) => {
  //* fix the case where we have operator on the last place, ie eval("50*")
  try {
    eval(value)
  } catch(err) {
    return value;
  }
  //* check if number has more than 12 digts after decimal place
  const test = eval(value) * Math.pow(10, 12)
  if (test % 10 !== 0) {
    return eval(value).toFixed(12);
  }
  return eval(value);
}
</script>
 

<style>
.dark .mathContain {
  color:#d1d5db;
}
.mathContain {
  padding: 0 15px;
  box-sizing: border-box;
}
      
.mainCol table {
  background-color: #1e1e1e;
  width: 295px;
  max-width: 295px;
  height: 325px;
  text-align: center;
  border-radius: 8px;
  padding-right: 10px;
  margin-bottom: 20px;
}

.mainCol input {
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

.mainCol input:hover {
    color: #495069;
  background-color: #fff;
  border-radius: 4px;
  width: 60px;
  height: 50px;
  float: left;
  font-size: 20px;
  }

.mainCol input:active {
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

.mainCol #resultDisplay {
  width: 265px;
  max-width: 270px;
  font-size: 26px;
  text-align: right;
  background-color:  #d1d5db;
  float: left;
  padding-right: 10px;
}

.mainCol .operator {
  background-color: #cee9ef;
  position: relative;
}

.mainCol .operator:hover {

  color: #495069;
  
}

.mainCol .operator:active {
  top: 4px;
  box-shadow: none;
}

.mainCol #clear {
  float: left;
  position: relative;
  resultDisplay: block;
  background-color: #ff9fa8;
}

.mainCol #clear:hover {
  float: left;
  resultDisplay: block;
  background-color: #F297A0;
  margin-bottom: 15px;
  
}

.mainCol #clear:active {
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
