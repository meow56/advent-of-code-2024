"use strict";

function day06(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let grid = [];
	let guard;
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(''));
		if(entry[0].includes('^')) {
			guard = [entry[0].indexOf('^'), grid.length - 1, [0, -1]];
		}
	}

	let visited = new Map();
	while(true) {
		let mapKey = `${guard[0]},${guard[1]}`;
		if(!visited.has(mapKey)) {
			visited.set(mapKey);
		}
		let nextPos = [guard[0] + guard[2][0], guard[1] + guard[2][1]];
		let nextLocation = grid[nextPos[1]]?.[nextPos[0]];
		if(nextLocation === undefined) break;
		if(nextLocation === '#') {
			// 0, -1 -> 1, 0
			// 1, 0 -> 0, 1
			// 0, 1 -> -1, 0
			// -1, 0 -> 0, -1
			guard[2] = [-guard[2][1], guard[2][0]];
		} else {
			guard[0] = nextPos[0];
			guard[1] = nextPos[1];
		}
	}

	displayCaption(`The total number of visited tiles is ${visited.size}.`);
}