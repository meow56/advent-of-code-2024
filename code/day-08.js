"use strict";

function day08(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let antennae = new Map();
	let row = 0;
	let colSize;
	let grid = [];
	while(entry = FILE_REGEX.exec(input)) {
		let line = entry[0].split("");
		grid.push(line);
		colSize = line.length;
		for(let col = 0; col < line.length; col++) {
			if(line[col] === ".") continue;
			if(antennae.has(line[col])) {
				antennae.get(line[col]).push([row, col]);
			} else {
				antennae.set(line[col], [[row, col]]);
			}
		}
		row++;
	}

	let antinodes = new Map();
	let antinodes2 = new Map();
	for(let positions of antennae.values()) {
		for(let i = 0; i < positions.length; i++) {
			for(let j = i + 1; j < positions.length; j++) {
				let pos1 = positions[i];
				let pos2 = positions[j];
				let vector = [pos1[0] - pos2[0], pos1[1] - pos2[1]];
				let anti1 = [pos1[0] + vector[0], pos1[1] + vector[1]];
				let anti2 = [pos2[0] - vector[0], pos2[1] - vector[1]];
				if(anti1[0] >= 0 && anti1[0] < row && anti1[1] >= 0 && anti1[1] < colSize) {
					antinodes.set(anti1.join(","));
				}
				if(anti2[0] >= 0 && anti2[0] < row && anti2[1] >= 0 && anti2[1] < colSize) {
					antinodes.set(anti2.join(","));
				}

				antinodes2.set(pos1.join(","));
				antinodes2.set(pos2.join(","));
				while(anti1[0] >= 0 && anti1[0] < row && anti1[1] >= 0 && anti1[1] < colSize) {
					antinodes2.set(anti1.join(","));
					anti1 = [anti1[0] + vector[0], anti1[1] + vector[1]];
				}

				while(anti2[0] >= 0 && anti2[0] < row && anti2[1] >= 0 && anti2[1] < colSize) {
					antinodes2.set(anti2.join(","));
					anti2 = [anti2[0] - vector[0], anti2[1] - vector[1]];
				}
			}
		}
	}

	displayCaption(`The number of unique antinodes is ${antinodes.size}.`);
	displayCaption(`The number of resonant antinodes is ${antinodes2.size}.`);
	displayCaption(`The grid is shown.`);
	displayCaption(`The darker shade of tiles (▓) are for part 1. Some of them are obscured by antennae.`);
	displayCaption(`Lightly shaded tiles (▒) are for part 2. Just remember that part 1 tiles and all antennae also count.`);

	let newGrid = grid.map(e => e.slice());
	for(let antinode of antinodes2.keys()) {
		let coord = antinode.split(",").map(e => +e);
		newGrid[coord[0]][coord[1]] = "▒";
	}

	for(let antinode of antinodes.keys()) {
		let coord = antinode.split(",").map(e => +e);
		newGrid[coord[0]][coord[1]] = "▓";
	}

	for(let row = 0; row < grid.length; row++) {
		for(let col = 0; col < grid[row].length; col++) {
			if(grid[row][col] !== ".") {
				newGrid[row][col] = grid[row][col];
			}
		}
	}

	for(let row = 0; row < newGrid.length; row++) {
		for(let col = 0; col < newGrid[row].length; col++) {
			if(newGrid[row][col] === ".") {
				newGrid[row][col] = " ";
			}
		}
	}

	for(let row of newGrid) {
		displayText(row.join(""));
	}
}