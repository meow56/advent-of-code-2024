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
	let guardCopy = guard.slice();

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

	function poopyLoopy(tile) {
		let visited = new Map();
		let guard = guardCopy.slice();
		while(true) {
			let mapKey = guard.join(',');
			if(visited.has(mapKey)) return true;
			visited.set(mapKey);
			let nextPos = [guard[0] + guard[2][0], guard[1] + guard[2][1]];
			let nextLocation = grid[nextPos[1]]?.[nextPos[0]];
			if(nextLocation === undefined) return false;
			if(nextLocation === '#' || (nextPos[0] === tile[0] && nextPos[1] === tile[1])) {
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
	}

	let loopers = 0;
	let validLoops = new Map();
	for(let pos of visited.keys()) {
		let newPos = pos.split(",").map(e => +e);
		if(grid[newPos[1]][newPos[0]] === "^") continue;
		if(poopyLoopy(newPos)) {
			loopers++;
			validLoops.set(newPos.join(","));
		}
	}

	displayCaption(`The total number of visited tiles is ${visited.size}.`);
	displayCaption(`The number of possible loops is ${loopers}.`);
	displayCaption(`The grid is shown.`);
	displayCaption(`In part 1, the lightly shaded tiles (▒) are the tiles the guard walks on.`);
	displayCaption(`In part 2, the shaded tiles (▓) are the tiles that cause loops when an obstruction is placed on them.`);

	assignPane("p1", "Part 1");
	assignPane("p2", "Part 2");

	for(let i = 0; i < grid.length; i++) {
		let lineDisplay1 = "";
		let lineDisplay2 = "";
		for(let j = 0; j < grid[i].length; j++) {
			let mapKey = `${j},${i}`;
			if(grid[i][j] === "^") {
				lineDisplay1 += "^";
			} else if(visited.has(mapKey)) {
				lineDisplay1 += "▒";
			} else if(grid[i][j] === ".") {
				lineDisplay1 += " ";
			} else {
				lineDisplay1 += "█"
			}

			if(grid[i][j] === "^") {
				lineDisplay2 += "^";
			} else if(validLoops.has(mapKey)) {
				lineDisplay2 += "▓";
			} else if(grid[i][j] === ".") {
				lineDisplay2 += " ";
			} else {
				lineDisplay2 += "█"
			}
		}
		displayToPane("p1", lineDisplay1);
		displayToPane("p2", lineDisplay2);
	}
}