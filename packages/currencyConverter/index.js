'use strict';
const {parseAndNormalize, fetchRates, convert: serverConvert} = require('./services');

// global variable to store return value from parseAndNormalize function
let rateConversion = '';

async function currencyConverter(query, API_KEY = '96a50d99-e968-468a-b415-49acfdf6215b') {
  if (!rateConversion) {
    return undefined;
  }

  const rates = await fetchRates(rateConversion, API_KEY);
  if (!rates) {
    return undefined;
  }

  const converted = serverConvert(rateConversion, rates);
  if (!converted) {
    return undefined;
  }
  const convertedFixed = (Math.round(converted.value * (10 ** converted.round)) / (10 ** converted.round)).toLocaleString(undefined, {maximumFractionDigits: converted.round});

  return `
    <div id="presearchPackage">
      <div id="currencyConverter">
        <div class="from"><span></span><i> &asymp;</i></div>
        <div class="to"><span></span></div>
        <div class="interactive-calculation">
            <div class="interactive-input-container">
              <input id="interactive_${rateConversion.from}" class="interactive-currency-input"  type="text" data-targetId="interactive_${converted.code}" step="any"/><label for="interactive_${rateConversion.from}">${converted.fromName}</label>
            </div>
            <div class="interactive-input-container">
              <input id="interactive_${converted.code}" class="interactive-currency-input" type="text" data-targetId="interactive_${rateConversion.from}" step="any"/><label for="interactive_${converted.code}">${converted.toName}</label>
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

    .interactive-calculation {
      margin: 8px 0;
    }

    .interactive-calculation .interactive-input-container:first-child {
      margin-bottom: 6px;
    }

    .interactive-calculation .interactive-currency-input {
      border: 1px solid #dadce0;
      background: transparent;
      border-radius: 6px;
      color: #70757a;
      padding: 6px 6px 6px 12px;
      margin-right: 6px;
      max-width: 80%;
      outline: none;
      width: 160px;
    }
    .dark .interactive-calculation .interactive-currency-input {
      color: lightgray;
    }

    @media only screen and (max-width:400px) {
      .to.shrink {
        font-size: large;
        margin-bottom: 2px;
      }
    }
    </style>
    <script>
    const conversionRate = ${converted.value / rateConversion.value};
    var fromValue = ${rateConversion.value};
    var toValue = ${convertedFixed};

    const formatMoney = (currency, locale = undefined) => {
      try {
        var options = {
          minimumFractionDigits: 0,
          maximumFractionDigits: currency.round || 20,
        };
        if(currency.code){
          options['style'] = "currency";
          options['currency'] = currency.code;
        }
        return currency.value.toLocaleString(locale, options);
      } catch (error) {
        // since we're dealing with cryptocurrencies, the locale string
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

    // rate conversion function
    const convert = (target, inputValue) => {
      var result = 0;
      if(target === "interactive_${converted.code}"){
        result = inputValue * conversionRate;
      }else if(target === 'interactive_${rateConversion.from}'){
        result = inputValue / conversionRate;
      }
      const round = result > 1 ? 2 : -Math.floor( Math.log10(result) + 1) + 2;
      result = Math.round(result * (10**round)) / (10**round);
      return { value : result, round : round};
    }

    // show rate conversion and set input value on page load
    const from = document.querySelector(".from span");
    const to = document.querySelector(".to span");
    if (from) {
      from.innerHTML = formatMoney({value: ${rateConversion.value}, code: "${rateConversion.from}"}) +  ("${rateConversion.fromName}".length ? " (${rateConversion.fromName})" :"");
      document.getElementById("interactive_${rateConversion.from}").value = fromValue.toLocaleString();
    }
    if (to) {
      to.innerHTML = formatMoney({ value: ${converted.value}, round: ${converted.round}, code: "${converted.code}" });
      document.getElementById("interactive_${converted.code}").value = toValue.toLocaleString();

      if (to.innerHTML) {
        const numbers = to.innerHTML.split(/[a-z&;.,]/gi).join("");
        if (numbers && numbers.length > 8) {
          to.parentElement.classList.add("shrink");
        }
      }
    }

    // Interactive Input JS
    const interactiveInputs = document.querySelectorAll('.interactive-currency-input');

    interactiveInputs.forEach(input => {
      input.addEventListener('focus', (event) => {
        event.target.setAttribute('type','number');
        event.target.value = event.target.id == "interactive_${converted.code}" ? toValue : fromValue;
        event.target.select();
      })
    })

    interactiveInputs.forEach(input => {
      input.addEventListener('blur', (event) => {
        event.target.setAttribute('type','text');
        event.target.value = event.target.id == "interactive_${converted.code}" ? parseFloat(toValue).toLocaleString() : parseFloat(fromValue).toLocaleString();
      })
    })

    interactiveInputs.forEach(input => {
      input.addEventListener('input', (event) => {
        event.preventDefault()
        const target = event.target.dataset.targetid;
        const inputToChange = document.getElementById(target)

        const { value } = event.target
        if (value === "" || value < 0) {
          inputToChange.value = ""
          return;
        }

        // check user input
        if (event.data) {

          // allow to use "," and "."
          if ([",", "."].includes(event.data)) {
            return;
          }

          // if the last input is "0", check if we have "," or "." before
          if (event.data === "0") {
            const previousInput = value.substring(value.length - 2, value.length - 1);
            if (previousInput === "." || previousInput === ",") {
              return;
            }
          }

          // prevent from entering values other than numbers
          if (!event.data.match(/[0-9]/g)) {
            event.target.value = event.target.value.split(event.data).join("");
            return;
          }
        }

        const result = convert(target, value);

        // update global variables
        if(event.target.id == "interactive_${converted.code}"){
            toValue = value;
            fromValue = result.value;
        }else{
            toValue = result.value;
            fromValue = value;
        }

        inputToChange.value = result.round === 0 ? result.value.toLocaleString() : formatMoney(result);
      });
    });
    </script>
  `;
}

//	here you should check, if the query should trigger your package
//	i.e. if you are building 'randomNumber' package, 'random number' query will be a good choice
function trigger(query) {
  // store result into global variable for further use if package triggers
  rateConversion = parseAndNormalize(query)
  return rateConversion !== undefined;
}

module.exports = { currencyConverter, trigger };
