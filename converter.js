function CymkToRgb([c, m, y, k]) {
	let r = 0;
	let g = 0;
	let b = 0;

	c = c / 100;
	m = m / 100;
	y = y / 100;
	k = k / 100;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	r = Math.round(r * 255);
	g = Math.round(g * 255);
	b = Math.round(b * 255);

	return [r, g, b];
}
