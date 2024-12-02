"use strict";

function day02(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let reports = [];
	while(entry = FILE_REGEX.exec(input)) {
		let levels = entry[0].split(' ').map(e => +e);
		reports.push(levels);
	}

	let totalSafe = reports.reduce(function(acc, val) {
		let isUp = val[1] - val[0] > 0;
		for(let i = 1; i < val.length; i++) {
			let diff = val[i] - val[i - 1];
			if((diff > 0) !== isUp) {
				return acc;
			}
			if(Math.abs(diff) > 3 || diff === 0) return acc;
		}
		return acc + 1;
	}, 0);

	displayCaption(`The total safe reports is ${totalSafe}.`);
}