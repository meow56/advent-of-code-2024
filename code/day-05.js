"use strict";

function day05(input) {
	const FILE_REGEX = /(\d+)\|(\d+)/g;
	let entry;
	let rules = [];
	while(entry = FILE_REGEX.exec(input)) {
		rules.push([+entry[1], +entry[2]]);
	}

	const PRINTS_REGEX = /(?:\d+,)+(?:\d+)/g;
	let prints = [];
	while(entry = PRINTS_REGEX.exec(input)) {
		prints.push(entry[0].split(',').map(e => +e));
	}

	function getRules(num) {
		let result1 = [];
		let result2 = [];
		for(let rule of rules) {
			if(rule[0] === num) result1.push(rule[1]);
			if(rule[1] === num) result2.push(rule[0]);
		}
		return [result1, result2];
	}

	let midSum = 0;
	for(let print of prints) {
		let valid = true;
		for(let i = 0; i < print.length; i++) {
			let currNum = print[i];
			let [ahead, behind] = getRules(currNum);
			for(let j = i + 1; j < print.length; j++) {
				if(behind.includes(print[j])) {
					valid = false;
					break;
				}
			}
			if(!valid) break;
			for(let j = i - 1; j >= 0; j--) {
				if(ahead.includes(print[j])) {
					valid = false;
					break;
				}
			}
			if(!valid) break;
		}
		if(valid) {
			midSum += print[(print.length - 1) / 2];
		}
	}

	displayCaption(`The middle sum is ${midSum}.`);
}