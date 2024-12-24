"use strict";

function day24(input) {
	const INPUT_REGEX = /([a-z0-9]+): (0|1)/g;
	let entry;
	let inputs = [];
	while(entry = INPUT_REGEX.exec(input)) {
		inputs.push([entry[1], entry[2] === "1"]);
	}

	let gates = [];
	const GATE_REGEX = /([a-z0-9]+) (AND|OR|XOR) ([a-z0-9]+) -> ([a-z0-9]+)/g;
	while(entry = GATE_REGEX.exec(input)) {
		gates.push([entry[4], entry[1], entry[2], entry[3]]);
	}

	let trueInputs = new Map(inputs);
	while(gates.length !== 0) {
		let next = gates.shift();
		if(trueInputs.has(next[1]) && trueInputs.has(next[3])) {
			if(next[2] === "AND") {
				trueInputs.set(next[0], trueInputs.get(next[1]) && trueInputs.get(next[3]));
			} else if(next[2] === "OR") {
				trueInputs.set(next[0], trueInputs.get(next[1]) || trueInputs.get(next[3]));
			} else {
				trueInputs.set(next[0], (trueInputs.get(next[1]) || trueInputs.get(next[3])) && !(trueInputs.get(next[1]) && trueInputs.get(next[3])));
			}
		} else {
			gates.push(next);
		}
	}

	let z = [];
	for(let [key, value] of trueInputs.entries()) {
		if(key[0] === "z") {
			z[parseInt(key.slice(1), 10)] = value ? "1" : "0";
		}
	}

	displayCaption(`The number is ${parseInt(z.toReversed().join(""), 2)}.`);
}