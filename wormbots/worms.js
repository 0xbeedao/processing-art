/**
 * @fileoverview Worms class for worm game.
 * @version 0.1.0
 * Requires "triangles.js"
 */

class Worm {
	constructor(index, wormCount, grid, used, color) {
		const maxX = grid[0].length;
		const maxY = grid.length;
		const x = Math.floor((maxX / (wormCount + 1)) * (index + 1));
		const y = Math.floor(maxY / 2);
		this.index = index;
		this.brain = {};
		this.grid = grid;
		this.used = used;
		this.x = x;
		this.y = y;
		this.possiblePath = -1;
		this.color = color;
		this.blink = 0;
	}

	addUsedPath(x, y, path) {
		const key = `${x},${y}`;
		const paths = this.getUsedPaths(x, y);
		paths.push(path);
		paths.sort();
		this.used[key] = paths;
		// console.log("used paths", JSON.stringify(this.used));
	}

	getUsedPaths(x, y) {
		const key = `${x},${y}`;
		if (!(key in this.used)) {
			this.used[key] = [];
		}
		return this.used[key];
	}

	getGridPosition() {
		return {
			...this.grid[this.y][this.x],
			used: this.getUsedPaths(this.x, this.y),
		};
	}

	getFreePaths() {
		const paths = [];
		const { used } = this.getGridPosition();
		for (let i = 0; i < 6; i += 1) {
			if (!used.includes(i)) {
				paths.push(i);
			}
		}
		return paths;
	}

	getStatus() {
		const paths = this.getFreePaths();
		if (paths.length === 0) {
			return { status: "dead" };
		}
		const key = paths.join(":");
		// if only one path is free, we can use it and it becomes the trained
		// response for this situation
		if (paths.length === 1) {
			this.brain[key] = paths[0];
		}
		if (key in this.brain) {
			const path = this.brain[key];
			return {
				status: "trained",
				path,
			};
		}
		return { status: "unknown" };
	}

	drawCursor() {
		const { x, y } = this.getGridPosition();
		push();
		stroke(this.color);
		strokeWeight(6);
		noFill();
		point(x, y);
		pop();
	}

