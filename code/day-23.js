"use strict";

function day23(input) {
	const FILE_REGEX = /([a-z]{2})-([a-z]{2})/g;
	let entry;
	let pairs = [];
	while(entry = FILE_REGEX.exec(input)) {
		pairs.push([entry[1], entry[2]]);
	}

	function Computer(name) {
		this.name = name;
		this.connections = [];
	}

	let computers = [];
	function findComputer(name) {
		for(let com of computers) {
			if(com.name === name) return com;
		}
	}

	for(let pair of pairs) {
		if(!findComputer(pair[0])) {
			computers.push(new Computer(pair[0]));
		}
		if(!findComputer(pair[1])) {
			computers.push(new Computer(pair[1]));
		}
	}

	for(let pair of pairs) {
		let c1 = findComputer(pair[0]);
		let c2 = findComputer(pair[1]);
		c1.connections.push(c2);
		c2.connections.push(c1);
	}

	let tTrios = [];
	for(let computer of computers) {
		if(!computer.name.startsWith("t")) continue;
		for(let i = 0; i < computer.connections.length; i++) {
			for(let j = i + 1; j < computer.connections.length; j++) {
				let comp1 = computer.connections[i];
				let comp2 = computer.connections[j];
				if(comp1.connections.includes(comp2)) {
					let mapKey = [computer.name, comp1.name, comp2.name];
					mapKey.sort();
					mapKey = mapKey.join(",");
					if(!tTrios.includes(mapKey)) tTrios.push(mapKey);
				}
			}
		}
	}

	displayCaption(`The number of parties is ${tTrios.length}.`);
}