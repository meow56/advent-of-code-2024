"use strict";

function day09(input) {
	const FILE_REGEX = /./g;
	let entry;
	let files = [];
	let freeSpace = [];
	let isFile = true;
	while(entry = FILE_REGEX.exec(input)) {
		if(isFile) {
			files.push(+(entry[0]));
		} else {
			freeSpace.push(+(entry[0]));
		}
		isFile = !isFile;
	}

	files = files.flatMap((num, index) => (new Array(num)).fill(index));
	let checksum = 0;
	let backIndex = files.length - 1;
	let lastNum = 0;
	let freeIndex = 0;
	let currentPos = 0;
	let display = '';
	for(let frontIndex = 0; frontIndex < backIndex; frontIndex++) {
		if(files[frontIndex] !== lastNum) {
			// Fill in empties first.
			let empties = freeSpace[freeIndex++];
			for(let i = 0; i < empties; i++) {
				checksum += currentPos * files[backIndex];
				display += files[backIndex];
				currentPos++;
				backIndex--;
				if(frontIndex > backIndex) break;
			}
			if(frontIndex > backIndex) break;
			lastNum = files[frontIndex];
		}
		display += files[frontIndex];
		checksum += currentPos * files[frontIndex];
		currentPos++;
	}

	displayCaption(`The checksum is ${checksum}.`);
	displayText(display);
}