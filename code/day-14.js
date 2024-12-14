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
	displayCaption(`The robots are displayed.`);
	displayCaption(`It's up to you to find the tree yourself.`);
	displayCaption(`First, find the time where it looks like there's a vertical stripe.`);
	displayCaption(`Then, use the Plus 101 button to skip to the next time that happens.`);
	displayCaption(`Keep doing that until the tree appears.`);

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

		function add101() {
			num += 101;
			displayRobots(num);
		}

		function prev() {
			num = Math.max(0, num - 1);
			displayRobots(num);
		}

		function minus101() {
			num = Math.max(0, num - 101);
			displayRobots(num);
		}

		displayRobots(num);

		return [next, prev, add101, minus101];
	}

	let [next, prev, add101, minus101] = loopTime();

	assignButton(minus101, "Minus 101");
	assignButton(prev, "Previous");
	assignButton(next, "Next");
	assignButton(add101, "Plus 101");
}