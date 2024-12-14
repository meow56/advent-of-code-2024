"use strict";

function day13(input) {
	const FILE_REGEX = /(?:Button (A|B): X\+(\d+), Y\+(\d+))|(?:Prize: X=(\d+), Y=(\d+))/g;
	let entry;
	let machines = [];
	let machine = [];
	let newMachines = [];
	let newMachine = [];
	while(entry = FILE_REGEX.exec(input)) {
		if(entry[1]) {
			machine.push([entry[1], +entry[2], +entry[3]]);
			newMachine.push([entry[1], +entry[2], +entry[3]]);
		} else {
			machine.push([+entry[4], +entry[5]]);
			newMachine.push([10000000000000 + +entry[4], 10000000000000 + +entry[5]]);
			machines.push(machine);
			newMachines.push(newMachine);
			machine = [];
			newMachine = [];
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
	}

	let newTokens = 0;
	for(let machine of newMachines) {
		// aA + bB = X
		// @A + eB = Y
		// @A + (b@/a)B = (@/a)X
		// (e - b@/a)B = Y - (@/a)X
		// B = (aY - @X) / (ae - b@)
		// A = (X - bB) / a

		let B = ((machine[2][1] * machine[0][1]) - (machine[0][2] * machine[2][0])) / ((machine[1][2] * machine[0][1]) - (machine[1][1] * machine[0][2]));
		if(Math.floor(B) !== B) continue;

		let A = (machine[2][0] - (machine[1][1] * B)) / machine[0][1];
		if(Math.floor(A) !== A) continue;
		newTokens += 3 * A + B;
	}

	displayCaption(`The number of tokens to spend is ${tokens}.`);
	displayCaption(`The actual number of tokens you're getting scammed out of is ${newTokens}.`);
}