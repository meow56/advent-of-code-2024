"use strict";

function day03(input) {
	const FILE_REGEX = /(?:mul\((\d+),(\d+)\))|do\(\)|don't\(\)/g;
	let entry;
	let sum1 = 0;
	let sum2 = 0;
	let enabled = true;
	while(entry = FILE_REGEX.exec(input)) {
		if(entry[0].startsWith('mul')) {
			let product = +entry[1] * +entry[2];
			sum1 += product;
			if(enabled) sum2 += product;
		} else {
			enabled = !entry[0].startsWith("don't");
		}
	}

	displayCaption(`The sum is ${sum1}.`);
	displayCaption(`The sum 2 is ${sum2}.`);
}