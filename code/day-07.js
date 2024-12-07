"use strict";

function day07(input) {
	const FILE_REGEX = /(\d+): ((?:\d+ ?)+)/g;
	let entry;
	let lines = [];
	while(entry = FILE_REGEX.exec(input)) {
		if(+entry[1] > Number.MAX_SAFE_INTEGER) console.log("SAD");
		lines.push([+entry[1], entry[2].split(" ").map(e => +e)]);
	}

	function recurse(target, nums, curr, operators = []) {
		if(target < curr) return false;
		if(nums.length === 0) return target === curr ? operators : false;
		let newNums = nums.slice();
		let next = newNums.shift();
		return recurse(target, newNums, curr * next, [...operators, "*"])
		 || recurse(target, newNums, curr + next, [...operators, "+"]);
	}

	function recurse2(target, nums, curr, operators = []) {
		if(target < curr) return false;
		if(nums.length === 0) return target === curr ? operators : false;
		let newNums = nums.slice();
		let next = newNums.shift();
		return recurse2(target, newNums, curr * next, [...operators, "*"])
		 || recurse2(target, newNums, +(curr.toString() + next.toString()), [...operators, "||"])
		 || recurse2(target, newNums, curr + next, [...operators, "+"]);
	}


	function disp(line, operators) {
		let displayLine = `${line[0]} ===`;
		let numbers = line[1].slice();
		let ops = operators.slice();
		while(numbers.length > 0) {
			displayLine += ` ${numbers.shift()}`;
			if(ops.length > 0) {
				displayLine += ` ${ops.shift()}`;
			}
		}

		displayText(displayLine);
	}

	let sum = 0;
	let sum2 = 0;
	for(let line of lines) {
		let newNums = line[1].slice();
		let next = newNums.shift();
		let result = recurse(line[0], newNums, next);
		if(result) {
			sum += line[0];
			sum2 += line[0];
			disp(line, result);
		} else {
			let result2 = recurse2(line[0], newNums, next);
			if(recurse2(line[0], newNums, next)) {
				sum2 += line[0];
				disp(line, result2);
			} else {
				displayText(`${line[0]} !== ${line[1].join(" ")}`)
			}
		}
	}

	displayCaption(`The sum is ${sum}.`);
	displayCaption(`The sum with concatenation is ${sum2}.`);
	displayCaption(`The equations are shown.`);
	displayCaption(`If it says [number] === [equation], then it's a valid equation.`);
	displayCaption(`It prioritizes using an equation without concatenation.`);
	displayCaption(`Otherwise, it'll say !==, in which case there is no valid equation.`);
}