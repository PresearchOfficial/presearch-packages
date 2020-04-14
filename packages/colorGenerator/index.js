'use strict';

async function colorGenerator(query) {
	return `<style>
	.main {
		width: 100%;
		position: relative;
	}
	.sub {
		height: 300px;
		width: 200px;
		display: flex;
		position: absolute;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #222;
		text-align: center;
		font-weight: 600;
		color: #fff;
		z-index: 1;
	}
	.margin1 {
		margin-top: 30px !important;
		font-size: 25px;
		opacity: 0.25;
		cursor: pointer;
		width: 40%;
		fill:#fff;
	}
	.margin2 {
		font-size: 22px;
	}
	input[type="text"] {
		background: transparent;
		border: none;
		color: #fff;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}
	.noselect {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.active {
		opacity: 1 !important;
	}
	@media only screen and (max-width:800px) {
		.margin1 > svg {
			width: 36px;
			height:48px;
		}
		p > input[type="text"] {
			font-size:10px;
		}
		p {
			font-size: 20px !important;
		}
	}
</style>
<div class="main noselect">
      <div id="container1" class="sub pos0">
        <p id="lock1" class="margin1"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="72" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"/></svg></p>
        <p id="button1" class="margin2">PRESS "G"</p>
        <p>
          <input class="colors" type="text" id="hex1" readonly="readonly" />
        </p>
        <p>
          <input class="colors" type="text" id="rgb1" readonly="readonly" />
        </p>
      </div>
      <div id="container2" class="sub pos1">
        <p id="lock2" class="margin1"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="72" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"/></svg></p>
        <p id="button2" class="margin2">PRESS "G"</p>
        <p>
          <input class="colors" type="text" id="hex2" readonly="readonly" />
        </p>
        <p>
          <input class="colors" type="text" id="rgb2" readonly="readonly" />
        </p>
      </div>
      <div id="container3" class="sub pos2">
        <p id="lock3" class="margin1"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="72" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"/></svg></p>
        <p id="button3" class="margin2">PRESS "G"</p>
        <p>
          <input class="colors" type="text" id="hex3" readonly="readonly" />
        </p>
        <p>
          <input class="colors" type="text" id="rgb3" readonly="readonly" />
        </p>
      </div>
      <div id="container4" class="sub pos3">
        <p id="lock4" class="margin1"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="72" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"/></svg></p>
        <p id="button4" class="margin2">PRESS "G"</p>
        <p>
          <input class="colors" type="text" id="hex4" readonly="readonly" />
        </p>
        <p>
          <input class="colors" type="text" id="rgb4" readonly="readonly" />
        </p>
      </div>
      <div id="container5" class="sub pos4">
        <p id="lock5" class="margin1"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="72" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"/></svg></p>
        <p id="button5" class="margin2">PRESS "G"</p>
        <p>
          <input class="colors" type="text" id="hex5" readonly="readonly" />
        </p>
        <p>
          <input class="colors" type="text" id="rgb5" readonly="readonly" />
        </p>
      </div>
    </div>
<script>
(function() {

	const PACKAGE_CONTAINER_WIDTH = 1000;

	function randomColor() {
		let r = (Math.random() * (255 - 0 + 1)) << 0;
		let g = (Math.random() * (255 - 0 + 1)) << 0;
		let b = (Math.random() * (255 - 0 + 1)) << 0;
	
		const color = [r, g, b];
		return color;
	}
	
	function getId(id) {
		return document.getElementById(id);
	}
	
	function rgbToHex(rgb) {
		let hex = Number(rgb).toString(16);
		if (hex.length < 2) {
			hex = "0" + hex;
		}
		return hex;
	}
	
	function fullColorHex(r, g, b) {
		let red = rgbToHex(r);
		let green = rgbToHex(g);
		let blue = rgbToHex(b);
		return ("#" + red + green + blue).toUpperCase();
	}
	
	const one = { id: getId("container1"), lock: getId("lock1"), button: getId("button1"), hex: getId("hex1"), rgb: getId("rgb1"), save: false, clicked: false };
	const two = { id: getId("container2"), lock: getId("lock2"), button: getId("button2"), hex: getId("hex2"), rgb: getId("rgb2"), save: false, clicked: false };
	const three = { id: getId("container3"), lock: getId("lock3"), button: getId("button3"), hex: getId("hex3"), rgb: getId("rgb3"), save: false, clicked: false };
	const four = { id: getId("container4"), lock: getId("lock4"), button: getId("button4"), hex: getId("hex4"), rgb: getId("rgb4"), save: false, clicked: false };
	const five = { id: getId("container5"), lock: getId("lock5"), button: getId("button5"), hex: getId("hex5"), rgb: getId("rgb5"), save: false, clicked: false };
	
	const allColumns = [one, two, three, four, five];
	
	let elementWidth = PACKAGE_CONTAINER_WIDTH / 5;
	let columsGrid = [0, elementWidth, elementWidth * 2, elementWidth * 3, elementWidth * 4];
	
	let style = document.createElement("style");
	style.type = "text/css";
	let generateHtml = () => {
		elementWidth = PACKAGE_CONTAINER_WIDTH / 5;
		columsGrid = [0, elementWidth, elementWidth * 2, elementWidth * 3, elementWidth * 4];
		let html = "";
		for (i = 0; i < 5; i++) {
			html += '.pos'+ i + ' { position: absolute; left:' + columsGrid[i].toFixed(1) + 'px }';
		}
		return html;
	};
	style.innerHTML = generateHtml();
	document.getElementsByTagName("head")[0].appendChild(style);
	
	let columnStyle = document.querySelectorAll("style")[1];
	
	window.addEventListener("keydown", e => {
		if (e.keyCode === 71) {
			allColumns.forEach(item => {
				if (item.save) return;
				let currentColor = randomColor();
				let r = currentColor[0];
				let g = currentColor[1];
				let b = currentColor[2];
				item.id.style.background = 'rgb('+ r + ', '+ g + ', '+ b + ')';
				item.hex.value = fullColorHex(r, g, b);
				item.rgb.value = 'rgb('+ r + ', '+ g + ', '+ b + ')';
			});
		}
	});
	
	allColumns.forEach(item => {
		item.lock.addEventListener("mousedown", () => {
			if (item.save) {
				item.save = false;
				item.lock.classList.remove("active");
			} else if (!item.save) {
				item.save = true;
				item.lock.classList.add("active");
			}
		});
	
		item.id.addEventListener("mousedown", () => {
			item.clicked = true;
			item.id.style.zIndex = 2;
		});
	
		item.id.addEventListener("mousemove", e => {
			let clientWidth = item.id.clientWidth / 2;
			let position = e.clientX - clientWidth;
			let pos = parseInt(item.id.classList[1].substring(3));
			if (item.clicked) {
				item.id.style.left = position - 75 + 'px';
				if (e.clientX < columsGrid[pos - 1] + clientWidth * 2) {
					let element = document.querySelector('.pos' + (pos - 1));
					let currentElement = document.querySelector('.pos' + pos);
					element.classList.remove('pos' + (pos - 1));
					element.classList.add('pos' + pos);
					currentElement.classList.add('pos' + (pos - 1));
					currentElement.classList.remove('pos' + pos);
				}
				if (e.clientX > columsGrid[pos + 1]) {
					let element = document.querySelector('.pos' + (pos + 1));
					let currentElement = document.querySelector('.pos' + pos);
					element.classList.remove('pos' + (pos + 1));
					element.classList.add('pos' + pos);
					currentElement.classList.add('pos' + (pos + 1));
					currentElement.classList.remove('pos' + pos);
				}
			}
		});
	
		item.id.addEventListener("mouseup", () => {
			item.clicked = false;
			item.id.style.zIndex = 1;
			item.id.style.left = "";
		});
	
		item.rgb.addEventListener("mousedown", () => {
			item.rgb.className += " copied";
			let temp = item.rgb.value;
			item.rgb.focus();
			item.rgb.select();
			document.execCommand("copy");
			item.rgb.value = "Copied!";
			setTimeout(() => {
				item.rgb.className = "colors";
				item.rgb.value = temp;
			}, 500);
		});
	
		item.hex.addEventListener("mousedown", () => {
			item.hex.className += " copied";
			let temp = item.hex.value;
			item.hex.focus();
			item.hex.select();
			document.execCommand("copy");
			item.hex.value = "Copied!";
			setTimeout(() => {
				item.hex.className = "colors";
				item.hex.value = temp;
			}, 500);
		});
	});
	
		allColumns.forEach(item => {
			if (item.save) return;
			let currentColor = randomColor();
			let r = currentColor[0];
			let g = currentColor[1];
			let b = currentColor[2];
			item.id.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
			item.hex.value = fullColorHex(r, g, b);
			item.rgb.value = 'rgb(' + r + ',' + g + ',' + b + ')';
		});
})();
</script>
`;
}

async function trigger(query) {
	query = query.toLowerCase();
    return query === 'color generator' || query === 'random color' || query === 'random color generator' || query === 'colorgenerator';
}

module.exports = { colorGenerator, trigger };

