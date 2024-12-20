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

	let towelMap = new Map();
	for(let towel of towels) {
		if(towelMap.has(towel[0])) {
			towelMap.get(towel[0]).push(towel);
		} else {
			towelMap.set(towel[0], [towel]);
		}
	}

	function findPattern(pattern) {
		if(pattern.length === 0) return true;
		for(let match of towelMap.get(pattern[0])) {
			if(pattern.startsWith(match)) {
				if(findPattern(pattern.replace(match, ""))) return true;
			}
		}
		return false;
	}

	let possible = 0;
	for(let pattern of patterns) {
		possible += findPattern(pattern);
	}

	displayCaption(`The number of possible patterns is ${possible}.`);
}