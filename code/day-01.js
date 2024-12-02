"use strict";

function day01(input) {
	const FILE_REGEX = /(\d+)   (\d+)/g;
	let entry;
	let list1 = [];
	let list2 = [];
	while(entry = FILE_REGEX.exec(input)) {
		list1.push(+(entry[1]));
		list2.push(+(entry[2]));
	}

	list1.sort((a, b) => a - b);
	list2.sort((a, b) => a - b);

	let totalDist = 0;
	let indivDists = [];
	for(let i = 0; i < list1.length; i++) {
		totalDist += Math.abs(list1[i] - list2[i]);
		indivDists.push(Math.abs(list1[i] - list2[i]));
	}

	let counts = new Map();

	for(let num of list2) {
		if(counts.has(num)) {
			counts.set(num, counts.get(num) + 1);
		} else {
			counts.set(num, 1);
		}
	}

	let simScore = 0;
	let indivScores = [];
	for(let num of list1) {
		if(counts.has(num)) {
			let thisScore = counts.get(num) * num;
			simScore += thisScore;
			indivScores.push(thisScore);
		} else {
			indivScores.push(0);
		}
	}

	displayCaption(`The total distance is ${totalDist}.`);
	displayCaption(`The similarity score is ${simScore}.`);
	displayCaption(`The sorted list of numbers is shown with the distance between each pair in between.`);
	displayCaption(`On the similarity score pane is where the similarity score for each number on the left is shown.`);

	assignPane(`dist`, `Distances`);
	assignPane(`sim`, `Similarity Scores`);

	displayToPane(`dist`, `List 1	Dist	List 2`);
	for(let i = 0; i < indivDists.length; i++) {
		displayToPane(`dist`, `${list1[i]}	${indivDists[i]}	${list2[i]}`);
	}

	displayToPane(`sim`, `List 1	Similarity Score`);
	for(let i = 0; i < indivDists.length; i++) {
		displayToPane(`sim`, `${list1[i]}	${indivScores[i]}`);
	}
}