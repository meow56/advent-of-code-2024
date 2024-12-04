"use strict";

function day04(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let grid = [];
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	let xmas = 0;
	function findXMAS(line) {
		for(let i = 0; i < line.length; i++) {
			if(line.slice(i).startsWith('XMAS')) {
				xmas++;
			} else if(line.slice(i).startsWith('SAMX')) {
				xmas++;
			}
		}
	}

	function findXMASInGrid(grid) {
		for(let line of grid) {
			findXMAS(line.join(''));
		}
	}

	findXMASInGrid(grid);

	let columns = [];
	for(let i = 0; i < grid[0].length; i++) {
		columns.push(grid.map(e => e[i]));
	}

	findXMASInGrid(columns);

	let diagDR = [];
	for(let i = 0; i < grid.length * 2 - 1; i++) {
		let diagonal = [];
		let startIndex = [Math.max(grid.length - i - 1, 0), Math.max(0, i - grid.length + 1)];
		while(startIndex[1] < grid[0].length && startIndex[0] < grid.length) {
			diagonal.push(grid[startIndex[0]][startIndex[1]]);
			startIndex[0]++;
			startIndex[1]++;
		}
		diagDR.push(diagonal);
	}

	findXMASInGrid(diagDR);


	let diagUR = [];
	for(let i = 0; i < grid.length * 2 - 1; i++) {
		let diagonal = [];
		let startIndex = [Math.min(i, grid.length - 1), Math.max(0, i - grid.length + 1)];
		while(startIndex[1] < grid[0].length && startIndex[0] >= 0) {
			diagonal.push(grid[startIndex[0]][startIndex[1]]);
			startIndex[0]--;
			startIndex[1]++;
		}
		diagUR.push(diagonal);
	}

	findXMASInGrid(diagUR);

	displayCaption(`The number of XMAS is ${xmas}.`);
}