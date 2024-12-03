"use strict";

function day03(input) {
	const FILE_REGEX = /mul\((\d+),(\d+)\)/g;
	let entry;
	let sum = 0;
	while(entry = FILE_REGEX.exec(input)) {
		sum += +entry[1] * +entry[2];
	}

	displayCaption(`The sum is ${sum}.`);
}