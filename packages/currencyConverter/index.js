'use strict';
const {parseAndNormalize, fetchRates, convert} = require('./services');

async function currencyConverter(query, API_KEY) {
  const conversion = parseAndNormalize(query);
  if (!conversion) {
    return undefined;
  }

  const rates = await fetchRates(conversion, API_KEY);
  if (!rates) {
    return undefined;
  }
  const ratesJs = JSON.stringify(rates)

  const converted = convert(conversion, rates);
  if (!converted) {
    return undefined;
  }
  const convertedFixed = converted.value.toFixed(2)

  return `
    <div id="presearchPackage">
      <div id="currencyConverter">
        <div class="from"><span></span><i> &asymp;</i></div>
        <div class="to"><span></span></div>
        <div class="interactive-calculation">
            <div class="interactive-input-container">
              <input id="interactive_${conversion.from}" class="interactive-currency-input" type="number" value="${conversion.value}" /><label for="interactive_${conversion.from}">${conversion.from}</label>
            </div>
            <div class="interactive-input-container">
              <input id="interactive_${converted.code}" class="interactive-currency-input" type="number" value="${convertedFixed}" /><label for="interactive_${converted.code}">${converted.code}</label>
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
      padding: 6px 0 6px 12px;
      margin-right: 6px;
    }

    @media only screen and (max-width:400px) {
      .to.shrink {
        font-size: large;
        margin-bottom: 2px;
      }
    }
    </style>
    <script>
    ${convert.toString()}

    const formatMoney = (currency, locale = undefined) => {
      try {
        return currency.value.toLocaleString(
          locale,
          {
            style: "currency",
            currency: currency.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: currency.round ? currency.round : 20,
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
      from.innerHTML = "${conversion.fromName}".length ? (formatMoney({ value: ${conversion.value}, code: "${conversion.from}" }) + " (${conversion.fromName})") : formatMoney({ value: ${conversion.value}, code: "${conversion.from}" });
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

    // Interactive Input JS
    const interactiveInputs = document.querySelectorAll('.interactive-currency-input');
    const rates = ${ratesJs}
    let currentFromCurrency = "${conversion.from}"

    interactiveInputs.forEach(input => {
      input.addEventListener('focus', (event) => {
        currentFromCurrency = event.target.id.split('_').pop();
      })
    })

    interactiveInputs.forEach(input => {
      input.addEventListener('input', (event) => {
        event.preventDefault()
        const from = currentFromCurrency
        const to = rates.find(rate => rate.code !== currentFromCurrency)
        const inputToChange = document.getElementById("interactive_" + to.code)

        if(event.target.value === "" || event.target.value < 0) {
          inputToChange.value = ""
          return;
        }

        const localConversionObj = {
            from: from,
            to: to.code,
            value: event.target.value,
            fromName: from.fromName
        };
        const result = convert(localConversionObj, rates);
        inputToChange.value = result.value === 0 ? result.value : result.value.toFixed(2)
      });
    });
    </script>
  `;
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
function trigger(query) {
  return parseAndNormalize(query) !== undefined;
}

module.exports = { currencyConverter, trigger };
