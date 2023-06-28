const pallette1 = ["#F1B68A", "#B5B48F", "#BB9967", "#B1D588", "#797533"];

const pallette2 = ["#E6D3A3", "#D98142", "#78C9CD", "#BB9967"];

let pallette = pallette2;

class RingStack {
	constructor(series) {
		this.series = series;
		this.index = 0;
	}

	next() {
		const val = this.series[this.index];
		this.reset(this.index + 1);
		return val;
	}

	reset(ix = 0) {
		this.index = ix % this.series.length;
	}
}

function centeredBox(size, c) {
	stroke(c);
	fill(c);

	rect(-size / 2, -size / 2, size, size);
}

function centerDiamond(pos, size, pixelSize, pal, stepMax = 100) {
	let p = pal.next();
	if (pos[0]) {
		translate(pos[0], pos[1]);
	}
	stroke(p);
	fill(p);
	const pX = pixelSize[0];
	const pY = pixelSize[1];
	let [x, y] = size;
	const steps = Math.ceil(size[0] / pixelSize[0]);
	let height = pY;
	let width = x;
	for (let i = 0; i < steps; i++) {
		rect(-width / 2, -height / 2, width, height);
		height += pY;
		width -= pX;
	}
	let inner = [x - pX * 2, y - pY * 1.5];
	if (inner[0] > 0 && stepMax > -1) {
		centerDiamond([0, 0], inner, pixelSize, pal, stepMax - 1);
	}
	if (stepMax === 0) {
		p = pal.next();
		stroke(p);
		fill(p);
		const cX = x - pX * 4;
		const cY = y - pY * 8;
		rect(-cX / 2, -pY / 6, cX, pY / 3);
		rect(-pX / 6, -cY / 2, pX / 3, cY);
	}
	if (pos[0]) {
		translate(-pos[0], -pos[1]);
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	colorMode(RGB, 100);
	fill("#966");
	rect(0, 0, windowWidth, windowHeight);
	let colorIndex = 0;
	let size = [130, 90];
	let pixel = [15, 10];
	const delta = (p) => [size[0] / 2 + p[0], size[1] / 2 + p[1]];

	const fullPallette = [];
	pallette.forEach((color) => {
		fullPallette.push(color);
		fullPallette.push("#fff");
	});
	const pal = new RingStack(fullPallette);
	let pos = [0, 0];
	const rows = Math.floor(windowHeight / size[1]);
	const cols = Math.floor(windowWidth / size[0]);
	for (let row = 0; row < rows; row++) {
		pos[1] = row * size[1];
		for (let col = 0; col < cols; col++) {
			pal.reset(row);
			pos[0] = col * size[0];
			centerDiamond(delta(pos), size, pixel, pal, 2);
			// console.log(`pos now ${JSON.stringify(pos)}`);
		}
	}
}
