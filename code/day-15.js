"use strict";

function day15(input) {
	const MAP_REGEX = /[#.O@]+/g;
	let entry;
	let grid = [];
	while(entry = MAP_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	const COMMANDS_REGEX = /[\^v<>]+/g;
	let commands = [];
	while(entry = COMMANDS_REGEX.exec(input)) {
		commands.push(...(entry[0].split("")));
	}

	let boxes = new Map();
	let boxes2 = new Map();
	let walls = new Map();
	let walls2 = new Map();
	let startPos;
	let startPos2;
	for(let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid.length; j++) {
			if(grid[i][j] === "O") {
				boxes.set(`${j},${i}`);
				boxes2.set(`${2 * j},${i}`);
			}
			if(grid[i][j] === "#") {
				walls.set(`${j},${i}`);
				walls2.set(`${2 * j},${i}`);
				walls2.set(`${2 * j + 1},${i}`);
			}
			if(grid[i][j] === "@") {
				startPos = [j, i];
				startPos2 = [2 * j, i];
			}
		}
	}

	function move(pos, dir) {
		let nextPos = [pos[0] + dir[0], pos[1] + dir[1]];
		if(walls.has(nextPos.join(","))) return false;
		if(boxes.has(nextPos.join(","))) {
			if(!move(nextPos, dir)) return false;
		}

		boxes.set(nextPos.join(","));
		boxes.delete(pos.join(","));
		return true;
	}

	function move2(pos, dir, moves) {
		let nextPos = [pos[0] + dir[0], pos[1] + dir[1]];
		let nextPos2 = [pos[0] + dir[0] + 1, pos[1] + dir[1]];
		let nextPos0 = [pos[0] + dir[0] - 1, pos[1] + dir[1]];
		if(walls2.has(nextPos.join(",")) || walls2.has(nextPos2.join(","))) return false;
		if(boxes2.has(nextPos.join(","))) {
			moves = move2(nextPos, dir, moves.slice());
			if(!moves) return false;
		}
		if(boxes2.has(nextPos2.join(","))) {
			if(nextPos2[0] !== pos[0] || nextPos2[1] !== pos[1]) {
				moves = move2(nextPos2, dir, moves.slice());
				if(!moves) return false;
			}
		}
		if(boxes2.has(nextPos0.join(","))) {
			if(nextPos0[0] !== pos[0] || nextPos0[1] !== pos[1]) {
				moves = move2(nextPos0, dir, moves.slice());
				if(!moves) return false;
			}
		}

		let moveKey = `${pos.join(",")};${nextPos.join(",")}`;
		if(moves.includes(moveKey)) {
			return moves;
		}
		return [...moves, moveKey];
	}

	let pos = startPos.slice();
	for(let command of commands) {
		let direction;
		switch(command) {
		case "^":
			direction = [0, -1];
			break;
		case ">":
			direction = [1, 0];
			break;
		case "v":
			direction = [0, 1];
			break;
		case "<":
			direction = [-1, 0];
			break;
		}

		let nextPos = [pos[0] + direction[0], pos[1] + direction[1]];
		if(walls.has(nextPos.join(","))) continue;
		if(boxes.has(nextPos.join(","))) {
			if(move(nextPos, direction)) {
				pos = nextPos;
			}
		} else {
			pos = nextPos;
		}
	}

	let gpsSum = 0;
	for(let box of boxes.keys()) {
		let split = box.split(",").map(e => +e);
		let gps = 100 * split[1] + split[0];
		gpsSum += gps;
	}

	let pos2 = startPos2.slice();
	for(let command of commands) {
		let direction;
		switch(command) {
		case "^":
			direction = [0, -1];
			break;
		case ">":
			direction = [1, 0];
			break;
		case "v":
			direction = [0, 1];
			break;
		case "<":
			direction = [-1, 0];
			break;
		}

		let nextPos = [pos2[0] + direction[0], pos2[1] + direction[1]];
		let nextPos2 = [pos2[0] + direction[0] - 1, pos2[1] + direction[1]]
		if(walls2.has(nextPos.join(","))) continue;
		if(boxes2.has(nextPos.join(",")) || boxes2.has(nextPos2.join(","))) {
			if(boxes2.has(nextPos.join(","))) {
				let moveOut = move2(nextPos, direction, [])
				if(moveOut) {
					pos2 = nextPos;
					for(let boxMove of moveOut) {
						let split = boxMove.split(";");
						boxes2.delete(split[0]);
						boxes2.set(split[1]);
					}
				}
			} else {
				let moveOut = move2(nextPos2, direction, []);
				if(moveOut) {
					pos2 = nextPos;
					for(let boxMove of moveOut) {
						let split = boxMove.split(";");
						boxes2.delete(split[0]);
						boxes2.set(split[1]);
					}
				}
			}
		} else {
			pos2 = nextPos;
		}
	}

	let gpsSum2 = 0;
	for(let box of boxes2.keys()) {
		let split = box.split(",").map(e => +e);
		let gps = 100 * split[1] + split[0];
		gpsSum2 += gps;
	}


	displayCaption(`The sum of GPS values is ${gpsSum}.`);
	displayCaption(`The sum of wide GPS values is ${gpsSum2}.`);


	function display() {
		let gridCopy = grid.map(e => e.slice());
		for(let i = 0; i < gridCopy.length; i++) {
			for(let j = 0; j < gridCopy[i].length; j++) {
				if(gridCopy[i][j] === "O" || gridCopy[i][j] === "@") gridCopy[i][j] = ".";
				if(boxes.has(`${j},${i}`)) gridCopy[i][j] = "O";
			}
		}
		gridCopy[pos[1]][pos[0]] = "@";

		for(let row of gridCopy) {
			displayText(row.join(""));
		}
	}

	function display2() {
		let gridCopy = grid.map(e => e.flatMap(i => {
			if(i === "#") return ["#", "#"];
			return [".", "."];
		}));
		for(let i = 0; i < gridCopy.length; i++) {
			for(let j = 0; j < gridCopy[i].length; j++) {
				if(boxes2.has(`${j},${i}`)) {
					gridCopy[i][j] = "[";
					gridCopy[i][j + 1] = "]";
				}
			}
		}
		gridCopy[pos2[1]][pos2[0]] = "@";

		for(let row of gridCopy) {
			displayText(row.join(""));
		}
	}

	display();
	display2();
}