/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable arrow-body-style */

'use strict';

const getDigits = (num) => {
    if (num >= 1000000) {
        return 2;
    }
    if (num >= 1000) {
        return 4;
    }
    return 8;
};

const createHTML = (left, right) => {
    const qtyDigits = getDigits(left.qty);
    const priceDigits = getDigits(right.price);
    // backup format in case we cannot use the user's locale
    const qty = left.qty.toLocaleString('en-US', { maximumFractionDigits: qtyDigits });
    const price = right.price.toLocaleString('en-US', { maximumFractionDigits: priceDigits });

    // keep <div id='presearchPackage'>
    return `
	<div id='presearchPackage'>
		<div class='result'>
			<noscript>${qty} ${left.display} = ${price} ${right.display}</noscript>
			<span id='result'></span>
		</div>
		<div>
			<span class='datasource'><a href='https://coinmarketcap.com/converter/'>Data provided by CoinMarketCap.</a></span>
			<span class='disclaimer'>Conversion rates may be delayed or inaccurate.</span>
		</div>
	</div>
	<style>
		#presearchPackage {
			display: flex;
			flex-direction: column;
		}
		#presearchPackage .result {
			color: mediumseagreen;
		}
		.dark #presearchPackage .result {
			color: lime;
		}
        #presearchPackage .datasource {
            font-size: 12px;
			color: #444;
        }
        .dark #presearchPackage .datasource {
			color: #ddd;
        }
        #presearchPackage .disclaimer {
            font-size: 10px;
            color: #777;
        }
        .dark #presearchPackage .disclaimer {
            color: #aaa;
        }
	</style>
	<script>
		(function updateQty() {
			const qty = (${left.qty}).toLocaleString(undefined, {maximumFractionDigits: ${qtyDigits}});
			const price = (${right.price}).toLocaleString(undefined, {maximumFractionDigits: ${priceDigits}});
			const result = qty + ' ${left.display} = ' + price + ' ${right.display}';
			document.getElementById('result').innerHTML = result;
		}());
	</script>
	`;
};

module.exports = { createHTML };
