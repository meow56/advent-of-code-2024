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
	let nodes = [];
	for(let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid[i].length; j++) {
			if(grid[i][j] === "S") startPos = [j, i];
			if(grid[i][j] === "E") endPos = [j, i];
		}
	}

	function Node(pos) {
		this.pos = pos;

		this.neighbors = [];
	}

	Node.prototype.initNeighbors = function() {
		let lNeighbor = [this.pos[0], this.pos[1] - 1];
		let uNeighbor = [this.pos[0] - 1, this.pos[1]];
		let rNeighbor = [this.pos[0], this.pos[1] + 1];
		let dNeighbor = [this.pos[0] + 1, this.pos[1]];

		if(grid[lNeighbor[1]][lNeighbor[0]] !== "#") {
			this.neighbors.push(explore(lNeighbor, [0, -1]));
		}
	}

	function explore(coord, dir) {

	}

	let pos = startPos.slice();
	let dir = [1, 0];
	let minScore = Number.MAX_SAFE_INTEGER;
	let toExplore = [[pos, dir, 0, []]];
	let visited = new Map();
	let paths = new Map();
	while(toExplore.length !== 0) {
		let next = toExplore.shift();
		console.log(next[0], next[1], next[2]);
		if(next[2] > minScore) continue;
		if(next[0][0] === endPos[0] && next[0][1] === endPos[1]) {
			let toAdd = [];
			for(let tile of next[3]) {
				for(let pos of visited.get(tile)[1]) {
					if(!toAdd.includes(pos.split(";")[0])) toAdd.push(pos.split(";")[0]);
				}
				if(!toAdd.includes(tile.split(";")[0])) toAdd.push(tile.split(";")[0]);
			}
			if(paths.has(next[2])) {
				for(let tile of toAdd) {
					if(!paths.get(next[2]).includes(tile)) paths.get(next[2]).push(tile);
				}
			} else {
				paths.set(next[2], toAdd.slice());
			}
			if(next[2] < minScore) minScore = next[2];
			continue;
		}

		let mapKey = `${next[0].join(",")};${next[1].join(",")}`;
		if(visited.has(mapKey)) {
			if(visited.get(mapKey)[0] < next[2]) continue;
			if(visited.get(mapKey)[0] === next[2]) {
				visited.get(mapKey)[1] = visited.get(mapKey)[1].concat(next[3]);
				// continue;
			}
		}
		visited.set(mapKey, [next[2], next[3].slice()]);


		// [1, 0] -> [0, -1]
		let lDir = [next[1][1], -next[1][0]];
		let rDir = [-next[1][1], next[1][0]];

		let fNeighbor = [next[0][0] + next[1][0], next[0][1] + next[1][1]];
		let lNeighbor = [next[0][0] + lDir[0], next[0][1] + lDir[1]];
		let rNeighbor = [next[0][0] + rDir[0], next[0][1] + rDir[1]];
		if(grid[fNeighbor[1]][fNeighbor[0]] !== "#") {
			toExplore.push([fNeighbor.slice(), next[1].slice(), next[2] + 1, [...(next[3]), mapKey]]);
		}
		if(grid[lNeighbor[1]][lNeighbor[0]] !== "#") {
			toExplore.push([lNeighbor.slice(), lDir.slice(), next[2] + 1001, [...(next[3]), mapKey]]);
		}
		if(grid[rNeighbor[1]][rNeighbor[0]] !== "#") {
			toExplore.push([rNeighbor.slice(), rDir.slice(), next[2] + 1001, [...(next[3]), mapKey]]);
		}
	}

	let uniqueTiles = [];
	for(let tile of paths.get(minScore)) {
		let uniqueKey = tile;
		if(!uniqueTiles.includes(uniqueKey)) uniqueTiles.push(uniqueKey);
	}
	if(!uniqueTiles.includes(endPos.join(","))) uniqueTiles.push(endPos.join(","));
	if(!uniqueTiles.includes(startPos.join(","))) uniqueTiles.push(startPos.join(","));

	function display() {
		for(let i = 0; i < grid.length; i++) {
			let row = "";
			for(let j = 0; j < grid[i].length; j++) {
				if(endPos[0] === j && endPos[1] === i) {
					row += "E";
				} else if(startPos[0] === j && startPos[1] === i) {
					row += "S";
				} else if(uniqueTiles.includes(`${j},${i}`)) {
					row += "▒";
				} else if(grid[i][j] === ".") {
					row += " ";
				} else {
					row += "█";
				}
			}
			displayText(row);
		}
	}
	display();

	displayCaption(`The minimum score is ${minScore}.`);
	displayCaption(`The number of optimal seats is ${uniqueTiles.length}.`);
}