'use strict';
const {parseAndNormalize, fetchRates, convert} = require('./services');

//global variabel to store return value from parseAndNormalize function 
var rateConversion = '';

async function currencyConverter(query, API_KEY) {
  if (!rateConversion) {
    return undefined;
  }

  const rates = await fetchRates(rateConversion, API_KEY);
  if (!rates) {
    return undefined;
  }

  const converted = convert(rateConversion, rates);

  if (!converted) {
    return undefined;
  }
  const toValue = Math.round(converted.value * (10**converted.round))/(10**converted.round);
  return `
    <div id="presearchPackage">
      <div id="currencyConverter">
        <div class="from"><span></span><i> &asymp;</i></div>
        <div class="to"><span></span></div>
        <div id="realTimeConversion">
          <div>
            <input type="number" name="convertFrom" id="convertFrom" value="${rateConversion.value}" onkeyup="updateRate('input#convertTo', this.value, ${converted.value})">
            <span>${converted.fromName}</span>
          </div>
          <svg onclick="location.href = '/search?q=${rateConversion.to}%20to%20${rateConversion.from}'" xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 50 50" width="100px" height="100px"><path d="M 25 5 C 13.964844 5 5 13.964844 5 25 C 4.996094 25.359375 5.183594 25.695313 5.496094 25.878906 C 5.808594 26.058594 6.191406 26.058594 6.503906 25.878906 C 6.816406 25.695313 7.003906 25.359375 7 25 C 7 15.046875 15.046875 7 25 7 C 31.246094 7 36.726563 10.179688 39.957031 15 L 33 15 C 32.640625 14.996094 32.304688 15.183594 32.121094 15.496094 C 31.941406 15.808594 31.941406 16.191406 32.121094 16.503906 C 32.304688 16.816406 32.640625 17.003906 33 17 L 43 17 L 43 7 C 43.003906 6.730469 42.898438 6.46875 42.707031 6.277344 C 42.515625 6.085938 42.253906 5.980469 41.984375 5.984375 C 41.433594 5.996094 40.992188 6.449219 41 7 L 41 13.011719 C 37.347656 8.148438 31.539063 5 25 5 Z M 43.984375 23.984375 C 43.433594 23.996094 42.992188 24.449219 43 25 C 43 34.953125 34.953125 43 25 43 C 18.753906 43 13.269531 39.820313 10.042969 35 L 17 35 C 17.359375 35.007813 17.695313 34.816406 17.878906 34.507813 C 18.058594 34.195313 18.058594 33.808594 17.878906 33.496094 C 17.695313 33.1875 17.359375 32.996094 17 33 L 8.445313 33 C 8.316406 32.976563 8.1875 32.976563 8.058594 33 L 7 33 L 7 43 C 6.996094 43.359375 7.183594 43.695313 7.496094 43.878906 C 7.808594 44.058594 8.191406 44.058594 8.503906 43.878906 C 8.816406 43.695313 9.003906 43.359375 9 43 L 9 36.984375 C 12.648438 41.847656 18.460938 45 25 45 C 36.035156 45 45 36.035156 45 25 C 45.003906 24.730469 44.898438 24.46875 44.707031 24.277344 C 44.515625 24.085938 44.253906 23.980469 43.984375 23.984375 Z"/></svg>
          <div>
            <input type="number" name="convertTo" id="convertTo" value="${toValue}" onkeyup="updateRate('input#convertFrom', this.value, ${converted.value})">
          <span>${converted.toName}</span>
          </div>
        </div>
        <p class="disclaimer">Exchange rates are downloaded from the <a target="_blank" rel="noreferrer" href="https://ec.europa.eu">European Commission</a> and <a target="_blank" rel="noreferrer" href="https://coinmarketcap.com">CoinMarketCap</a>. Presearch does not guarantee the accuracy.</p>
      </div>
    </div>
    <style>
    .to {
      font-size: x-large;
    }

    .from {
      color: grey;
    }

    .dark #currencyConverter {
      color: white;
    }

    .disclaimer {
      font-size: x-small;
      color: grey;
    }

    .disclaimer a {
      text-decoration: underline;
    }
    div#realTimeConversion{width:20em;}
    div#realTimeConversion svg{
      background: white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      margin: auto;
      padding: 5px;
      cursor: pointer;
    }
    div#realTimeConversion div{
      width: 20em;
      overflow: hidden;
      position: relative;
    }
    div#realTimeConversion input{
      padding: 10px;
      line-height: inherit;
      color: black;
      border-radius: 3px;
      margin: 15px 0;
      font-size: 1.2em;
      outline: none;
      box-sizing: border-box;
      overflow-y: hidden;
      width: 100%;
      padding-right: 10em;
      border: 1px solid lightgray;
    }
    div#realTimeConversion input::-webkit-inner-spin-button, 
    div#realTimeConversion input::-webkit-outer-spin-button { 
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0; 
    }
    div#realTimeConversion input:focus{
      box-shadow: 0 0 0 2px inset #80baff;
    }
    div#realTimeConversion div span{
      position: absolute;
      color: black;
      font-weight: 400;
      font-size: 1.2em;
      width: 10em;
      overflow: hidden;
      display: inline-flex;
      right: 0;
      margin: 18px 0 18px 0;
      padding: 5px;
      height: 55%;
      align-items: center;
      background-color: #ededed;
      white-space: nowrap;
    }
    @media only screen and (max-width:400px) {
      .to.shrink {
        font-size: large;
        margin-bottom: 2px;
      }
    }
    </style>
    <script>

    const updateRate = (target, selfValue, toValue) => {
      var result = 0;
      if(target === 'input#convertTo'){
        result = selfValue * toValue;
      }else if(target === 'input#convertFrom'){
        result = selfValue / toValue;
      }
      const round = result > 1 ? 2 : -Math.floor( Math.log10(result) + 1) + 2;
      result = Math.round(result * (10**round)) / (10**round);
      document.querySelector(target).value = result;
    }
    const formatMoney = (currency, locale = undefined) => {
      try {
        return currency.value.toLocaleString(
          locale,
          {
            style: "currency",
            currency: currency.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: currency.round || 20,
          }
        );
      } catch (error) {
        // since we're dealing with crypto currencies, the locale string
        // does not always like the currency codes we put in. detect those
        // cases and fallback
        if (error instanceof RangeError) {
          const value = currency.round ? currency.value.toFixed(currency.round) : currency.value;
          return value + " " + currency.code;
        } else {
          throw error;
        }
      }
    }
    const from = document.querySelector(".from span");
    const to = document.querySelector(".to span");
    if (from) {
      from.innerHTML = "${rateConversion.fromName}".length ? (formatMoney({ value: ${rateConversion.value}, code: "${rateConversion.from}" }) + " (${rateConversion.fromName})") : formatMoney({ value: ${rateConversion.value}, code: "${rateConversion.from}" });
    }
    if (to) {
      to.innerHTML = formatMoney({ value: ${converted.value}, round: ${converted.round}, code: "${converted.code}" });
      if (to.innerHTML) {
        const numbers = to.innerHTML.split(/[a-z&;.,]/gi).join("");
        if (numbers && numbers.length > 8) {
          to.parentElement.classList.add("shrink");
        }
      }
    }
    </script>
  `;
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
function trigger(query) {
  // store result into global variable for further use if package triggers
  rateConversion = parseAndNormalize(query)
  return rateConversion !== undefined;
}

module.exports = { currencyConverter, trigger };
