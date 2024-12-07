"use strict";

function day07(input) {
	const FILE_REGEX = /(\d+): ((?:\d+ ?)+)/g;
	let entry;
	let lines = [];
	while(entry = FILE_REGEX.exec(input)) {
		if(+entry[1] > Number.MAX_SAFE_INTEGER) console.log("SAD");
		lines.push([+entry[1], entry[2].split(" ").map(e => +e)]);
	}

	function recurse(target, nums, curr) {
		if(target < curr) return false;
		if(nums.length === 0) return target === curr;
		let newNums = nums.slice();
		let next = newNums.shift();
		return recurse(target, newNums, curr * next) || recurse(target, newNums, curr + next);
	}

	let sum = 0;
	for(let line of lines) {
		let newNums = line[1].slice();
		let next = newNums.shift();
		if(recurse(line[0], newNums, next)) sum += line[0];
	}

	displayCaption(`The sum is ${sum}.`);
}