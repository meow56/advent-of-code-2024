"use strict";

function day02(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let reports = [];
	while(entry = FILE_REGEX.exec(input)) {
		let levels = entry[0].split(' ').map(e => +e);
		reports.push(levels);
	}

	let fails = [];
	let totalSafe = reports.reduce(function(acc, val) {
		let isUp = val[1] - val[0] > 0;
		let thisFails = [];
		for(let i = 1; i < val.length; i++) {
			let diff = val[i] - val[i - 1];
			if((diff > 0) !== isUp || Math.abs(diff) > 3 || diff === 0) {
				thisFails.push(i);
			}
		}
		fails.push(thisFails);
		if(thisFails.length > 0) return acc;
		return acc + 1;
	}, 0);

	let goodRemoves = [];
	let totalSafe2 = reports.reduce(function(acc, val) {
		for(let remove = 0; remove < val.length; remove++) {
			let newVal = [...val.slice(0, remove), ...val.slice(remove + 1)];
			let isUp = newVal[1] - newVal[0] > 0;
			let valid = true;
			for(let i = 1; i < newVal.length; i++) {
				let diff = newVal[i] - newVal[i - 1];
				if((diff > 0) !== isUp || Math.abs(diff) > 3 || diff === 0) {
					valid = false;
				}
			}
			if(valid) {
				goodRemoves.push(remove);
				return acc + 1;
			}
		}
		goodRemoves.push(-1);
		return acc;
	}, 0);

	displayCaption(`The total safe reports is ${totalSafe}.`);
	displayCaption(`The actual total safe reports is ${totalSafe2}.`);
	displayCaption(`The reports are shown.`);
	displayCaption(`Reports with a number highlighted yellow are safe with the Problem Dampener.`);
	displayCaption(`Reports with numbers highlighted red aren't safe, even with the Problem Dampener.`);
	displayCaption(`Reports without any numbers highlighted are always safe.`);
	displayCaption(`The highlighted numbers are either the one that gets removed (yellow) or the ones that cause problems (red).`);

	let stringReports = reports.map(e => e.map(val => val.toString().padStart(2)));
	
	function displayStuff(i) {
		if(i >= stringReports.length) return;
		if(fails[i].length === 0) {
			// Valid without removals.
		} else if(goodRemoves[i] !== -1) {
			// Valid with a removal.
			// Removal highlighted yellow.
			stringReports[i][goodRemoves[i]] = `<span class='yellow'>${stringReports[i][goodRemoves[i]]}</span>`;
		} else {
			// Invalid.
			// All invalid entries highlighted red.
			for(let fail of fails[i]) {
				stringReports[i][fail] = `<span class='red'>${stringReports[i][fail]}</span>`;
			}
		}
		displayText(`Report ${(i + 1).toString().padStart(4)}: ${stringReports[i].join(' ')}`);

		setTimeout(displayStuff, 0, i + 1);
	}

	displayStuff(0);
}