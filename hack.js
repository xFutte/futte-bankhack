// DOM elements
const body = document.querySelector('body');
const container = document.querySelector('.container');
const loadingHack = document.querySelector('.loading-hack');
const hack = document.querySelector('.hack');
const hackSuccess = document.querySelector('.hack-success');
const hackFailed = document.querySelector('.hack-failed');
const hackStageTwo = document.querySelector('.stage-2');
const hackStageThree = document.querySelector('.stage-3');
const override = document.querySelector('.loading-hack-override');
const timer = document.querySelector('.timer');
const overlay = document.querySelector('.overlay');

// Animation timers
const hackMessageTimer = 2000;
const hackFailedTimer = 1500;

// Constants to balance game
const requiredWins = 3;
const stagesRequired = 3;
const incorrectAnswerLimit = 2;
const gameLength = 4000;

let buttons = 30;
let displayHackSolutionTime = 800;
let difficulty = 8;
let correctAnswers = 0;
let incorrectAnswers = 0;
let gameComplete = false;
let winCount = 0;
let code = [];
let solution = [];
let progressbar;
let progressTimer;

// Icons that gets appended to buttons
let icons = [
	'bug',
	'network-wired',
	'qrcode',
	'rectangle-xmark',
	'code-fork',
	'diagram-project',
	'bug',
	'network-wired',
	'qrcode',
	'rectangle-xmark',
	'code-fork',
	'diagram-project',
	'bug',
	'network-wired',
	'qrcode',
	'rectangle-xmark',
	'code-fork',
	'diagram-project',
	'bug',
	'network-wired',
	'qrcode',
	'rectangle-xmark',
	'code-fork',
	'diagram-project',
	'network-wired',
	'qrcode',
	'rectangle-xmark',
	'code-fork',
	'diagram-project',
	'bug',
	'network-wired',
	'qrcode',
	'rectangle-xmark',
	'code-fork',
	'diagram-project',
];
/**
 * Randomize icons in icons array
 *
 * @returns list of random icons
 */
function scrambleIcons() {
	let currentIndex = icons.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[icons[currentIndex], icons[randomIndex]] = [
			icons[randomIndex],
			icons[currentIndex],
		];
	}

	return icons;
}

/**
 * Start game and setup next stage of the game
 */
function nextStage() {
	body.classList.remove('hidden');

	resetGame();

	// Starting hack
	if (winCount === 0) {
		playSound('gameStart', 1);
		document.querySelector('body').classList.remove('hidden');

		setTimeout(() => {
			loadingHack.classList.add('hidden');
			override.classList.remove('hidden');
		}, hackMessageTimer);

		setTimeout(() => {
			loadingHack.classList.add('hidden');
			override.classList.add('hidden');
			hack.classList.remove('hidden');
			generateGame();
			getNewCode();
			assignCorrectButtons();
			
			setTimeout(() => {
				drawTimer();
				startClock();
			}, displayHackSolutionTime);

		}, 5000);
	}

	if (winCount === 1) {
		hackStageTwo.classList.remove('hidden');
		hack.classList.add('hidden');

		setTimeout(() => {
			hackStageTwo.classList.add('hidden');
			generateGame();
			getNewCode();
			assignCorrectButtons();
			
			setTimeout(() => {
				drawTimer();
				startClock();
			}, displayHackSolutionTime);

			hack.classList.remove('hidden');
		}, hackMessageTimer);
	}

	if (winCount === 2) {
		hackStageThree.classList.remove('hidden');
		hack.classList.add('hidden');

		setTimeout(() => {
			hackStageThree.classList.add('hidden');
			generateGame();
			getNewCode();
			assignCorrectButtons();

			setTimeout(() => {
				drawTimer();
				startClock();
			}, displayHackSolutionTime);

			hack.classList.remove('hidden');
		}, hackMessageTimer);
	}
}

/**
 * Setups up the DOM for a new/next game
 *
 */
function generateGame() {
	icons = scrambleIcons();

	for (let index = 0; index < buttons; index++) {
		let button = document.createElement('div');
		let icon = document.createElement('i');

		icon.classList.add('fa-solid');
		icon.classList.add(`fa-${icons[index]}`);

		button.setAttribute('data-button', index + 1);
		button.classList.add('hack-button');
		button.appendChild(icon);

		hack.appendChild(button);
	}

	let countdown = document.createElement('div');

	countdown.setAttribute('width', container.clientWidth);
	countdown.classList.add('timer-counter');

	timer.appendChild(countdown);
}

/**
 * Generates a code of the length of 'difficulty' variable
 *
 */
function getNewCode() {
	code.push(getRandomNumber(1, 3));
	code.push(getRandomNumber(4, 7));
	code.push(getRandomNumber(8, 10));
	code.push(getRandomNumber(11, 14));
	code.push(getRandomNumber(15, 18));
	code.push(getRandomNumber(19, 22));
	code.push(getRandomNumber(23, 26));
	code.push(getRandomNumber(27, 30));
}

