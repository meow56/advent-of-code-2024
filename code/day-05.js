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

	let ruleResults = new Map();
	function getRules(num) {
		if(ruleResults.has(num)) {
			return ruleResults.get(num);
		}
		let result1 = [];
		let result2 = [];
		for(let rule of rules) {
			if(rule[0] === num) result1.push(rule[1]);
			if(rule[1] === num) result2.push(rule[0]);
		}
		ruleResults.set(num, [result1, result2]);
		return [result1, result2];
	}

	let midSum = 0;
	let incorrect = [];
	let whichDisplay = [];
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
			whichDisplay.push(true);
		} else {
			incorrect.push(print);
			whichDisplay.push(false);
		}
	}

	let midSum2 = 0;
	let correct = [];
	for(let print of incorrect) {
		let correctlySorted = print.toSorted(function(a, b) {
			let [aAhead, aBehind] = getRules(a);
			let [bAhead, bBehind] = getRules(b);
			if(aAhead.includes(b) || bBehind.includes(a)) return -1;
			return 1;
		});
		correct.push(correctlySorted);
		midSum2 += correctlySorted[(correctlySorted.length - 1) / 2];
	}

	displayCaption(`The middle sum is ${midSum}.`);
	displayCaption(`The middle sum 2 is ${midSum2}.`);
	displayCaption(`The list of updates are shown.`);
	displayCaption(`The green highlighted lists are valid without modification.`);
	displayCaption(`The red lists are invalid. The following line in sky blue is the corrected version.`);
	displayCaption(`The numbers highlighted yellow are the middle numbers used for parts 1 and 2.`);

	let incorrectIndex = 0;
	for(let i = 0; i < prints.length; i++) {
		let print = prints[i];
		if(whichDisplay[i]) {
			// Correctly sorted.
			print[(print.length - 1) / 2] = `<span class='yellow'>${print[(print.length - 1) / 2]}</span>`;
			displayText(`<span class='green'>${print.join(", ")}</span>`);
		} else {
			// Not so correctly sorted.
			displayText(` XX <span class='red'>${print.join(", ")}</span>`);
			print = correct[incorrectIndex];
			print[(print.length - 1) / 2] = `<span class='yellow'>${print[(print.length - 1) / 2]}</span>`;
			displayText(` -> <span class='skyblue'>${print.join(", ")}</span>`);
			incorrectIndex++;
		}
	}
}