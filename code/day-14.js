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
}