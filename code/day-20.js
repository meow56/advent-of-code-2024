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
	let cheatTimes2 = new Map();
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
					if(cheatTimes2.has(cheatSave)) {
						cheatTimes2.set(cheatSave, cheatTimes2.get(cheatSave) + 1);
					} else {
						cheatTimes2.set(cheatSave, 1);
					}
				}
			}
		}
	}

	function manhattan(a, b) {
		return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
	}

	let cheatTimes20 = new Map();
	let cheat10020 = 0;
	for(let tile of path) {
		let close = path.filter(elem => manhattan(elem, tile) <= 20);
		close = close.map(elem => coordToTime.get(elem.join(",")) - coordToTime.get(tile.join(",")) - manhattan(elem, tile));
		for(let time of close) {
			if(time <= 0) continue;
			if(cheatTimes20.has(time)) {
				cheatTimes20.set(time, cheatTimes20.get(time) + 1);
			} else {
				cheatTimes20.set(time, 1);
			}
			if(time >= 100) cheat10020++;
		}
	}

	displayCaption(`The number of good cheats is ${cheat100}.`);
	displayCaption(`The number of 20x good cheats is ${cheat10020}.`);

	assignPane("p1", "Part 1");
	assignPane("p2", "Part 2");
	let sortedCheatTimes2 = [...cheatTimes2.entries()];
	sortedCheatTimes2.sort((a, b) => a[1] - b[1]);
	let maxCountLength2 = sortedCheatTimes2[sortedCheatTimes2.length - 1][1].toString().length;
	sortedCheatTimes2.sort((a, b) => a[0] - b[0]);
	let maxSaveLength2 = sortedCheatTimes2[sortedCheatTimes2.length - 1][0].toString().length;
	for(let [key, value] of sortedCheatTimes2) {
		displayToPane("p1", `There are ${value.toString().padStart(maxCountLength2, " ")} cheats that save ${key.toString().padStart(maxSaveLength2, " ")} picoseconds.`);
	}
	let sortedCheatTimes20 = [...cheatTimes20.entries()];
	sortedCheatTimes20.sort((a, b) => a[1] - b[1]);
	let maxCountLength20 = sortedCheatTimes20[sortedCheatTimes20.length - 1][1].toString().length;
	sortedCheatTimes20.sort((a, b) => a[0] - b[0]);
	let maxSaveLength20 = sortedCheatTimes20[sortedCheatTimes20.length - 1][0].toString().length;
	for(let [key, value] of sortedCheatTimes20) {
		displayToPane("p2", `There are ${value.toString().padStart(maxCountLength20, " ")} cheats that save ${key.toString().padStart(maxSaveLength2, " ")} picoseconds.`);
	}
}