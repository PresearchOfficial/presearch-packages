/* eslint-disable no-tabs */
/* eslint-disable arrow-body-style */

'use strict';

const createHTML = (left, right) => {
    // keep <div id='presearchPackage'>
    return `
	<div id='presearchPackage'>
		<div class='result'>${left.qty} ${left.display} = ${right.price} ${right.display}</div>
		<div>
			<span class='datasource'>Data provided by Coinbase.</span>
			<span class='disclaimer'>Conversion rates may be delayed or inaccurate.</span>
		</div>
	</div>
	<style>
		#presearchPackage {
			display: flex;
			flex-direction: column;
		}
		#presearchPackage .result {
			color: #ff6103;
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
	`;
};

module.exports = { createHTML };
