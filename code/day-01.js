"use strict";

function day01(input) {
	const FILE_REGEX = /(\d+)   (\d+)/g;
	let entry;
	let list1 = [];
	let list2 = [];
	while(entry = FILE_REGEX.exec(input)) {
		list1.push(+(entry[1]));
		list2.push(+(entry[2]));
	}

	list1.sort((a, b) => b - a);
	list2.sort((a, b) => b - a);

	let totalDist = 0;
	for(let i = 0; i < list1.length; i++) {
		totalDist += Math.abs(list1[i] - list2[i]);
	}

	displayCaption(`The total distance is ${totalDist}.`);
}