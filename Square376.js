let colors;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colors = chromatoneColors();
}

function Square376A(x, y, span, pixel, bg, c1) {
	const half = span / 2;
	const hp = pixel / 2;
	const sp = span - hp;
	push();
	translate(x, y);
	noStroke();
	fill(c1);
	rect(0, 0, span, span);
	stroke(bg);
	strokeWeight(pixel);
	line(hp, 0, sp, 0);
	line(0, hp, 0, sp);
	const cut = (span - pixel) / 6;
	noStroke();
	rect(cut + hp, hp, cut, sp);
	rect(hp, cut + hp, sp, cut);
	fill(colors.background());
	triangle(cut + hp, hp, sp - cut, hp, span / 2, cut + hp);
	triangle(cut + hp, sp, sp - cut, sp, span / 2, sp - cut);
	triangle(hp, cut + hp, hp, sp - cut, cut + hp, span / 2);
	triangle(sp, cut + hp, sp, sp - cut, sp - cut, span / 2);
	rect(cut + hp, cut + hp, cut, cut);
	fill(colors.get(colors.index));
	beginShape();
	vertex(span / 2, cut + hp);
	vertex(sp - cut, span / 2);
	vertex(span / 2, sp - cut);
	vertex(cut + hp, span / 2);
	endShape(CLOSE);
	pop();
}

function draw() {
	const bg = colors.background();
	const colorA = colors.next();
	background(bg);

	const span = windowWidth / 10;
	strokeCap(SQUARE);
	const pixel = Math.floor(span / 7);
	for (let y = 0; y * span < windowHeight; y++) {
		for (let x = 0; x * span < windowWidth; x++) {
			Square376A(x * span, y * span, span, pixel, bg, colorA);
			fill(colors.next());
		}
	}
	noLoop();
}
