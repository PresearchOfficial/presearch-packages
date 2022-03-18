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

  const converted = convert(conversion, rates);

  if (!converted) {
    return undefined;
  }

  return `
    <div id="presearchPackage">
      <div id="currencyConverter">
        <div class="from"><span></span><i> &asymp;</i></div>
        <div class="to"><span></span></div>
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
    @media only screen and (max-width:400px) {
      .to.shrink {
        font-size: large;
        margin-bottom: 2px;
      }
    }
    </style>
    <script>
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
    </script>
  `;
}

//	here you should check, if the query should trigger your package
//	ie. if you are building 'randomNumber' package, 'random number' query will be a good choice
function trigger(query) {
  return parseAndNormalize(query) !== undefined;
}

module.exports = { currencyConverter, trigger };
