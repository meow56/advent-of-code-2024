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

	let p2Files = files.map((num, index) => [num, index]);

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
				display += `(${files[backIndex]})`;
				if(currentPos % 20 === 19) display += '\n';
				currentPos++;
				backIndex--;
				if(frontIndex > backIndex) break;
			}
			if(frontIndex > backIndex) break;
			lastNum = files[frontIndex];
		}
		display += `(${files[frontIndex]})`;
		if(currentPos % 20 === 19) display += '\n';
		checksum += currentPos * files[frontIndex];
		currentPos++;
	}

	let defrag = freeSpace.map(e => []);
	for(let bIndex = p2Files.length - 1; bIndex >= 0; bIndex--) {
		for(let i = 0; i < p2Files[bIndex][1]; i++) {
			if(freeSpace[i] >= p2Files[bIndex][0]) {
				defrag[i].push(p2Files[bIndex].slice());
				freeSpace[i] -= p2Files[bIndex][0];
				p2Files[bIndex][1] = 0;
				break;
			}
		}
	}

	let checksum2 = 0;
	freeIndex = 0;
	currentPos = 0;
	let display2 = '';
	for(let frontIndex = 0; frontIndex < p2Files.length; frontIndex++) {
		// 00.11 -> position 0-1 are 0, 3-4 are 1
		// so 0 = 0 * (0 + 1)
		// 1 = 1 * (3 + 4)
		// ie checksum += num * ((((currentPos + count - 1) * (currentPos + count)) - ((currentPos - 1) * currentPos))) / 2
		// ((((currentPos + count - 1) * (currentPos + count)) - ((currentPos - 1) * currentPos)))
		// (2countcurrentPos + count2 - count)
		// count * (2 * currentPos + count - 1)
		// so checksum += num * (count * (2 * currentPos + count - 1)) / 2;

		// I foolishly used num in the calcs above even though
		// by previous naming it should be index.
		let num = p2Files[frontIndex][1];
		let count = p2Files[frontIndex][0];
		checksum2 += num * count * (2 * currentPos + count - 1) / 2;
		if(num === 0 && currentPos !== 0) {
			display2 += '.'.repeat(count);
		} else {
			display2 += (`(${num})`).repeat(count);
		}
		if(Math.floor(currentPos / 20) !== Math.floor((currentPos + count) / 20)) {
			display2 += '\n';
		}
		currentPos += count;

		// That deals with the forward files, now for the empty space.
		if(frontIndex !== p2Files.length - 1) {
			for(let file of defrag[frontIndex]) {
				let num = file[1];
				let count = file[0];
				checksum2 += num * count * (2 * currentPos + count - 1) / 2;
				display2 += (`(${num})`).repeat(count);
				if(Math.floor(currentPos / 20) !== Math.floor((currentPos + count) / 20)) {
					display2 += '\n';
				}
				currentPos += count;
			}
			display2 += ".".repeat(freeSpace[frontIndex]);
			if(Math.floor(currentPos / 20) !== Math.floor((currentPos + freeSpace[frontIndex]) / 20)) {
				display2 += '\n';
			}
			currentPos += freeSpace[frontIndex];
		}
	}

	assignPane("p1", "Part 1");
	assignPane("p2", "Part 2");

	displayCaption(`The checksum is ${checksum}.`);
	displayCaption(`The checksum without file fragmentation is ${checksum2}.`);
	displayCaption(`The compacted file system is shown.`);
	displayCaption(`Switch between parts 1 and 2 to see the two different parts.`);
	displayToPane("p1", display);
	displayToPane("p2", display2);
}