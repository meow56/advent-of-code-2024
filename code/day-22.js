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
	let diffMap = new Map();
	for(let num of numbers) {
		let thisDiffMap = new Map();
		let last4Diff = [];
		let prevNum = num % 10n;
		for(let i = 0; i < 2000; i++) {
			num = generate(num);
			last4Diff.push(num % 10n - prevNum);
			if(last4Diff.length === 4) {
				let mapKey = last4Diff.join(",");
				if(!thisDiffMap.has(mapKey)) {
					thisDiffMap.set(mapKey, num % 10n);
				}
				last4Diff.shift();
			}
			prevNum = num % 10n;
		}
		sum += num;

		for(let [key, value] of thisDiffMap.entries()) {
			diffMap.set(key, (diffMap.get(key) ?? 0n) + value);
		}
	}

	let maxBananas = 0;
	for(let val of diffMap.values()) {
		if(val > maxBananas) maxBananas = val;
	}

	displayCaption(`The sum of secret numbers is ${sum}.`);
	displayCaption(`The most number of bananas you can get is ${maxBananas}.`);
}