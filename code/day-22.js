"use strict";

function day22(input) {
	const FILE_REGEX = /(\d+)/g;
	let entry;
	let numbers = [];
	while(entry = FILE_REGEX.exec(input)) {
		numbers.push(BigInt(+entry[0]));
	}

	function mixPrune(val, num) {
		let xor = val ^ num;
		return xor % 16777216n;
	}

	function generate(num) {
		num = mixPrune(num << 6n, num);
		num = mixPrune(num >> 5n, num);
		num = mixPrune(num << 11n, num);
		return num;
	}

	let sum = 0n;
	for(let num of numbers) {
		for(let i = 0; i < 2000; i++) {
			num = generate(num);
		}
		sum += num;
	}

	displayCaption(`The sum of secret numbers is ${sum}.`);
}