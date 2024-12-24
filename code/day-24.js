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
	let outputs = [];
	let carrys = [];
	let overflow = [];
	let bitAdders = [[]];
	let trueCarrys = [];
	for(let gate of startGates) {
		if(gate[0].startsWith("z")) {
			outputs[parseInt(gate[0].slice(1), 10)] = gate.slice();
		} else if(gate[1].startsWith("x") || gate[3].startsWith("x")) {
			if(gate[2] === "AND") {
				overflow[parseInt(gate[1].slice(1), 10)] = gate.slice();
			} else {
				bitAdders[parseInt(gate[1].slice(1), 10)] = gate.slice();
			}
		} else {
			if(gate[2] === "AND") {
				carrys.push(gate.slice());
			} else if(gate[2] === "OR") {
				trueCarrys.push(gate.slice());
			}
		}
	}

	function exists(out, array) {
		for(let gate of array) {
			if(gate[0] === out) return gate;
		}
	}

	for(let gate of outputs) {
		let in1 = gate[1];
		let in2 = gate[3];
		if(!exists(in1, bitAdders) && !exists(in2, bitAdders)) {
			displayText(`${gate[0]} doesn't have a bit adder, weird.`);
		} else if(exists(in1, bitAdders)) {
			let result = exists(in1, bitAdders);
			if(parseInt(result[1].slice(1), 10) !== parseInt(gate[0].slice(1), 10)) {
				displayText(`${gate[0]} has the wrong bit adder.`);
			}
		} else {
			let result = exists(in2, bitAdders);
			if(parseInt(result[1].slice(1), 10) !== parseInt(gate[0].slice(1), 10)) {
				displayText(`${gate[0]} has the wrong bit adder.`);
			}
		}
	}

	// kth <-> z12?
	// gsd <-> z26?
	// vpm <-> qnf?
	// tbt <-> z32?
	let kth = exists("kth", startGates);
	let z12 = exists("z12", startGates);
	let gsd = exists("gsd", startGates);
	let z26 = exists("z26", startGates);
	let vpm = exists("vpm", startGates);
	let qnf = exists("qnf", startGates);
	kth[0] = "z12";
	z12[0] = "kth";
	gsd[0] = "z26";
	z26[0] = "gsd";
	vpm[0] = "qnf";
	qnf[0] = "vpm";


	function quoteAddUnquote(x, y) {
		let trueInputs = new Map();
		let xBin = decToBin(x).toReversed();
		let yBin = decToBin(y).toReversed();
		for(let i = 0; i < 45; i++) {
			let padI = (i.toString()).padStart(2, "0");
			trueInputs.set(`x${padI}`, xBin[i] ?? 0);
			trueInputs.set(`y${padI}`, yBin[i] ?? 0);
		}
		let gates = startGates.slice();
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

		return z;
	}

	function decToBin(num) {
		let start = 0;
		while(2 ** (start + 1) < num) {
			start++;
		}

		let result = [];
		for(; start >= 0; start--) {
			if(num >= 2 ** start) {
				result.push(1);
				num -= 2 ** start;
			} else {
				result.push(0);
			}
		}

		return result;
	}

	console.log(quoteAddUnquote(125223423342, 252424023423).toReversed().join(""));
	console.log(decToBin(125223423342 + 252424023423).join("").padStart(46, "0"));

	displayCaption(`The number is ${parseInt(z.toReversed().join(""), 2)}.`);
}