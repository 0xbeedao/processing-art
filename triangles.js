const PATH_NE = 0;
const PATH_E = 1;
const PATH_SE = 2;
const PATH_SW = 3;
const PATH_W = 4;
const PATH_NW = 5;

const PATHS = ["NE", "E", "SE", "SW", "W", "NW"];

function pathName(path) {
	return PATHS[path];
}

/**
 * Find the coordinates for the third point of a triangle.
 *
 * @param Ax - x coordinate value of first known point
 * @param Ay - y coordinate value of first known point
 * @param Cx - x coordinate value of second known point
 * @param Cy - y coordinate value of second known point
 * @param b - the length of side b
 * @param c - the length of side c
 * @param A - the angle of corner A
 * @param alt - set to true to return the alternative solution.
 * @returns {{Bx: *, By: *}}
 */
function getTriangle3rdPoint(Ax, Ay, Cx, Cy, b, c, A, alt) {
	var Bx;
	var By;
	alt = typeof alt === "undefined" ? false : alt;

	//unit vector
	uACx = (Cx - Ax) / b;
	uACy = (Cy - Ay) / b;

	if (alt) {
		//rotated vector
		uABx = uACx * Math.cos(toRadians(A)) - uACy * Math.sin(toRadians(A));
		uABy = uACx * Math.sin(toRadians(A)) + uACy * Math.cos(toRadians(A));

		//B position uses length of edge
		Bx = Ax + c * uABx;
		By = Ay + c * uABy;
	} else {
		//vector rotated into another direction
		uABx = uACx * Math.cos(toRadians(A)) + uACy * Math.sin(toRadians(A));
		uABy = -uACx * Math.sin(toRadians(A)) + uACy * Math.cos(toRadians(A));

		//second possible position
		Bx = Ax + c * uABx;
		By = Ay + c * uABy;
	}

	return [Bx, By];
}

/**
 * Convert degrees to radians.
 *
 * @param angle
 * @returns {number}
 */
function toRadians(angle) {
	return angle * (Math.PI / 180);
}

/**
 * get all 3 points of a triangle given point A, and a side length.
 */
function getEquilateralTrianglePoints(xa, ya, side, alt = false) {
	const xc = xa + side;
	const yc = ya;
	const [xb, yb] = getTriangle3rdPoint(xa, ya, xc, yc, side, side, 60, alt);
	return {
		a: [xa, ya],
		b: [xb, yb],
		c: [xc, yc],
	};
}

function equilateralTriangle(x, y, side, alt = false) {
	const { a, b, c } = getEquilateralTrianglePoints(x, y, side, alt);
	line(a[0], a[1], b[0], b[1]);
	line(a[0], a[1], c[0], c[1]);
	line(b[0], b[1], c[0], c[1]);
}

/**
 * gets the line points for the requested "path", which is an
 * index from 0 to 5, starting in the NE.
 */
function triGridEndpoint(x, y, side, path) {
	switch (path) {
		case PATH_NE:
			return getEquilateralTrianglePoints(x, y, side, false).b;
		case PATH_E:
			return [x + side, y];
		case PATH_SE:
			return getEquilateralTrianglePoints(x, y, side, true).b;
		case PATH_SW:
			return getEquilateralTrianglePoints(x, y, -1 * side, false).b;
		case PATH_W:
			return [x - side, y];
		case PATH_NW:
			return getEquilateralTrianglePoints(x, y, -1 * side, true).b;
		default:
			return [x, y];
	}
}

function triGridLine(x, y, side, path) {
	const [x2, y2] = triGridEndpoint(x, y, side, path);
	line(x, y, x2, y2);
	return [x2, y2];
}

function drawGrid(grid) {
	grid.forEach((row) => {
		row.forEach((cell) => {
			point(cell.x, cell.y);
		});
	});
}

/**
 * Draw a background
 * @param {number} count of triangles on a row
 * @param {boolean} offset - true to offset the grid by a half
 * @returns [{Array} of grid objects, length of side]
 */
function triGridBG(count, offset = false) {
	let x = 0;
	let y = 0;
	const grid = [];

	const finalCount = count % 2 === 0 ? count : count - 1;
	const side = Math.floor(width / finalCount);
	let nextPoint = triGridEndpoint(0, 0, side, 2);
	let row = [];
	let startX = 0;
	if (offset) {
		startX = side / 2;
		x += startX;
		y = nextPoint[1] / 2;
		nextPoint = triGridEndpoint(x, y, side, 2);
	}
	while (y <= height) {
		while (x <= width && row.length < finalCount) {
			row.push({
				x,
				y,
			});
			x += side;
		}
		grid.push(row);
		row = [];
		[x, y] = nextPoint;
		nextPoint = triGridEndpoint(
			grid.length % 2 === 0 ? startX : 0,
			y,
			side,
			PATH_SE
		);
	}
	// remove the last row if it is an odd number, since this will allow wrapping
	if (grid.length % 2 !== 0) {
		grid.pop();
	}
	drawGrid(grid);
	return [grid, side];
}

/**
 * Get the index of the requested path from the grid array, along with an indication of rollover.
 * @param x
 * @param y
 * @param path
 * @param grid
 * @returns {{x: number, y: number, rollX: boolean, rollY: boolean, value: {}}}
 */
function getTriGridIndex(x, y, path, grid) {
	const result = {
		x,
		y,
		rollX: false,
		rollY: false,
		value: {},
	};
	let x2 = x;
	let y2 = y;
	const isEven = y % 2 === 0;
	switch (path) {
		case PATH_NE:
			if (!isEven) {
				x2 += 1;
			}
			y2 -= 1;
			break;
		case PATH_E:
			x2 += 1;
			break;
		case PATH_SE:
			if (!isEven) {
				x2 += 1;
			}
			y2 += 1;
			break;
		case PATH_SW:
			if (isEven) {
				x2 -= 1;
			}
			y2 += 1;
			break;
		case PATH_W:
			x2 -= 1;
			break;
		case PATH_NW:
			if (isEven) {
				x2 -= 1;
			}
			y2 -= 1;
			break;
	}
	const maxX = grid[0].length;
	const maxY = grid.length;
	if (x2 < 0) {
		x2 = maxX - 1;
		result.rollX = true;
	} else if (x2 >= maxX) {
		x2 = 0;
		result.rollX = true;
	}
	if (y2 < 0) {
		y2 = maxY - 1;
		result.rollY = true;
	} else if (y2 >= maxY) {
		y2 = 0;
		result.rollY = true;
	}
	result.x = x2;
	result.y = y2;
	result.value = grid[y2][x2];
	return result;
}
