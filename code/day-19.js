"use strict";

function day19(input) {
	const TOWEL_PATTERN = /(?:[a-z]+, )(?:[a-z]+,? ?)+/g;
	let entry;
	let towels;
	while(entry = TOWEL_PATTERN.exec(input)) {
		towels = entry[0].split(", ");
	}

	const PATTERN_PATTERN = /^[a-z]+$/gm;
	let patterns = [];
	while(entry = PATTERN_PATTERN.exec(input)) {
		patterns.push(entry[0]);
	}

	function findPattern(pattern) {
		if(pattern.length === 0) return true;
		for(let match of towels) {
			if(pattern.startsWith(match)) {
				if(findPattern(pattern.replace(match, ""))) return true;
			}
		}
		return false;
	}

	let possible = 0;
	let possiblePatterns = [];
	for(let pattern of patterns) {
		let result = findPattern(pattern);
		if(result) {
			possible++;
			possiblePatterns.push(pattern);
		}
	}

	let patternMap = new Map([["", 1]]);
	function numSeqs(pattern) {
		if(patternMap.has(pattern)) return patternMap.get(pattern);
		if(pattern.length === 1) {
			patternMap.set(pattern, +(towels.includes(pattern)));
			return +(towels.includes(pattern));
		}
		let possible = 0;
		for(let i = 1; i <= pattern.length; i++) {
			let start = pattern.slice(0, i);
			let rest = pattern.slice(i);
			possible += patternMap.get(rest) * +(towels.includes(start));
		}
		patternMap.set(pattern, possible);
		return possible;
	}

	let sequences = 0;
	for(let pattern of possiblePatterns) {
		for(let i = 1; i < pattern.length; i++) {
			numSeqs(pattern.slice(-i));
		}
		sequences += numSeqs(pattern);
	}

	displayCaption(`The number of possible patterns is ${possible}.`);
	displayCaption(`The number of different ways to make each design is ${sequences}.`);
}