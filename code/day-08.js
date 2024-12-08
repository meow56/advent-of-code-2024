"use strict";

function day08(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let antennae = new Map();
	let row = 0;
	let colSize;
	while(entry = FILE_REGEX.exec(input)) {
		let line = entry[0].split("");
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
}