"use strict";

function day14(input) {
	const FILE_REGEX = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g;
	let entry;
	let robots = [];
	while(entry = FILE_REGEX.exec(input)) {
		robots.push([+entry[1], +entry[2], +entry[3], +entry[4]]);
	}

	let quads = [0, 0, 0, 0];
	for(let robot of robots) {
		let finalX = (((robot[0] + (100 * robot[2])) % 101) + 101) % 101;
		let finalY = (((robot[1] + (100 * robot[3])) % 103) + 103) % 103;
		if(finalX === 50 || finalY === 51) continue;
		quads[(finalX > 50 ? 2 : 0) + (finalY > 51 ? 1 : 0)]++;
	}

	displayCaption(`The safety score is ${quads.reduce((a, v) => a * v)}.`);

	function displayRobots(time) {
		let grid = [];
		for(let i = 0; i < 103; i++) {
			grid.push((new Array(101)).fill(" "));
		}
		for(let robot of robots) {
			let finalX = (((robot[0] + (time * robot[2])) % 101) + 101) % 101;
			let finalY = (((robot[1] + (time * robot[3])) % 103) + 103) % 103;
			grid[finalY][finalX] = "█";
		}
		clearText();
		displayText(`Time ${time}:`);
		for(let row of grid) {
			displayText(row.join(""));
		}
	}


	function loopTime() {
		let num = 0;

		function next() {
			num++;
			displayRobots(num);
		}

		function add100() {
			num += 100;
			displayRobots(num);
		}

		function prev() {
			num = Math.max(0, num - 1);
			displayRobots(num);
		}

		function minus100() {
			num = Math.max(0, num - 100);
			displayRobots(num);
		}

		displayRobots(num);

		return [next, prev, add100, minus100];
	}

	let [next, prev, add100, minus100] = loopTime();

	assignButton(minus100, "Minus 100");
	assignButton(prev, "Previous");
	assignButton(next, "Next");
	assignButton(add100, "Plus 100");
}