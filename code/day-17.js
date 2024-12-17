"use strict";

function day17(input) {
	const REG_REGEX = /Register (A|B|C): (\d+)/g;
	let entry;
	let regA;
	let regB;
	let regC;
	while(entry = REG_REGEX.exec(input)) {
		switch(entry[1]) {
		case "A":
			regA = +(entry[2]);
			break;
		case "B":
			regB = +(entry[2]);
			break;
		case "C":
			regC = +(entry[2]);
			break;
		}
	}

	let program;
	const PROGRAM_REGEX = /Program: ((?:\d+,?)+)/g;
	while(entry = PROGRAM_REGEX.exec(input)) {
		program = entry[1].split(",").map(e => +e);
	}

	function combo(val) {
		switch(val) {
		case 0:
		case 1:
		case 2:
		case 3:
			return val;
		case 4:
			return regA;
		case 5:
			return regB;
		case 6:
			return regC;
		case 7:
			throw "Invalid combo opcode";
		}
	}

	let PC = 0;
	let output = [];
	while(PC >= 0 && PC < program.length) {
		let opcode = program[PC];
		let operand = program[PC + 1];
		switch(opcode) {
		case 0:
			regA = Math.trunc(regA / (2 ** combo(operand)));
			console.log(`adv ${operand} => A = ${regA}`);
			break;
		case 1:
			regB ^= operand;
			console.log(`bxl ${operand} => B = ${regB}`);
			break;
		case 2:
			regB = combo(operand) % 8;
			console.log(`bst ${operand} => B = ${regB}`);
			break;
		case 3:
			if(regA !== 0) {
				PC = operand - 2;
			}
			console.log(`jnz ${operand} => PC = ${PC}`);
			break;
		case 4:
			regB ^= regC;
			console.log(`bxc ${operand} => B = ${regB}`);
			break;
		case 5:
			output.push(combo(operand) % 8);
			console.log(`out ${operand}`);
			break;
		case 6:
			regB = Math.trunc(regA / (2 ** combo(operand)));
			console.log(`bdv ${operand} => B = ${regB}`);
			break;
		case 7:
			regC = Math.trunc(regA / (2 ** combo(operand)));
			console.log(`cdv ${operand} => C = ${regC}`);
			break;
		}
		PC += 2;
	}

	displayCaption(`The program is trying to output "${output.join(",")}".`);
}