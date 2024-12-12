"use strict";

function day12(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let grid = [];
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	let visited = [];
	function explore(i, j, area = 0, perimeter = 0) {
		if(visited.includes(`${i},${j}`)) return [area, perimeter];
		let currentLetter = grid[i][j];
		area++;
		visited.push(`${i},${j}`);
		let toExplore = [];
		if(grid[i - 1]?.[j] === currentLetter) {
			if(!visited.includes(`${i - 1},${j}`)) toExplore.push([i - 1, j]);
		} else {
			perimeter++;
		}

		if(grid[i + 1]?.[j] === currentLetter) {
			if(!visited.includes(`${i + 1},${j}`)) toExplore.push([i + 1, j]);
		} else {
			perimeter++;
		}

		if(grid[i][j + 1] === currentLetter) {
			if(!visited.includes(`${i},${j + 1}`)) toExplore.push([i, j + 1]);
		} else {
			perimeter++;
		}

		if(grid[i][j - 1] === currentLetter) {
			if(!visited.includes(`${i},${j - 1}`)) toExplore.push([i, j - 1]);
		} else {
			perimeter++;
		}

		for(let next of toExplore) {
			[area, perimeter] = explore(...next, area, perimeter);
		}
		return [area, perimeter];
	}

	let areaSum = 0;
	for(let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid[i].length; j++) {
			if(visited.includes(`${i},${j}`)) continue;
			let [area, perimeter] = explore(i, j);
			areaSum += area * perimeter;

		}
	}

	displayCaption(`The area sum is ${areaSum}.`);
}