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

	let unsorted1 = list1.slice();
	let unsorted2 = list2.slice();

	list1.sort((a, b) => b - a);
	list2.sort((a, b) => b - a);

	let totalDist = 0;
	for(let i = 0; i < list1.length; i++) {
		totalDist += Math.abs(list1[i] - list2[i]);
	}

	let counts = new Map();

	for(let i = 0; i < unsorted2.length; i++) {
		if(counts.has(unsorted2[i])) {
			counts.set(unsorted2[i], counts.get(unsorted2[i]) + 1);
		} else {
			counts.set(unsorted2[i], 1);
		}
	}

	let simScore = 0;
	for(let i = 0; i < unsorted1.length; i++) {
		if(counts.has(unsorted1[i])) {
			simScore += counts.get(unsorted1[i]) * unsorted1[i];
		}
	}

	displayCaption(`The total distance is ${totalDist}.`);
	displayCaption(`The similarity score is ${simScore}.`);
}