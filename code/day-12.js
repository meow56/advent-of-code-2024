"use strict";

function day12(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let grid = [];
	while(entry = FILE_REGEX.exec(input)) {
		grid.push(entry[0].split(""));
	}

	let visited = [];
	function explore(i, j, area = 0, perimeter = 0, sides = []) {
		if(visited.includes(`${i},${j}`)) return [area, perimeter, sides];
		let currentLetter = grid[i][j];
		area++;
		visited.push(`${i},${j}`);
		let toExplore = [];
		if(grid[i - 1]?.[j] === currentLetter) {
			if(!visited.includes(`${i - 1},${j}`)) toExplore.push([i - 1, j]);
		} else {
			perimeter++;
			sides.push(["U", i - 1, j]);
		}

		if(grid[i + 1]?.[j] === currentLetter) {
			if(!visited.includes(`${i + 1},${j}`)) toExplore.push([i + 1, j]);
		} else {
			perimeter++;
			sides.push(["D", i, j]);
		}

		if(grid[i][j + 1] === currentLetter) {
			if(!visited.includes(`${i},${j + 1}`)) toExplore.push([i, j + 1]);
		} else {
			perimeter++;
			sides.push(["R", i, j]);
		}

		if(grid[i][j - 1] === currentLetter) {
			if(!visited.includes(`${i},${j - 1}`)) toExplore.push([i, j - 1]);
		} else {
			perimeter++;
			sides.push(["L", i, j - 1]);
		}

		for(let next of toExplore) {
			[area, perimeter, sides] = explore(...next, area, perimeter, sides);
		}
		return [area, perimeter, sides];
	}

	function mergeSides(sides) {
		sides.sort(function(a, b) {
			if(a[0] !== b[0]) return a[0].charCodeAt(0) - b[0].charCodeAt(0);
			if(a[0] === "U" || a[0] === "D") {
				if(a[1] !== b[1]) return a[1] - b[1];
				return a[2] - b[2];
			}

			if(a[2] !== b[2]) return a[2] - b[2];
			return a[1] - b[1];
		});
		let mergedSides = [];
		let currentSide = sides[0].slice();
		if(currentSide[0] === "U" || currentSide[0] === "D") {
			currentSide = [currentSide[0], [currentSide[2], currentSide[2]], currentSide[1]];
		} else {
			currentSide = [currentSide[0], [currentSide[1], currentSide[1]], currentSide[2]];
		}
		for(let i = 1; i < sides.length; i++) {
			let side = sides[i];
			if(side[0] !== currentSide[0]) {
				mergedSides.push(currentSide);
				currentSide = side.slice();
				if(currentSide[0] === "U" || currentSide[0] === "D") {
					currentSide = [currentSide[0], [currentSide[2], currentSide[2]], currentSide[1]];
				} else {
					currentSide = [currentSide[0], [currentSide[1], currentSide[1]], currentSide[2]];
				}
			} else {
				if(side[0] === "U" || side[0] === "D") {
					if(currentSide[2] !== side[1]) {
						mergedSides.push(currentSide);
						currentSide = [side[0], [side[2], side[2]], side[1]];
					} else if(currentSide[1][1] + 1 !== side[2]) {
						mergedSides.push(currentSide);
						currentSide = [side[0], [side[2], side[2]], side[1]];
					} else {
						currentSide[1][1]++;
					}
				} else {
					if(currentSide[2] !== side[2]) {
						mergedSides.push(currentSide);
						currentSide = [side[0], [side[1], side[1]], side[2]];
					} else if(currentSide[1][1] + 1 !== side[1]) {
						mergedSides.push(currentSide);
						currentSide = [side[0], [side[1], side[1]], side[2]];
					} else {
						currentSide[1][1]++;
					}
				}
			}
		}

		mergedSides.push(currentSide);

		return mergedSides;
	}

	let fenceCost = 0;
	let bulkCost = 0;
	for(let i = 0; i < grid.length; i++) {
		for(let j = 0; j < grid[i].length; j++) {
			if(visited.includes(`${i},${j}`)) continue;
			let [area, perimeter, sides] = explore(i, j);
			sides = mergeSides(sides);
			fenceCost += area * perimeter;
			bulkCost += area * sides.length;
		}
	}

	displayCaption(`The cost of the fence is ${fenceCost}.`);
	displayCaption(`The discounted cost of the fence is ${bulkCost}.`);
}