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

	let totalSafe2 = reports.reduce(function(acc, val) {
		for(let remove = 0; remove < val.length; remove++) {
			let newVal = [...val.slice(0, remove), ...val.slice(remove + 1)];
			let isUp = newVal[1] - newVal[0] > 0;
			let valid = true;
			for(let i = 1; i < newVal.length; i++) {
				let diff = newVal[i] - newVal[i - 1];
				if((diff > 0) !== isUp) {
					valid = false;
				}
				if(Math.abs(diff) > 3 || diff === 0) {
					valid = false;
				}
			}
			if(valid) return acc + 1;
		}
		return acc;
	}, 0);

	displayCaption(`The total safe reports is ${totalSafe}.`);
	displayCaption(`The actual total safe reports is ${totalSafe2}.`);
}