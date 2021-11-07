'use strict';

const createHTML = (left, right) => {
	//keep <div id='presearchPackage'>
	return `
	<div id='presearchPackage'>
		<div><span class='result'>${left.qty} ${left.display} = ${right.price} ${right.display}</span></div>
	</div>
	<style>
		#presearchPackage {
			display: flex;
			flex-direction: column;
		}
		.dark #presearchPackage .result {
			color: lime;
		}
		#presearchPackage .result {
			color: #ff6103;
		}
	</style>
	`;
};

module.exports = {createHTML};