	drawPath(path, remember = true) {
		const { x, y } = this.getGridPosition();
		// console.log(`Grid position: ${this.x},${this.y} -> ${x},${y}`);

		const {
			x: gridX,
			y: gridY,
			rollX,
			rollY,
		} = getTriGridIndex(this.x, this.y, path, this.grid);
		if (remember) {
			this.addUsedPath(this.x, this.y, path);
			this.addUsedPath(gridX, gridY, (path + 3) % 6);
		}
		const { x: x2, y: y2 } = this.grid[gridY][gridX];
		const sideX = this.grid[0][1].x - this.grid[0][0].x;
		stroke(this.color);
		if (rollX || rollY) {
			switch (path) {
				case PATH_E: {
					line(x, y, width, y2);
					line(0, y, x2, y2);
					break;
				}
				case PATH_W: {
					line(x, y, 0, y2);
					line(width, y, x2, y2);
					break;
				}
				case PATH_NE: {
					if (this.y === 0) {
						const { b } = getEquilateralTrianglePoints(x, y, sideX, false);
						line(x, y, x + sideX * 0.5, b[1]);
						const { b: b2 } = getEquilateralTrianglePoints(x2, y2, sideX, true);
						line(x, b2[1], x2, y2);
					} else {
						line(x, y, x + sideX * 0.5, y2);
						line(0, y, x2, y2);
					}
					break;
				}
				case PATH_NW: {
					if (this.y === 0) {
						const { b } = getEquilateralTrianglePoints(x, y, sideX, false);
						line(x, y, x - sideX * 0.5, b[1]);
						if (this.x === 0) {
							const { b: b2 } = getEquilateralTrianglePoints(
								x2,
								y2,
								sideX,
								true
							);
							line(x2 + sideX * 0.5, b2[1], x2, y2);
						} else {
							const { b: b3 } = getEquilateralTrianglePoints(
								x,
								y2,
								sideX,
								true
							);
							line(x, b3[1], x2, y2);
						}
					} else {
						line(x, y, 0, y2);
						line(x2 + sideX * 0.5, y, x2, y2);
					}
					break;
				}
				case PATH_SE: {
					if (this.y === this.grid.length - 1) {
						const { b } = getEquilateralTrianglePoints(x, y, sideX, true);
						line(x, y, x + sideX * 0.5, b[1]);
						if (this.x === this.grid[0].length - 1) {
							const { b: b2 } = getEquilateralTrianglePoints(
								x2,
								y2,
								sideX,
								false
							);
							line(x2 - sideX * 0.5, b2[1], x2, y2);
						} else {
							const { b: b3 } = getEquilateralTrianglePoints(
								x,
								y2,
								sideX,
								false
							);
							line(x, b3[1], x2, y2);
						}
					} else {
						line(x, y, x + sideX * 0.5, y2);
						line(0, y, x2, y2);
					}
					break;
				}
				case PATH_SW: {
					if (this.y === this.grid.length - 1) {
						const { b } = getEquilateralTrianglePoints(x, y, sideX, true);
						line(x, y, x - sideX * 0.5, b[1]);
						if (this.x === 0) {
							const { b: b2 } = getEquilateralTrianglePoints(
								x2,
								y2,
								sideX,
								false
							);
							line(x2 + sideX * 0.5, b2[1], x2, y2);
						} else {
							const { b: b3 } = getEquilateralTrianglePoints(
								x,
								y2,
								sideX,
								false
							);
							line(x, b3[1], x2, y2);
						}
					} else {
						line(x, y, 0, y2);
						line(x2 + sideX * 0.5, y, x2, y2);
					}
					break;
				}
			}
		} else {
			line(x, y, x2, y2);
		}
	}

	drawTrainPath() {
		const paths = this.getFreePaths();
		if (!paths.includes(this.possiblePath)) {
			this.possiblePath = paths[Math.floor(Math.random() * paths.length)];
		}
		// console.log("possiblePath", this.possiblePath, paths);
		this.blink = (this.blink + 1) % 10;
		if (this.blink > 7) {
			erase();
			strokeWeight(5);
		} else {
			strokeWeight(4);
			stroke(this.color);
		}
		this.drawPath(this.possiblePath, false);
		noErase();
	}

	draw() {
		const current = this.getStatus();
		switch (current.status) {
			case "dead":
				break;
			case "trained":
				strokeWeight(4);
				this.drawPath(current.path);
				this.updatePosition(current.path);
				break;
			default:
				// here we need help, so we should draw on a free line and blink
				this.drawTrainPath();
				break;
		}
		return current.status;
	}

	learnPath() {
		const paths = this.getFreePaths();
		const key = paths.join(":");
		this.brain[key] = this.possiblePath;
	}

	rotate(delta) {
		erase();
		push();
		strokeWeight(6);
		this.drawPath(this.possiblePath, false);
		pop();
		const paths = this.getFreePaths();
		if (paths.length === 0) {
			console.log("Worm has no free paths");
		} else if (paths.length === 1) {
			console.log("Worm has only one free path");
			this.possiblePath = paths[0];
		} else {
			let ix = paths.indexOf(this.possiblePath) + delta;
			if (ix < 0) {
				ix = paths.length + ix;
			} else {
				ix = ix % paths.length;
			}
			console.log(
				`new path ${pathName(paths[ix])} = ${paths[ix]} after rotation ${delta}`
			);
			this.blink = 0;
			this.possiblePath = paths[ix];
		}
	}

	updatePosition(path) {
		const { x, y } = getTriGridIndex(this.x, this.y, path, this.grid);
		this.x = x;
		this.y = y;
	}
}
