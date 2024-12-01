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

	let unsorted1 = list1.slice();
	let unsorted2 = list2.slice();

	list1.sort((a, b) => a - b);
	list2.sort((a, b) => a - b);

	let totalDist = 0;
	let indivDists = [];
	for(let i = 0; i < list1.length; i++) {
		totalDist += Math.abs(list1[i] - list2[i]);
		indivDists.push(Math.abs(list1[i] - list2[i]));
	}

	let counts = new Map();

	for(let i = 0; i < unsorted2.length; i++) {
		if(counts.has(unsorted2[i])) {
			counts.set(unsorted2[i], counts.get(unsorted2[i]) + 1);
		} else {
			counts.set(unsorted2[i], 1);
		}
	}

	let simScore = 0;
	let indivScores = [];
	for(let i = 0; i < unsorted1.length; i++) {
		if(counts.has(unsorted1[i])) {
			simScore += counts.get(unsorted1[i]) * unsorted1[i];
			indivScores.push(counts.get(unsorted1[i]) * unsorted1[i]);
		} else {
			indivScores.push(0);
		}
	}

	displayCaption(`The total distance is ${totalDist}.`);
	displayCaption(`The similarity score is ${simScore}.`);
	displayCaption(`The sorted list of numbers is shown with the distance between each pair in between.`);
	displayCaption(`Click the button to switch to part 2, where the similarity score for each number on the left is shown.`);

	const DIST_PRE = assignBlock(`dist`);
	const SIM_PRE = assignBlock(`sim`);

	function toggleClosure() {
		let isDist = true;

		function toggle() {
			isDist = !isDist;
			if(isDist) {
				DIST_PRE.displayText(`List 1	Dist	List 2`);
				for(let i = 0; i < indivDists.length; i++) {
					DIST_PRE.displayText(`${list1[i]}	${indivDists[i]}	${list2[i]}`);
				}
				SIM_PRE.clearText();
			} else {
				SIM_PRE.displayText(`Left List	Similarity Score`)
				for(let i = 0; i < indivDists.length; i++) {
					SIM_PRE.displayText(`${unsorted1[i]}		${indivScores[i]}`);
				}
				DIST_PRE.clearText();
			}
		}

		return toggle;
	}

	let toggle = toggleClosure();

	const TOGGLE_BUTTON = assignButton(toggle, `Switch Part`);

	DIST_PRE.displayText(`List 1	Dist	List 2`);
	for(let i = 0; i < indivDists.length; i++) {
		DIST_PRE.displayText(`${list1[i]}	${indivDists[i]}	${list2[i]}`);
	}
	SIM_PRE.clearText();
}