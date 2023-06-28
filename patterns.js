function CenterDiamond(pos, size, pixelSize, pal, stepMax = 100) {
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

function FourCorners(span) {
	push();
	strokeCap(ROUND);
	const weight = span * 0.033;
	strokeWeight(weight);
	const width = (span - weight * 1.2) / 2;
	const offset = span / 6.66;
	line(-width, offset, -width, width);
	line(width, offset, width, width);
	line(-width, -offset, -width, -width);
	line(width, -offset, width, -width);

	line(-offset, width, -width, width);
	line(offset, width, width, width);
	line(-offset, -width, -width, -width);
	line(offset, -width, width, -width);
	pop();
}

function MultiTooth(x, y, span, col, r = 0) {
	const { bg, fg } = col;
	push();
	translate(x, y);
	stroke(fg);
	strokeCap(SQUARE);
	FourCorners(span);
	SawTooth(0, 0, span, 8, fg, 2);
	SawTooth(0, 0, span * 0.9, 8, bg, 2);
	SawTooth(0, 0, span * 0.8, 8, fg, 2);
	SawTooth(0, 0, span * 0.7, 8, bg, 2);
	rotate(PI / 8);
	SawTooth(0, 0, span * 0.48, 8, fg, 6);
	fill(fg);
	rotate(-PI / 8);
	for (let i = 0; i < 8; i++) {
		i > 0 && rotate(PI / 4);
		push();
		translate(span * 0.25, 0);
		rectMode(CENTER);
		rotate(PI / 4 + r);
		square(0, 0, span * 0.066);
		pop();
	}
	pop();
}

function Lotus(x, y, span, petals, petalColor, innerColor, dotColor) {
	push();
	translate(x, y);
	SawTooth(0, 0, span, petals, petalColor, 2);
	const seg = PI / petals;
	for (let i = 0; i < 16; i++) {
		rotate(seg);
		fill(innerColor);
		circle(span / 4, 0, span / 12);
		triangle(span / 6, span / 16, span / 6, -span / 16, span / 3, 0);
		fill(dotColor);
		circle(span / 5, 0, span / 32);
	}
	noFill();
	strokeWeight(span / 48);
	stroke(petalColor);
	circle(0, 0, span / 3.1);
	pop();
}

function Rosette(x, y, span) {
	push();
	translate(x + span / 2, y + span / 2);
	for (let i = 0; i < 6; i++) {
		rotate(PI / 3);
		circle(span / 2, 0, span);
	}
	pop();
}

function SawToothWithDoubleCircle(
	x,
	y,
	span,
	teeth,
	bg,
	fg,
	triangleWidth = 4
) {
	push();
	translate(x, y);
	SawTooth(0, 0, span, teeth, fg, triangleWidth);
	noFill();
	stroke(bg);
	strokeWeight(span / 18);
	circle(0, 0, span * 0.7);
	noStroke();
	fill(bg);
	circle(0, 0, span * 0.55);
	pop();
}

function SawToothWithInnerCircle(
	x,
	y,
	span,
	teeth,
	bg,
	fg,
	fg2,
	triangleWidth = 8
) {
	push();
	translate(x, y);
	SawTooth(0, 0, span, teeth, fg2, triangleWidth);
	noStroke();
	fill(bg);
	circle(0, 0, span * 0.25);
	pop();
}

function SawTooth(x, y, span, teeth, fg, triangleWidth) {
	const increment = (2 * PI) / teeth;
	noStroke();
	fill(fg);
	for (let i = 0; i < teeth; i++) {
		i > 0 && rotate(increment);
		triangle(0, -span / triangleWidth, 0, span / triangleWidth, span / 2, 0);
	}
}

function Square8(x, y, span) {
	const side = (span / 2) * Math.sqrt(2);
	const half = span / 2;
	const inset = (span - side) / 2;
	push();
	translate(x, y);
	rect(inset, inset, side, side);
	beginShape();
	vertex(half, 0);
	vertex(span, half);
	vertex(half, span);
	vertex(0, half);
	endShape(CLOSE);

	fill(colors.next());
	pop();
}

function Square376A(x, y, span, pixel, bg, pixelColor, c1, cross) {
	const half = span / 2;
	const hp = pixel / 2;
	const sp = span - hp;
	push();
	strokeCap(SQUARE);
	translate(x, y);
	noStroke();
	fill(pixelColor);
	rect(0, 0, span, span);
	fill(c1);
	rect(hp, hp, span - pixel, span - pixel);
	stroke(bg);
	strokeWeight(pixel);
	line(hp, 0, sp, 0);
	line(0, hp, 0, sp);
	const cut = (span - pixel) / 6;
	noStroke();
	fill(bg);
	triangle(cut * 2 + hp, hp, sp - cut * 2, hp, span / 2, cut + hp);
	triangle(cut * 2 + hp, sp, sp - cut * 2, sp, span / 2, sp - cut);
	triangle(hp, cut * 2 + hp, hp, sp - cut * 2, cut + hp, span / 2);
	triangle(sp, cut * 2 + hp, sp, sp - cut * 2, sp - cut, span / 2);
	fill(bg);
	beginShape();
	vertex(span / 2, cut + hp + 1);
	vertex(sp - cut - 1, span / 2);
	vertex(span / 2, sp - cut - 1);
	vertex(cut + hp + 1, span / 2);
	endShape(CLOSE);
	if (!cross) {
		fill(bg);
		const M = 2;
		rect(cut * M, cut * M, span - cut * M * 2, span - cut * M * 2);
	} else {
		fill(c1);
		const s = cut * 2;
		rect(cut, cut, s, s);
		rect(cut, span - cut - s, s, s);
		rect(span - cut - s, cut, s, s);
		rect(span - cut - s, span - cut - s, s, s);
	}
	pop();
}
