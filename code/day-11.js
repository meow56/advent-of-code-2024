"use strict";

function day11(input) {
	const FILE_REGEX = /\d+/g;
	let entry;
	let stones = [];
	while(entry = FILE_REGEX.exec(input)) {
		stones.push(+(entry[0]));
	}

	for(let i = 0; i < 25; i++) {
		stones = stones.flatMap(function(stone) {
			if(stone === 0) return [1];
			if(stone.toString().length % 2 === 0) {
				let strStone = stone.toString();
				let s1 = strStone.slice(0, strStone.length / 2);
				let s2 = strStone.slice(strStone.length / 2);
				return [+s1, +s2];
			}
			return [stone * 2024];
		});
	}

	displayCaption(`The number of stones after 25 iterations is ${stones.length}.`);
}