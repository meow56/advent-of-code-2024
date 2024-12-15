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
	let walls = new Map();
	let startPos;
	for(let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid.length; j++) {
			if(grid[i][j] === "O") boxes.set(`${j},${i}`);
			if(grid[i][j] === "#") walls.set(`${j},${i}`);
			if(grid[i][j] === "@") startPos = [j, i];
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

	displayCaption(`The sum of GPS values is ${gpsSum}.`);

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

	display();
}