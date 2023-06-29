/**
 * @fileoverview Worms game.
 * @version 0.1.0
 * Requires "triangles.js" and "worms.js"
 */

const colors = chromatomeColors("verena");
let grid = [];
const used = {};
let side = 20;
let running = false;
let worms = [];
let activeWorm = null;
let wormsAliveToEnd = 0;
let round = -1;
let roundWorms = [];
let showConfigPanel = false;
let modal = null;

function setup() {
	createCanvas(windowWidth - 10, windowHeight - 10);
	background("white");
	stroke("black");
	strokeWeight(4);
	[grid, side] = triGridBG(10, true);
	frameRate(12);
	// noLoop();
	worms.push(new Worm(0, 2, grid, used, colors.next()));
	worms.push(new Worm(1, 2, grid, used, colors.next()));
	if (worms.length > 1) {
		wormsAliveToEnd = 1;
	}
}

function nextRound() {
	if (worms.length <= wormsAliveToEnd) {
		textSize(32);
		const message =
			wormsAliveToEnd === 0 ? "Game Over" : "Winner is Worm #" + worms[0].index;
		text(message, width / 2, height / 2);
		console.log(message);
		noLoop();
	} else {
		round += 1;
		console.log("round", round);
		roundWorms = [...worms];
		activeWorm = roundWorms.shift();
		console.log(`Round ${round}: activeWorm #${activeWorm.index}`);
	}
}

function draw() {
	if (showConfigPanel) {
		if (!modal) {
			modal = new ConfigPanel(toggleConfigPanel);
		}
		modal.draw();
		return;
	}
	if (!activeWorm) {
		nextRound();
	}
	if (activeWorm) {
		const status = activeWorm.draw();
		if (status === "dead") {
			worms = worms.filter((w) => w !== activeWorm);
			roundWorms = roundWorms.filter((w) => w !== activeWorm);

			activeWorm = roundWorms.shift();
		} else if (status === "trained") {
			activeWorm = roundWorms.shift();
		}
		if (!activeWorm) {
			console.log(`Round ${round} complete`);
		} else {
			console.log(`Round ${round}: activeWorm #${activeWorm?.index}`);
		}
	}
	stroke("black");
	strokeWeight(4);
	drawGrid(grid);
	if (activeWorm) {
		activeWorm.drawCursor();
	}
}

function keyPressed(keyEvent) {
	const { code } = keyEvent;
	switch (code) {
		case "Space":
			toggleRunning();
			break;
		case "ArrowRight":
			if (activeWorm) {
				activeWorm.rotate(1);
			}
			break;
		case "ArrowLeft":
			if (activeWorm) {
				activeWorm.rotate(-1);
			}
			break;
		case "Enter":
			if (activeWorm) {
				activeWorm.learnPath();
			}
			break;

		case "Digit1":
			if (activeWorm) {
				activeWorm.x = 0;
				activeWorm.y = 0;
			}
			break;

		case "Digit2":
			if (activeWorm) {
				activeWorm.x = grid[0].length - 1;
				activeWorm.y = 0;
			}
			break;

		case "Digit3":
			if (activeWorm) {
				activeWorm.x = grid[0].length - 1;
				activeWorm.y = grid.length - 1;
			}
			break;

		case "Digit4":
			if (activeWorm) {
				activeWorm.x = 0;
				activeWorm.y = grid.length - 1;
			}
			break;

		case "Digit5":
			if (activeWorm) {
				activeWorm.x = Math.floor(grid[0].length / 2);
				activeWorm.y = Math.floor(grid.length / 2);
			}
			break;

		case "Escape":
			toggleConfigPanel();
			break;

		default:
			console.log("keyEvent", code);
			break;
	}
}

function toggleConfigPanel() {
	showConfigPanel = !showConfigPanel;
}

function toggleRunning() {
	if (!running) {
		running = true;
		loop();
	} else {
		running = false;
		noLoop();
	}
}
