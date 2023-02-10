'use strict';

async function stopWatch(query, API_KEY) {

	return `
	<div id="presearchPackage">
		<div class="container">
			<div class="time-border">
				<span class="time" id="display">00:00:00</span>
			</div>
			<div class="buttonContainer">
				<button onClick='start()' class="playButton">
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="32" cy="32" r="31.5" stroke="currentColor"/>
					<path d="M22.9 16.9108L47.0687 32.2909L22.9 47.671V16.9108Z" stroke="currentColor"/>
					</svg>
				</button>
				<button onClick='pause()' class="pauseButton">
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="32" cy="32" r="31.5" stroke="currentColor"/>
					<path d="M43.5 17.5V45.6667H36.1667V17.5H43.5ZM26.8333 17.5V45.6667H19.5V17.5H26.8333Z" stroke="currentColor"/>
					</svg>
				</button>
				<button onClick='reset()' class="resetButton">
					<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="32" cy="32" r="31.5" stroke="currentColor"/>
					<rect x="19.2" y="19.2" width="25.6" height="25.6" fill="currentColor"/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<style>
	#presearchPackage .container {
			display: grid;
			grid-row-gap: 23px;
			padding-right:50px;
			width: 187px;
			padding-bottom:25px;
		  }
		  
	#presearchPackage .time-border {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 270px;
			width: 270px;
			border: 2px solid;
			border-radius: 50%;
			position: relative;
		  }
		  
	#presearchPackage .time {
			font-weight: 300;
			font-size: 50px;
			position: absolute;
			left: 32px;
		  }
	  
	#presearchPackage .buttonContainer {
			display: flex;
			justify-content: space-between;
		  }

	.dark #presearchPackage .container {
		color:white;
	  }
	
	.dark #presearchPackage path{
		stroke: white;
	}

	.dark #presearchPackage rect{
		stroke: white;
	}
	</style>

	<script>
	function timeToString(time) {
		let diffInHrs = time / 3600000;
		let hh = Math.floor(diffInHrs);
	  
		let diffInMin = (diffInHrs - hh) * 60;
		let mm = Math.floor(diffInMin);
	  
		let diffInSec = (diffInMin - mm) * 60;
		let ss = Math.floor(diffInSec);
	  
		let diffInMs = (diffInSec - ss) * 100;
		let ms = Math.floor(diffInMs);
	  
		let formattedMM = mm.toString().padStart(2, "0");
		let formattedSS = ss.toString().padStart(2, "0");
		let formattedMS = ms.toString().padStart(2, "0");
	  
		return formattedMM+":"+formattedSS+":"+formattedMS ;
	  }
	  
	  let startTime;
	  let elapsedTime = 0;
	  let timerInterval;
	  
	  function display(txt) {
		document.getElementById("display").innerHTML = txt;
	  }
	  
	  function start() {
		startTime = Date.now() - elapsedTime;
		timerInterval = setInterval(function printTime() {
		  elapsedTime = Date.now() - startTime;
		  display(timeToString(elapsedTime));
		}, 10);
	  }
	  
	  function pause() {
		clearInterval(timerInterval);
	  }
	  
	  function reset() {
		clearInterval(timerInterval);
		display("00:00:00");
		elapsedTime = 0;
	  }
	</script>
	`;
}

async function trigger(query) {
	if (query) {
		query = query ? query.toLowerCase() : "";
		if (query === "stop watch" || query === "stopwatch") return true;
	}
	return false;
}

module.exports = { stopWatch, trigger };