"use strict";

function day10(input) {
	const FILE_REGEX = /./g;
	let entry;
	let nodes = [];
	const ROW_LENGTH = input.split('\n')[0].length;
	const COL_LENGTH = input.trim().split('\n').length;
	while(entry = FILE_REGEX.exec(input)) {
		nodes.push(new MyNode(+(entry[0]), [nodes.length % ROW_LENGTH, Math.floor(nodes.length / ROW_LENGTH)]));
	}

	for(let node of nodes) {
		node.initNeighbors();
	}

	function getNode(position) {
		for(let node of nodes) {
			if(node.pos[0] === position[0] && node.pos[1] === position[1]) {
				return node;
			}
		}
	}

	function MyNode(elevation, position) {
		this.height = elevation;
		this.pos = position;
		this.neighbors = [];
		this.depth = Number.MAX_SAFE_INTEGER;
		this.parent;
		this.color = 0; // 0: White, 1: Grey, 2: Black

		this.onPath = false;

		this.initNeighbors = function() {
			if(this.pos[0] !== ROW_LENGTH - 1) {
				let neighbor = getNode([this.pos[0] + 1, this.pos[1]]);
				if(neighbor === undefined) console.log("a");
				if(neighbor.height === this.height + 1) {
					this.neighbors.push(neighbor);
				}
			}
			if(this.pos[0] !== 0) {
				let neighbor = getNode([this.pos[0] - 1, this.pos[1]]);
				if(neighbor === undefined) console.log("b");
				if(neighbor.height === this.height + 1) {
					this.neighbors.push(neighbor);
				}
			}
			if(this.pos[1] !== COL_LENGTH - 1) {
				let neighbor = getNode([this.pos[0], this.pos[1] + 1]);
				if(neighbor === undefined) console.log(`lf ${this.pos[0]}, ${this.pos[1] + 1}`);
				if(neighbor.height === this.height + 1) {
					this.neighbors.push(neighbor);
				}
			}
			if(this.pos[1] !== 0) {
				let neighbor = getNode([this.pos[0], this.pos[1] - 1]);
				if(neighbor === undefined) console.log("d");
				if(neighbor.height === this.height + 1) {
					this.neighbors.push(neighbor);
				}
			}
		}
	}

	function resetNodes(start) {
		for(let node of nodes) {
			node.depth = Number.MAX_SAFE_INTEGER;
			node.color = 0;
			node.parent = undefined;
			node.onPath = false;
		}
		start.depth = 0;
	}

	// Time to plagiarize from my...wait wrong year.
	function search(start) {
		resetNodes(start);
		let queue = [start];
		let reachable9s = 0;
		while(queue.length !== 0) {
			let nextNode = queue.shift();
			if(nextNode.height === 9) reachable9s++;
			for(let neighbor of nextNode.neighbors) {
				if(neighbor.color === 0) {
					neighbor.color = 1;
					neighbor.depth = nextNode.depth + 1;
					neighbor.parent = nextNode;
					queue.push(neighbor);
				}
			}
			nextNode.color = 2;
		}
		return reachable9s;
	}

	function pathfind(start) {
		if(start.height === 9) return 1;
		let ratings = 0;
		for(let neighbor of start.neighbors) {
			ratings += pathfind(neighbor);
		}
		return ratings;
	}

	let sum = 0;
	let totalRatings = 0;
	for(let node of nodes) {
		if(node.height === 0) {
			sum += search(node);
			totalRatings += pathfind(node);
		}

	}

	displayCaption(`The sum of scores is ${sum}.`);
	displayCaption(`The sum of ratings is ${totalRatings}.`);
}