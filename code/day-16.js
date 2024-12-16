"use strict";

function day16(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let grid = [];
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	let startPos;
	let endPos;
	for(let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid[i].length; j++) {
			if(grid[i][j] === "S") startPos = [j, i];
			if(grid[i][j] === "E") endPos = [j, i];
		}
	}

	let pos = startPos.slice();
	let dir = [1, 0];
	let minScore = Number.MAX_SAFE_INTEGER;
	let toExplore = [[pos, dir, 0]];
	let visited = new Map();
	while(toExplore.length !== 0) {
		let next = toExplore.shift();
		console.log(next[0], next[1], next[2]);
		if(next[0][0] === endPos[0] && next[0][1] === endPos[1]) {
			if(next[2] < minScore) minScore = next[2];
			continue;
		}

		let mapKey = `${next[0].join(",")};${next[1].join(",")}`;
		if(visited.has(mapKey)) {
			if(visited.get(mapKey) <= next[2]) continue;
		}
		visited.set(mapKey, next[2]);


		// [1, 0] -> [0, -1]
		let lDir = [next[1][1], -next[1][0]];
		let rDir = [-next[1][1], next[1][0]];

		let fNeighbor = [next[0][0] + next[1][0], next[0][1] + next[1][1]];
		let lNeighbor = [next[0][0] + lDir[0], next[0][1] + lDir[1]];
		let rNeighbor = [next[0][0] + rDir[0], next[0][1] + rDir[1]];
		let neighbors = [];
		if(grid[fNeighbor[1]][fNeighbor[0]] !== "#") {
			neighbors.push(fNeighbor);
			toExplore.push([fNeighbor.slice(), next[1].slice(), next[2] + 1]);
		}
		if(grid[lNeighbor[1]][lNeighbor[0]] !== "#") {
			neighbors.push(lNeighbor);
			toExplore.push([lNeighbor.slice(), lDir.slice(), next[2] + 1001]);
		}
		if(grid[rNeighbor[1]][rNeighbor[0]] !== "#") {
			neighbors.push(rNeighbor);
			toExplore.push([rNeighbor.slice(), rDir.slice(), next[2] + 1001]);
		}



	}

	displayCaption(`The minimum score is ${minScore}.`);
}