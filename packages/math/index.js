"use strict";
const mathjs = require("mathjs");


async function math(query) {
  let expression;
  let answer;
  if (query === "cal" || query === "calculator") {
    expression = 0;
    answer = '';
  } else {
    try {
      //x and ⋅ are multiplication symbols not a letter x and decimal pointer(.) 
      let result = query.replace(/×/gi, "*");
      result = result.replace(/⋅/gi, "*");
      result = result.replace(/÷/gi, "/");
      const data = mathjs.evaluate(result);
      expression = result;
      answer = `= ${data}`
    } catch (error) {
      return null;
    }
  }


  return `

<div id="presearchPackage">
<table>

  <tr>
    <td colspan="4" class="output-container">
      <span data-previous-operand>${expression}</span>
      <span data-current-operand>${answer}</span>
    </td>
  </tr>

  <tr>
    <td colspan="2" style="padding-top:4px;">
      <button type="button" name="del" data-delete>DEL</button>
    </td>
    <td colspan="2" style="padding-top:4px;">
      <button type="button" name="ac" data-all-clear>AC</button>
    </td>
  </tr>

  <tr>
    <td>
      <button type="button" data-number>7</button>
    </td>
    <td>
      <button type="button" data-number>8</button>
    </td>
    <td>
      <button type="button" data-number>9</button>
    </td>
    <td>
      <button name="operator" type="button" data-operation>/</button>
    </td>
  </tr>

  <tr>
    <td>
      <button type="button" data-number>4</button>
    </td>
    <td>
      <button type="button" data-number>5</button>
    </td>
    <td>
      <button type="button" data-number>6</button>
    </td>
    <td>
      <button name="operator" type="button" data-operation>*</button>
    </td>
  </tr>

  <tr>
    <td>
      <button type="button" data-number>1</button>
    </td>
    <td>
      <button type="button" data-number>2</button>
    </td>
    <td>
      <button type="button" data-number>3</button>
    </td>
    <td>
      <button name="operator" type="button" data-operation>-</button>
    </td>
  </tr>

  <tr>
    <td>
      <button type="button" data-number>0</button>
    </td>
    <td>
      <button type="button" data-number>.</button>
    </td>
    <td>
      <button name="equal" type="button" data-equals>=</button>
    </td>
    <td>
      <button name="operator" type="button" data-operation>+</button>
    </td>
  </tr>

</table>
</div>

<script>
class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.clear()
  }

  clear() {
      this.currentOperand =''
      this.previousOperand =''
      this.operation = undefined
  }

  delete() {
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
      if (this.currentOperand ==='') return
      if (this.previousOperand !=='') {
          this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand =''
  }

  compute() {
      let computation
      const prev = parseFloat(this.previousOperand)
      const current = parseFloat(this.currentOperand)
      if (isNaN(prev) || isNaN(current)) return
      switch (this.operation) {
          case '+':
              computation = prev + current
              break
          case '-':
              computation = prev - current
              break
          case '*':
              computation = prev * current
              break
          case '/':
              computation = prev / current
              break
          default:
              return
      }
      this.currentOperand = computation
      this.operation = undefined
      this.previousOperand =''
  }

  getDisplayNumber(number) {
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
          integerDisplay =''
      } else {
          integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
          return integerDisplay+"."+decimalDigits 
      } else {
          return integerDisplay
      }
  }

  updateDisplay() {
      this.currentOperandTextElement.innerText =
          this.getDisplayNumber(this.currentOperand)
      if (this.operation != null) {
          this.previousOperandTextElement.innerText =this.getDisplayNumber(this.previousOperand)+this.operation 
      } else {
          this.previousOperandTextElement.innerText =''
      }
  }

}


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', () => {
  calculator.compute()
  calculator.updateDisplay()
})

allClearButton.addEventListener('click', () => {
  calculator.clear()
  calculator.updateDisplay()
})

deleteButton.addEventListener('click', () => {
  calculator.delete()
  calculator.updateDisplay()
})

let searchInputFocused = false;
document.querySelector('input').addEventListener('mouseover', e => {
  searchInputFocused = true;
})

document.querySelector('#presearchPackage').addEventListener('mouseover', e => {
  searchInputFocused = false;
})

document.addEventListener('keydown', function (event) {
  if (searchInputFocused) return;
  event.preventDefault();
  switch (event.key) {
    case '+':
        calculator.chooseOperation(event.key)
        calculator.updateDisplay()
        break
    case '-':
        calculator.chooseOperation(event.key)
        calculator.updateDisplay()
        break
    case '*':
        calculator.chooseOperation(event.key)
        calculator.updateDisplay()
        break
    case '/':
        calculator.chooseOperation(event.key)
        calculator.updateDisplay()
        break
    case '1':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '2':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '3':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '4':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '5':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '6':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '7':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '8':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '9':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '0':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case '.':
        calculator.appendNumber(event.key)
        calculator.updateDisplay()
        break
    case 'Enter':
        calculator.compute()
        calculator.updateDisplay()
        break;
    case '=':
        calculator.compute()
        calculator.updateDisplay()
        break;
    case 'Backspace':
        calculator.delete()
        calculator.updateDisplay()
        break;
    case 'Delete':
        calculator.clear()
        calculator.updateDisplay()
        break;
    default:
        return
}
});
</script>
<style>
  #presearchPackage .output-container{
    width: 100%;
    height: 45px;
    text-align: right;
    font-weight: bold;
    font-size: x-large;
    border-width: 1px;
    border-style: solid;
    opacity: 0.5;
    margin: 100px;
    padding-right:6px;
    max-width: 30px;
    overflow-wrap: anywhere;
  }
  .dark #presearchPackage .output-container {
    color: #fff;
    opacity: .8;
  }
  #presearchPackage .output-container:hover{
    opacity: 1;
  }
  #presearchPackage button[type=button]{
    opacity: 0.8;
    background-color: #f5f5f5;
    background-image: linear-gradient(top, #f5f5f5, #f1f1f1);
    border: 1px solid #dedede;
    color: #444;
    height: 40px;
    width: 80px;
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
    font-size: 1.2em;
    font-weight: normal;
  }
  #presearchPackage button[type=button]:hover{
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      background-image: linear-gradient(top, #f8f8f8, #f1f1f1);
      opacity: 1;
      border: 1px solid #c6c6c6;
      color: #222;
      cursor: pointer;
  }
  #presearchPackage button[name=equal] {
    background-color: #4d90fe;
    background-image: linear-gradient(top, #4d90fe, #4787ed);
    border: 1px solid #3079ed;
    color: #fefefe;
  }
  #presearchPackage button[name=equal]:hover {
    background-color: #4d90fe;
    background-image: linear-gradient(top, #4d90fe, #357ae8);
    border: 1px solid #2f5bb7;
    color: #fefefe;
  }
  #presearchPackage button[name=operator] {
    border: 1px solid #c6c6c6;
    background-color: #d6d6d6;
  }
  #presearchPackage button[name=ac] {
    width: 100%;
  }
  #presearchPackage button[name=del] {
    width: 100%;
  }
</style>

  `;
}
async function trigger(query) {
  //ignore phone numbers
  const regexPhoneNumber = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
  if (query.match(regexPhoneNumber)) {
    return false;
  }
  query = query.toLowerCase();
  if (query === "calculator" || query === "cal" || query === "calc") {
    return true
  }
  const chars = new RegExp(/([a-zA-Z])+/g);
  if (!isNaN(query) || chars.test(query)) return false;
  try {
    //x and ⋅ are multiplication symbols not a letter x and decimal pointer(.)
    let result = query.replace(/×/gi, "*");
    result = result.replace(/⋅/gi, "*");
    result = result.replace(/÷/gi, "/");
    mathjs.evaluate(result);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { math, trigger };
