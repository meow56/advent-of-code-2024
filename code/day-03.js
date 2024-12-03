"use strict";

function day03(input) {
	const FILE_REGEX = /(?:mul\((\d+),(\d+)\))|do\(\)|don't\(\)/g;
	let entry;
	let sum1 = 0;
	let sum2 = 0;
	let enabled = true;
	while(entry = FILE_REGEX.exec(input)) {
		if(entry[0].startsWith('mul')) {
			let product = +entry[1] * +entry[2];
			sum1 += product;
			if(enabled) sum2 += product;
		} else {
			enabled = !entry[0].startsWith("don't");
		}
	}

	function replaceMul(match, offset, string, groups) {
		while(offset >= 0) {
			offset--;
			if(string.slice(offset).startsWith(`do()`)) {
				return `<span class='skyblue'>${match}</span>`;
			} else if(string.slice(offset).startsWith(`don't()`)) {
				return `<span class='lightblue'>${match}</span>`;
			}
		}
		return `<span class='skyblue'>${match}</span>`;
	}

	let newInput = input.replaceAll('<', '&lt;')
						.replaceAll('>', '&gt;')
						.replace(/mul\(\d+,\d+\)/g, replaceMul)
						.replace(/do\(\)/g, `<span class='green'>$&</span>`)
						.replace(/don't\(\)/g, `<span class='red'>$&</span>`);
	displayText(newInput);

	displayCaption(`The sum is ${sum1}.`);
	displayCaption(`The sum with do() and don't() is ${sum2}.`);
	displayCaption(`The "code" is shown.`);
	displayCaption(`Valid mul() calls are shown highlighted blue. The lighter shade of blue is for mul() calls that are disabled by don't().`);
	displayCaption(`do() calls are highlighted in green, while don't() calls are highlighted in red.`);
}