/**
 * Get random number between min & max
 *
 * @param {*} min minimum number
 * @param {*} max maximum number
 * @returns number between the range parsed
 */
function getRandomNumber(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Assigns the correct/incorrect buttons
 *
 */
function assignCorrectButtons() {
	const buttonList = document.querySelectorAll('[data-button]');

	// Add overlay to prevent clicking
	overlay.classList.remove('hidden');

	buttonList.forEach((button) => {
		if (code.includes(Number(button.attributes[0].nodeValue))) {
			button.classList.add('correct-answer');
			button.setAttribute('data-correct', 'correct');
			button.children[0].setAttribute('data-correct', 'correct');
		} else {
			button.setAttribute('data-correct', 'incorrect');
			button.children[0].setAttribute('data-correct', 'incorrect');
		}

		setTimeout(() => {
			button.classList.remove('correct-answer');

			// Remove overlay to enable clicking
			overlay.classList.add('hidden');
		}, displayHackSolutionTime);
	});
}

/**
 * Triggered everytime a stage has been completed.
 * Will determine whether the game is completed or if a new stage should be started
 *
 */
function stageCompleted(success) {
	if (success) {
		if (winCount === requiredWins) {
			// Send NUI callback
			setTimeout(function () {
				$.post(
					'https://fleeca_hack/callback',
					JSON.stringify({
						success: true,
					})
				);
			}, 2000);

			// Success sound
			playSound('gameSuccess', 1);

			// Reset the game for good measure
			resetGame();

			// Show "Hack complete" message
			hackSuccess.classList.toggle('hidden');
			hack.classList.toggle('hidden');

			winCount = 0;

			setTimeout(() => {
				body.classList.add('hidden');
				resetDOM();
			}, hackMessageTimer);

			return;
		} else {
			playSound('gameStageSuccess', 1);
			nextStage();

			return;
		}
	}

	if (!success) {
		resetGame();
		playSound('gameFailed', 1);

		setTimeout(function () {
			$.post(
				'https://fleeca_hack/callback',
				JSON.stringify({
					success: false,
				})
			);
		}, hackFailedTimer);

		// Hack failed message
		hack.classList.add('hidden');
		hackFailed.classList.remove('hidden');

		winCount = 0;

		setTimeout(() => {
			body.classList.add('hidden');
			resetDOM();
		}, hackFailedTimer);
	}
}

/**
 * Draw the progress bar
 */
function drawTimer() {
	progressbar = new ProgressBar.Line('.timer', {
		duration: gameLength,
		from: { color: '#00ce00' },
		to: { color: '#F32013' },
		step: (state, bar) => {
			bar.path.setAttribute('stroke', state.color);
		},
	});
	progressbar.timer;
	progressbar.animate(1);
}

/**
 * Countdown for each game
 */
function startClock() {
	progressTimer = setInterval(() => {
		stageCompleted(false);
	}, gameLength);
}

/**
 * Play sound before, after and between stage of the hack
 *
 * @param {*} sound id of the audio tag in the DOM
 * @param {*} vol volume (between 0 - 1)
 */
function playSound(sound, vol) {
	document.getElementById(sound).volume = vol;
	document.getElementById(sound).play();
}

/**
 * Reset the DOM back to the default value with hidden/shown elements
 *
 */
function resetDOM() {
	loadingHack.classList.remove('hidden');
	hackFailed.classList.add('hidden');
	hackSuccess.classList.add('hidden');
	hackStageTwo.classList.add('hidden');
	hackStageThree.classList.add('hidden');
	override.classList.add('hidden');
}

/**
 * Reset all variables to zero
 *
 */
function resetGame() {
	correctAnswers = 0;
	incorrectAnswers = 0;
	gameComp = false;
	code = [];
	solution = [];

	clearInterval(progressTimer);

	hack.innerHTML = '';
	timer.innerHTML = '';
}

hack.addEventListener('click', (event) => {
	const answer = event.target.attributes.getNamedItem('data-correct');

	document.querySelectorAll('[data-button]').forEach((button) => {
		button.classList.remove('correct-answer');
	});

	if (answer && answer.value === 'correct') {
		if (event.target.localName === 'i') {
			event.target.offsetParent.classList.add('correct');
		}

		event.target.classList.add('correct');
		event.target.removeAttribute('data-correct');
		correctAnswers++;

		if (correctAnswers === difficulty) {
			winCount++;

			stageCompleted(true);
		}
	} else {
		if (event.target.localName === 'i') {
			event.target.offsetParent.classList.add('incorrect');
		}
		event.target.classList.add('incorrect');
		event.target.removeAttribute('data-correct');

		incorrectAnswers++;
		if (incorrectAnswers == incorrectAnswerLimit) {
			stageCompleted(false);
		}
	}
});

window.addEventListener('message', function (event) {
	var item = event.data;

	if ('start' in item) {
		nextStage();
	}

	if ('show' in item) {
		document.querySelector('.container').classList.remove('hidden');
	}
});
