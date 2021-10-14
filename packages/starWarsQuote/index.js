const quotes = require('./quotes')

function starWarsQuote(query) {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return `
    <div class="mainCol">
      <h3 class="starWarsQuote">"${quote ? quote : ``}"</h1>
    </div>
    <style>
      .starWarsQuote {
        padding: 10px;
        font-weight: 600;
        font-style: italic;
      }
      .dark .starWarsQuote {
        color: #D1D5DB;
      }
    </style>
  `;
}

function trigger(query) {
  return query === 'starwars quote' || query === 'star wars quote';
}

module.exports = { starWarsQuote, trigger };
