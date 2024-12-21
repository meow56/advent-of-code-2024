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
		let pos = arrowKeys.get("A").slice();
		let seq = "";
		for(let char of code) {
			let target = arrowKeys.get(char);
			let xDiff = target[0] - pos[0];
			let yDiff = target[1] - pos[1];
			let xChar = xDiff < 0 ? "<" : ">";
			let yChar = yDiff < 0 ? "^" : "v";
			if(yChar === "v") {
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

	function escape(text) {
		text = text.replaceAll("<", "&lt;");
		text = text.replaceAll(">", "&gt;");
		return text;
	}

	let complexitySum = 0;
	for(let code of codes) {
		let result = inputToArrowKeys(inputToArrowKeys(codeToNumpadInput(code)));
		displayText(code);
		displayText(escape(codeToNumpadInput(code)));
		displayText(escape(inputToArrowKeys(codeToNumpadInput(code))));
		displayText(escape(result));
		console.log(result, parseInt(code, 10), inputToArrowKeys(codeToNumpadInput(code)));
		complexitySum += result.length * parseInt(code, 10);
	}

	displayCaption(`The complexity sum is ${complexitySum}.`);
}