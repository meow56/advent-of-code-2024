"use strict";

function day20(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let grid = [];
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	let startPos;
	let endPos;
	let traversable = [];
	for(let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid[i].length; j++) {
			if(grid[i][j] === "S") startPos = [j, i];
			if(grid[i][j] === "E") endPos = [j, i];
			if(grid[i][j] === ".") traversable.push([j, i]);
		}
	}

	function samePos(a, b) {
		if(!a || !b) return a === b;
		return a[0] === b[0] && a[1] === b[1];
	}

	function coord(pos) {
		return grid[pos[1]]?.[pos[0]];
	}

	let path = [startPos.slice()];
	while(!samePos(path[path.length - 1], endPos)) {
		console.log(path);
		let uNeigh = [path[path.length - 1][0], path[path.length - 1][1] - 1];
		let rNeigh = [path[path.length - 1][0] + 1, path[path.length - 1][1]];
		let dNeigh = [path[path.length - 1][0], path[path.length - 1][1] + 1];
		let lNeigh = [path[path.length - 1][0] - 1, path[path.length - 1][1]];
		if((coord(uNeigh) === "." && !samePos(uNeigh, path[path.length - 2])) || samePos(uNeigh, endPos)) {
			path.push(uNeigh.slice());
		} else if((coord(rNeigh) === "." && !samePos(rNeigh, path[path.length - 2])) || samePos(rNeigh, endPos)) {
			path.push(rNeigh.slice());
		} else if((coord(dNeigh) === "." && !samePos(dNeigh, path[path.length - 2])) || samePos(dNeigh, endPos)) {
			path.push(dNeigh.slice());
		} else if((coord(lNeigh) === "." && !samePos(lNeigh, path[path.length - 2])) || samePos(lNeigh, endPos)) {
			path.push(lNeigh.slice());
		}
	}

	let coordToTime = new Map();
	let cheatTimes = new Map();
	path.forEach((elem, index) => coordToTime.set(elem.join(","), index));
	let cheat100 = 0;
	for(let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid[i].length; j++) {
			if(coord([j, i]) !== "#") continue;
			let neighbors = [
				[j, i - 1],
				[j + 1, i],
				[j, i + 1],
				[j - 1, i],
			];
			neighbors = neighbors.flatMap(e => coord(e) === "." || coord(e) === "E" || coord(e) === "S" ? [e] : []);
			if(neighbors.length < 2) continue;
			neighbors = neighbors.map(e => coordToTime.get(e.join(",")));
			neighbors.sort((a, b) => a - b);
			for(let k = 0; k < neighbors.length; k++) {
				for(let l = k + 1; l < neighbors.length; l++) {
					let cheatSave = neighbors[l] - neighbors[k] - 2;
					if(cheatSave === 0) continue;
					if(cheatSave >= 100) cheat100++;
					if(cheatTimes.has(cheatSave)) {
						cheatTimes.set(cheatSave, cheatTimes.get(cheatSave) + 1);
					} else {
						cheatTimes.set(cheatSave, 1);
					}
				}
			}
		}
	}

	displayCaption(`The number of good cheats is ${cheat100}.`);

	for(let [key, value] of cheatTimes.entries()) {
		displayText(`${key}: ${value}`);
	}
}