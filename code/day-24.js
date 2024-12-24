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
	let startGates = gates.slice();

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

	/** It's time to recall how adders work...
	 * Good thing I had to take that one class...
	 * 
	 * Ignoring carry for a second we have 2 inputs and 2 outputs.
	 * X and Y are XORed to get the Z output.
	 * X and Y are ANDed to get the carry output.
	 * 
	 * With carry we have 3 inputs and 2 outputs.
	 * X and Y and carry are XORed to get the Z output.
	 * This will be split into (X XOR Y) XOR carry.
	 * X and Y and carry -- at least 2 must be true for carry out to be true.
	 * It looks like it's doing ((X XOR Y) AND carry) OR (X AND Y).
	 * 
	 * So then we have the following gates:
	 * X XOR Y: the "bit adder."
	 * X AND Y: the "overflow."
	 * (bit adder) XOR carry: the "output."
	 * (bit adder) AND carry: the "carry."
	 * (carry) OR (overflow): the "true carry."
	 * ^ (this (carry) means the result of (bit adder) AND carry)
	 * The carry in of an adder is the "true carry" of the previous.
	 */
	let lOutputs = [];
	let lCarrys = [];
	let lOverflow = [];
	let lBitAdders = [];
	let lTrueCarrys = [];

	let rOutputs = [];
	let rOverflowsAndCarrys = [];
	let rBitAddersAndTrueCarrys = [];
	for(let gate of startGates) {
		if(gate[1].startsWith("x") || gate[3].startsWith("x")) {
			if(gate[2] === "AND") {
				if(gate[1].endsWith("00")) {
					lTrueCarrys.push(gate.slice());
				} else {
					lOverflow.push(gate.slice());
				}
			} else {
				if(gate[1].endsWith("00")) {
					lOutputs.push(gate.slice());
				} else {
					lBitAdders.push(gate.slice());
				}
			}
		} else {
			if(gate[2] === "AND") {
				lCarrys.push(gate.slice());
			} else if(gate[2] === "OR") {
				lTrueCarrys.push(gate.slice());
			} else {
				lOutputs.push(gate.slice());
			}
		}

		if(gate[0].startsWith("z")) {
			if(gate[0].endsWith("45")) {
				rBitAddersAndTrueCarrys.push(gate.slice());
			} else {
				rOutputs.push(gate.slice());
			}
		} else {
			let usage = [];
			for(let gate2 of startGates) {
				if(gate2[1] === gate[0] || gate2[3] === gate[0]) {
					usage.push(gate2[2]);
				}
			}
			if(usage.length === 1) {
				rOverflowsAndCarrys.push(gate.slice());
			} else if(usage.length === 2) {
				rBitAddersAndTrueCarrys.push(gate.slice());
			} else {
				throw `Too many usages for ${gate}: ${usage.join(";")}`;
			}
		}
	}

	function exists(out, array) {
		for(let gate of array) {
			if(gate[0] === out) return gate;
		}
	}

	function stringGate(gate) {
		return `${gate[1]} ${gate[2]} ${gate[3]} -> ${gate[0]}`;
	}

	let erroneous = [];

	for(let gate of lOutputs) {
		if(!exists(gate[0], rOutputs)) {
			erroneous.push(gate[0]);
			displayText(`TypeError: Expected right side of ${stringGate(gate)} to be output, but it isn't.`);
		}
	}

	for(let gate of lCarrys) {
		if(!exists(gate[0], rOverflowsAndCarrys)) {
			erroneous.push(gate[0]);
			displayText(`TypeError: Expected right side of ${stringGate(gate)} to be carry, but it isn't.`);
		}
	}

	for(let gate of lOverflow) {
		if(!exists(gate[0], rOverflowsAndCarrys)) {
			erroneous.push(gate[0]);
			displayText(`TypeError: Expected right side of ${stringGate(gate)} to be overflow, but it isn't.`);
		}
	}

	for(let gate of lBitAdders) {
		if(!exists(gate[0], rBitAddersAndTrueCarrys)) {
			erroneous.push(gate[0]);
			displayText(`TypeError: Expected right side of ${stringGate(gate)} to be bit adder, but it isn't.`);
		}
	}

	for(let gate of lTrueCarrys) {
		if(!exists(gate[0], rBitAddersAndTrueCarrys)) {
			erroneous.push(gate[0]);
			displayText(`TypeError: Expected right side of ${stringGate(gate)} to be true carry, but it isn't.`);
		}
	}

	displayCaption(`The number is ${parseInt(z.toReversed().join(""), 2)}.`);
	displayCaption(`The wrong gate outputs are "${erroneous.toSorted().join(",")}".`);
	displayCaption(`A list of "TypeError"s are shown.`);
	displayCaption(`Each one specifies a gate whose input and output are at odds with each other.`);
	displayCaption(`It specifies what type it was expecting the output to be.`);
}