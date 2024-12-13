"use strict";

function day13(input) {
	const FILE_REGEX = /(?:Button (A|B): X\+(\d+), Y\+(\d+))|(?:Prize: X=(\d+), Y=(\d+))/g;
	let entry;
	let machines = [];
	let machine = [];
	while(entry = FILE_REGEX.exec(input)) {
		if(entry[1]) {
			machine.push([entry[1], +entry[2], +entry[3]]);
		} else {
			machine.push([+entry[4], +entry[5]]);
			machines.push(machine);
			machine = [];
		}
	}

	function gcf(a, b) {
		if(a === 0) return b;
		if(b === 0) return a;
		if(b > a) return gcf(b, a);

		while(a >= b) {
			a -= b;
		}
		return gcf(b, a);
	}

	let tokens = 0;
	for(let machine of machines) {
		let done = false;
		for(let a = 0; a <= 100; a++) {
			for(let b = 0; b <= 100; b++) {
				if(a * machine[0][1] + b * machine[1][1] === machine[2][0]
					&& a * machine[0][2] + b * machine[1][2] === machine[2][1]) {
					tokens += 3 * a + b;
					done = true;
					break;
				}
			}
			if(done) break;
		}
		continue;

		let xGCF = gcf(machine[0][1], machine[1][1]);
		let yGCF = gcf(machine[0][2], machine[1][2]);
		let xLCM = machine[0][1] * machine[1][1] / xGCF;
		let yLCM = machine[0][2] * machine[1][2] / yGCF;

		let xCycleCost = Math.min(xLCM * 3 / machine[0][1], xLCM / machine[1][1]);
		let yCycleCost = Math.min(yLCM * 3 / machine[0][2], yLCM / machine[1][2]);

		// let a, @ be x and y increase for A
		// let b, e be x and y increase for B
		// we want to minimize T = 3A + B
		// with the constraints
		// aA + bB = X
		// @A + eB = Y
		// (X - bB) / a = A
		// (3X + (a - 3b)B) / a = T
		// T' = (a - 3b) / a
		// = 0 when a = 3b and a !== 0
		// 

		// (Y - eB) / @ = A
		// (3Y + (@ - 3e)B) / @ = y
		// y' = (@ - 3e) / @
		// = 0 when @ = 3e and 


	}

	displayCaption(`The number of tokens to spend is ${tokens}.`);
}