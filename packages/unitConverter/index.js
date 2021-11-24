'use strict';

const converter = require('./converter.config')
const fs = require('fs')

const converterScript = fs.readFileSync(__dirname + '/converter.config.js', 'utf8')

async function unitConverter(query, API_KEY) {

  let qty = query.match(/\d+(?:\.\d+)?/)
  let {family, from, to} = converter.match(query)

  let html = `<div id="presearchPackage">
    <select id="unitConverterUnitFamilySelect">
  `

  for (let [unityFamily] of Object.entries(converter.units)) {
    html += `<option>${unityFamily}</option>`
  }

  html += `</select>`
  html += `<div class="unitConverterFromTo"><input type="number" id="unitConverterFrom" value="${qty || ''}"/></div>`
  html += `<div class="unitConverterFromToSeparator">=</div>`
  html += `<div class="unitConverterFromTo">
        <input type="number" id="unitConverterTo"/>
    </div>`
  html += `<div class="unitConverter">
        <div class="unitConverterFromTo">
            <select id="unitConverterFromSelect">`

  for (let [unit] of Object.entries(converter.units[family].convert)) {
    html += `<option ${unit === from ? 'selected' : ''}>${unit}</option>`
  }

  html += `</select>
        </div><div class="unitConverterFromToSeparator"></div><div class="unitConverterFromTo">
            <select id="unitConverterToSelect">`


  for (let [unit] of Object.entries(converter.units[family].convert)) {
    html += `<option ${unit === to ? 'selected' : ''}>${unit}</option>`
  }

  html += `</select>
        </div>
    </div>`

  html += `</div>`

  html += `<style>
		#presearchPackage #unitConverterUnitFamilySelect,
		#presearchPackage #unitConverterFromSelect,
		#presearchPackage #unitConverterToSelect {
			width: 100%;
			padding: 0.5rem;
		}
		#presearchPackage #unitConverterUnitFamilySelect {
			margin-bottom: 1.5rem;
		}
		#presearchPackage .unitConverter {
			margin-bottom: 1rem;
		}
		#presearchPackage #unitConverterFrom, #presearchPackage #unitConverterTo {
			width: 100%;
			padding: 0.5rem;
			border: 1px solid grey;
		}
		#presearchPackage .unitConverterFromTo {
		  display: inline-block;
			width: calc(50% - 2rem);
		}
		#presearchPackage .unitConverterFromToSeparator {
		  display: inline-block;
			width: 4rem;
			text-align: center;
			font-size: 1.5rem;
		}
	</style>
	<script>
	  ${converterScript}

	  let familySelect = document.querySelector("#unitConverterUnitFamilySelect")
	  let toEl = document.querySelector("#unitConverterTo")
	  let fromEl = document.querySelector("#unitConverterFrom")
	  let toSelect = document.querySelector("#unitConverterToSelect")
	  let fromSelect = document.querySelector("#unitConverterFromSelect")

	  if (${qty}) {
	      toEl.value = converter.convert(${qty}, '${family}', '${from}', '${to}')
	  }

		familySelect.addEventListener("change", ({target}) => {
		    toSelect.innerHTML = '';
		    fromSelect.innerHTML = '';

        for (let [unit] of Object.entries(converter.units[target.value].convert)) {
            toSelect.appendChild(new Option(unit))
            fromSelect.appendChild(new Option(unit))
        }

        toEl.value = fromEl.value
		})

		fromEl.addEventListener("keyup", ({target}) => {
		    toEl.value = converter.convert(target.value, familySelect.value, fromSelect.value, toSelect.value)
		})
		toEl.addEventListener("keyup", ({target}) => {
		    fromEl.value = converter.convert(target.value, familySelect.value, toSelect.value, fromSelect.value)
		})

		fromSelect.addEventListener("change", () => {
		    toEl.value = converter.convert(fromEl.value, familySelect.value, fromSelect.value, toSelect.value)
		})
		toSelect.addEventListener("change", () => {
		    toEl.value = converter.convert(fromEl.value, familySelect.value, fromSelect.value, toSelect.value)
		})
  </script>
	`

  return html
}

async function trigger(query) {
	return converter.match(query)
}

module.exports = { unitConverter, trigger };
