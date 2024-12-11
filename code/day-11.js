"use strict";

function day11(input) {
	const FILE_REGEX = /\d+/g;
	let entry;
	let stones = [];
	while(entry = FILE_REGEX.exec(input)) {
		stones.push(+(entry[0]));
	}


	let numToStones = new Map();
	function blinkCount(number, blinks) {
		if(blinks === 0) return 1;
		let mapKey = `${number},${blinks}`;
		if(numToStones.has(mapKey)) return numToStones.get(mapKey);
		let result;
		if(number === 0) {
			result = blinkCount(1, blinks - 1);
		} else if(number.toString().length % 2 === 0) {
			let strStone = number.toString();
			let s1 = strStone.slice(0, strStone.length / 2);
			let s2 = strStone.slice(strStone.length / 2);
			result = blinkCount(+s1, blinks - 1) + blinkCount(+s2, blinks - 1);
		} else {
			result = blinkCount(number * 2024, blinks - 1);
		}
		numToStones.set(mapKey, result);
		return result;
	}

	let len25 = 0;
	let len75 = 0;
	for(let stone of stones) {
		len25 += blinkCount(stone, 25);
		len75 += blinkCount(stone, 75);
	}

	displayCaption(`The number of stones after 25 iterations is ${len25}.`);
	displayCaption(`The number of stones after 75 iterations is ${len75}.`);
}