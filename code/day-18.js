"use strict";

function day18(input) {
	const FILE_REGEX = /(\d+),(\d+)/g;
	let entry;
	let corrupt = [];
	while(entry = FILE_REGEX.exec(input)) {
		corrupt.push([+entry[1], +entry[2]]);
	}

	let nodes = [];
	function Node(pos) {
		this.pos = pos;
		this.corruptsAt = 0;
		this.neighbors = [];
		this.dist = -1;
	}

	function findNode(pos) {
		for(let node of nodes) {
			if(node.pos[0] === pos[0] && node.pos[1] === pos[1]) return node;
		}
	}

	function vAdd(a, b) {
		return [a[0] + b[0], a[1] + b[1]];
	}

	const UP = [0, -1];
	const RIGHT = [1, 0];
	const DOWN = [0, 1];
	const LEFT = [-1, 0];
	Node.prototype.initNeighbors = function() {
		let uNeigh = findNode(vAdd(this.pos, UP));
		let rNeigh = findNode(vAdd(this.pos, RIGHT));
		let dNeigh = findNode(vAdd(this.pos, DOWN));
		let lNeigh = findNode(vAdd(this.pos, LEFT));
		if(uNeigh) this.neighbors.push(uNeigh);
		if(rNeigh) this.neighbors.push(rNeigh);
		if(dNeigh) this.neighbors.push(dNeigh);
		if(lNeigh) this.neighbors.push(lNeigh);
	}

	for(let i = 0; i <= 70; i++) {
		for(let j = 0; j <= 70; j++) {
			nodes.push(new Node([j, i]));
		}
	}

	for(let node of nodes) {
		node.initNeighbors();
	}

	for(let i = 0; i < corrupt.length; i++) {
		findNode(corrupt[i]).corruptsAt = i + 1;
	}

	function BFS(time) {
		for(let node of nodes) {
			node.dist = -1;
			node.pre = undefined;
		}
		let explored = [];
		let toExplore = [findNode([0, 0])];
		findNode([0, 0]).dist = 0;
		while(toExplore.length !== 0) {
			let next = toExplore.shift();
			explored.push(next.pos.join(","));
			for(let neighbor of next.neighbors) {
				if(neighbor.dist === -1) {
					if(neighbor.corruptsAt > 0 && neighbor.corruptsAt <= time) continue;
					neighbor.dist = next.dist + 1;
					neighbor.pre = next;
					toExplore.push(neighbor);
				}
			}
		}
	}

	BFS(1024);
	displayCaption(`The distance to the exit is ${findNode([70, 70]).dist}.`);

	let prePath = genPrePath();
	function genPrePath() {
		let prePath = [];
		let curr = findNode([70, 70]);
		let start = findNode([0, 0]);
		while(curr !== start) {
			prePath.unshift(curr);
			curr = curr.pre;
		}
		return prePath;
	}

	let minTime = 0;
	for(let i = 1024; i < corrupt.length; i++) {
		let newCorrupt = findNode(corrupt[i]);
		if(prePath.includes(newCorrupt)) {
			BFS(i + 1);
			if(findNode([70, 70]).dist === -1) {
				minTime = i + 1;
				break;
			}
			prePath = genPrePath();
		}
	}

	displayCaption(`The first cutoff time is ${corrupt[minTime - 1]}.`);
}