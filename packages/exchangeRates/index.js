'use strict';

var https = require('https');
var currentPrice;
var usd;
var cad;
var eur;
var gbp;

var options = {
    host: 'api.nbp.pl',
    path: '/api/exchangerates/tables/a/?format=json',
    headers: {'User-Agent': 'request'}
};

https.get(options, function (res) {
    var json = '';
    res.on('data', function (chunk) {
        json += chunk;
    });
    res.on('end', function () {
        if (res.statusCode === 200) {
            try {
                var data = JSON.parse(json);
                usd = data[0].rates[1].mid;
                cad = data[0].rates[4].mid;
                eur = data[0].rates[7].mid;
                gbp = data[0].rates[10].mid;
            } catch (e) {
                console.log('Error parsing JSON!');
            }
        } else {
            console.log('Status:', res.statusCode);
        }
    });
}).on('error', function (err) {
        console.log('Error:', err);
});

function exchangeRates(query) {
    query = query.toLowerCase();
    var amount = query.split(' ').join('');
    amount = amount.split(',').join('');
    amount = amount.match(/\d+/g).map(Number);
    var first;
    var second;
    if(query.includes("usd to pln")){
        first ="USD";
        second = "PLN";
        currentPrice = usd;
    }
    if(query.includes("usd to eur")){
        first ="USD";
        second = "EUR";
        currentPrice = eur / usd;
    }
    if(query.includes("usd to cad")){
        first ="USD";
        second = "CAD";
        currentPrice = cad / usd;
    }
    if(query.includes("usd to gbp")){
        first ="USD";
        second = "BGP";
        currentPrice = gbp / usd;
    }
    if(query.includes("pln to usd")){
        first ="PLN";
        second = "USD";
        currentPrice = usd;
    }
    if(query.includes("pln to eur")){
        first ="PLN";
        second = "EUR";
        currentPrice = eur;
    }
    if(query.includes("pln to gbp")){
        first ="PLN";
        second = "GBP";
        currentPrice = gbp;
    }
    if(query.includes("pln to cad")){
        first ="PLN";
        second = "CAD";
        currentPrice = cad;
    }
    if(query.includes("eur to usd")){
        first ="EUR";
        second = "USD";
        currentPrice = usd / eur;
    }
    if(query.includes("eur to gbp")){
        first ="EUR";
        second = "GBP";
        currentPrice = gbp / eur;
    }
    if(query.includes("eur to cad")){
        first ="EUR";
        second = "CAD";
        currentPrice = cad / eur;
    }
    if(query.includes("eur to pln")){
        first ="EUR";
        second = "PLN";
        currentPrice = eur;
    }

    if(query.includes("cad to usd")){
        first ="CAD";
        second = "USD";
        currentPrice = usd / cad;
    }
    if(query.includes("cad to eur")){
        first ="CAD";
        second = "EUR";
        currentPrice = eur / cad;
    }
    if(query.includes("cad to gbp")){
        first ="CAD";
        second = "GBP";
        currentPrice = gbp / cad;
    }
    if(query.includes("cad to pln")){
        first ="CAD";
        second = "PLN";
        currentPrice = cad;
    }

    if(query.includes("gbp to usd")){
        first ="GBP";
        second = "USD";
        currentPrice = usd / gbp;
    }
    if(query.includes("gbp to eur")){
        first ="GBP";
        second = "EUR";
        currentPrice = eur / gbp;
    }
    if(query.includes("gbp to cad")){
        first ="GBP";
        second = "CAD";
        currentPrice = cad / gbp;
    }
    if(query.includes("gbp to pln")){
        first ="GBP";
        second = "PLN";
        currentPrice = gbp;
    }
    

    if(second === "PLN"){
        var summary = amount[0] * currentPrice;
    } else {
        var summary = amount[0] / currentPrice;
    }
    
    summary = summary.toFixed(2);
    summary = parseFloat(summary).toLocaleString('en');

    return `
        <div class="mainCol" style="background: #eff2f5;">
        <p class="exchangeRates">
            <span style="font-size:20px; color:#333;">${amount[0].toLocaleString('en')} ${first} =</span>
            <br />
            <span style="font-size:30px; color:#111;">${summary} ${second}</span>
        </p>
        <p class ="smallText">Presearch does not guarantee the accuracy of exchange rates used in the calculator.<br />The prices are given for information only.</p>
        </div>
        
        <style>
        .exchangeRates {
            margin-left: 15px;
            line-height: normal;
            font-family: 'Open Sans', sans-serif;
            letter-spacing: normal;
        }
        .smallText {
            font-size: 10px;
            margin-left: 15px;
            font-family: 'Open Sans', sans-serif;
            letter-spacing: normal;
            color: #777;
            }
        </style>
    `;
}

function trigger(query) {
    query = query.toLowerCase();

    if(query.includes("pln to usd") || query.includes("pln to eur") || query.includes("pln to cad") || query.includes("pln to gbp") || 
    query.includes("usd to pln") || query.includes("usd to eur") || query.includes("usd to gbp") || query.includes("usd to cad") || 
    query.includes("eur to usd") || query.includes("eur to pln") || query.includes("eur to gbp") ||query.includes("eur to cad") ||
    query.includes("cad to usd") || query.includes("cad to pln") || query.includes("cad to gbp") || query.includes("cad to eur") ||
    query.includes("gbp to usd") || query.includes("gbp to pln") || query.includes("gbp to cad") || query.includes("gbp to eur")) {
        var iWantToExchange = query;
    }
    return query === iWantToExchange;
}
  
  module.exports = { exchangeRates, trigger };
