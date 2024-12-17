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

	function cDisplay(val) {
		switch(val) {
		case 0:
		case 1:
		case 2:
		case 3:
			return val;
		case 4:
			return "regA";
		case 5:
			return "regB";
		case 6:
			return "regC";
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
			console.log(`adv ${cDisplay(operand)} => A = ${regA}`);
			break;
		case 1:
			regB ^= operand;
			console.log(`bxl ${operand} => B = ${regB}`);
			break;
		case 2:
			regB = combo(operand) % 8;
			console.log(`bst ${cDisplay(operand)} => B = ${regB}`);
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
			console.log(`out ${cDisplay(operand)}`);
			break;
		case 6:
			regB = Math.trunc(regA / (2 ** combo(operand)));
			console.log(`bdv ${cDisplay(operand)} => B = ${regB}`);
			break;
		case 7:
			regC = Math.trunc(regA / (2 ** combo(operand)));
			console.log(`cdv ${cDisplay(operand)} => C = ${regC}`);
			break;
		}
		PC += 2;
	}

	/**
		Program:
		2,4,  B = A % 8
		1,1,  B ^= 1  (flip bit 1)
		7,5,  C = A / (2 ^ B)
		0,3,  A /= 8
		1,4,  B ^= 4  (flip bit 3)
		4,5,  B ^= C
		5,5,  out regB
		3,0,  if(A !== 0) PC = 0

		do {
			B = A % 8;
		  B ^= 1;
		  C = (A / (2 ^ B)) % 8;
		  A /= 8;
		  B ^= 4;
		  B ^= C;
		  out.push(B);
		} while(A !== 0);

		16 iterations are required.
		So A >= 8 ^ 15
		A is a 16-octet number.
		56?? ???? ???? ????

		101110

		highest octet:
		we want to print 0.
		A = 5
		3
		A = 6
		5
		A = 
	*/

	function thing(A) {
		let B = A % 8;
		B ^= 1;
		let C = Math.trunc(A / (2 ** B)) % 8;
		A /= 8;
		B ^= 4;
		B ^= C;
		return B % 8;
	}

	function recursion(realA, program) {
		if(program.length === 0) return parseInt(realA.join(""), 8);
		let pCopy = program.slice();
		let target = pCopy.pop();

		let fakeA = parseInt(realA.join(""), 8);
		let results = [];
		for(let a = 0; a < 8; a++) {
			let fakerA = fakeA * 8 + a;
			if(thing(fakerA) === target) {
				results = results.concat(recursion([...realA, a], pCopy.slice()));
			}
		}

		return results;

	}

	let final = recursion([0], program);
	final.sort((a, b) => a - b);

	displayCaption(`The program is trying to output "${output.join(",")}".`);
	displayCaption(`Register A should be "${final[0]}".`);
}