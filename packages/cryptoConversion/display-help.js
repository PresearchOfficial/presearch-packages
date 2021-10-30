'use strict';

const createHTML = (left, right) => {
    //todo default display if .display is empty?

	// here you need to return HTML code for your package. You can use <style> and <script> tags
	// you need to keep <div id='presearchPackage'> here, you can remove everything else
	return `
	<div id='presearchPackage'>
		<span class='mycolor'>${left.qty} ${left.display} = ${right.price} ${right.display}</span>
	</div>
	<style>
		.dark #presearchPackage .mycolor {
			color: yellow;
		}
		#presearchPackage .mycolor {
			color: green;
			cursor: pointer;
		}
	</style>
	<script>
		document.querySelector('.mycolor').addEventListener('click', () => alert('clicked!'));
	</script>
	`;
};

module.exports = {createHTML};