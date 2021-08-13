const quotes: string[] = require("./quotes");

function starWarsQuote(): string {
  const quote: string = quotes[Math.floor(Math.random() * quotes.length)];

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

function trigger(query: string): boolean {
  return query === "starwars quote" || query === "star wars quote";
}

module.exports = { starWarsQuote, trigger };
