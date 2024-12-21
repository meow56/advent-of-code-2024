"use strict";

function day21(input) {
	const FILE_REGEX = /.+/g;
	let entry;
	let codes = [];
	while(entry = FILE_REGEX.exec(input)) {
		codes.push(entry[0]);
	}

	const numpad = new Map([
		["1", [0, 2]],
		["2", [1, 2]],
		["3", [2, 2]],
		["4", [0, 1]],
		["5", [1, 1]],
		["6", [2, 1]],
		["7", [0, 0]],
		["8", [1, 0]],
		["9", [2, 0]],
		["0", [1, 3]],
		["A", [2, 3]],
		]);
	function codeToNumpadInput(code) {
		let pos = numpad.get("A").slice();
		let seq = "";
		for(let char of code) {
			let target = numpad.get(char);
			let xDiff = target[0] - pos[0];
			let yDiff = target[1] - pos[1];
			let xChar = xDiff < 0 ? "<" : ">";
			let yChar = yDiff < 0 ? "^" : "v";
			if((pos[1] === 3 && target[0] === 0) || (xChar === ">" && !(pos[0] === 0 && target[1] === 3))) {
				seq += yChar.repeat(Math.abs(yDiff));
				seq += xChar.repeat(Math.abs(xDiff));
			} else {
				seq += xChar.repeat(Math.abs(xDiff));
				seq += yChar.repeat(Math.abs(yDiff));
			}
			seq += "A";
			pos = target.slice();
		}
		return seq;
	}

	const arrowKeys = new Map([
		["^", [1, 0]],
		["A", [2, 0]],
		["<", [0, 1]],
		["v", [1, 1]],
		[">", [2, 1]],
		]);
	function inputToArrowKeys(code) {
		let pos = arrowKeys.get(code[0]).slice();
		code = code.slice(1);
		let seq = "";
		for(let char of code) {
			let target = arrowKeys.get(char);
			let xDiff = target[0] - pos[0];
			let yDiff = target[1] - pos[1];
			let xChar = xDiff < 0 ? "<" : ">";
			let yChar = yDiff < 0 ? "^" : "v";
			if((xChar === ">" && !(target[1] === 0 && pos[0] === 0)) || (target[0] === 0 && pos[1] === 0)) {
				seq += yChar.repeat(Math.abs(yDiff));
				seq += xChar.repeat(Math.abs(xDiff));
			} else {
				seq += xChar.repeat(Math.abs(xDiff));
				seq += yChar.repeat(Math.abs(yDiff));
			}
			seq += "A";
			pos = target.slice();
		}
		return seq;
	}

	function getASeqs(code) {
		let arraySeqs = code.split("A").slice(0, -1);
		let retVal = new Map();
		for(let seq of arraySeqs) {
			retVal.set(seq, (retVal.get(seq) ?? 0) + 1);
		}
		return retVal;
	}

	function escape(text) {
		text = text.replaceAll("<", "&lt;");
		text = text.replaceAll(">", "&gt;");
		return text;
	}

	function getLength(m) {
		return [...m.entries()].reduce((acc, val) => acc + (val[0].length + 1) * val[1], 0);
	}

	let complexitySum = 0;
	let complexitySum25 = 0;
	let aSeqToArrowKeys = new Map([["", new Map([["", 1]])]]);
	for(let code of codes) {
		let result = getASeqs(codeToNumpadInput(code));
		for(let i = 0; i < 25; i++) {
			let newResult = new Map();
			for(let [key, value] of result.entries()) {
				let trans = aSeqToArrowKeys.get(key) ?? getASeqs(inputToArrowKeys("A" + key + "A"));
				aSeqToArrowKeys.set(key, trans);
				for(let [pair, mult] of trans.entries()) {
					newResult.set(pair, (newResult.get(pair) ?? 0) + (value * mult));
				}
			}
			result = newResult;
			if(i === 1) complexitySum += getLength(result) * parseInt(code, 10);
		}
		complexitySum25 += getLength(result) * parseInt(code, 10);
	}

	displayCaption(`The complexity sum is ${complexitySum}.`);
	displayCaption(`The complexity sum 25 is ${complexitySum25}.`);
}