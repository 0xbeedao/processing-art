/**
 * @fileoverview This file contains the configuration panel for the wormbots game.
 * @version 0.1.0
 */

const defaultSettings = {
	wormCount: 2,
	frameRate: 10,
	columns: 10,
	colors: "dt04",
};

class ConfigPanel {
	constructor(callback, canvas, overrides = {}) {
		this.settings = Object.assign({}, defaultSettings, overrides);
		const colorstack = chromatomeColors(this.settings.colors);
		this.outline = colorstack.next();
		this.background = colorstack.next();
		this.callback = callback;
		this.buffer = null;
		this.canvas = canvas;
		this.btn = null;
		this.closing = false;
	}

	handleClose() {
		if (!this.closing) {
			this.closing = true;
			copy(this.buffer, 0, 0, width, height, 0, 0, width, height);
			this.buffer = null;
			this.callback(this.settings);
			this.btn.hide();
			this.btn.remove();
			this.btn = null;
			this.closing = false;
		}
	}

	show() {
		const { canvas, buffer, callback } = this;

		if (!this.buffer) {
			this.buffer = createGraphics(width, height);
			this.buffer.copy(canvas, 0, 0, width, height, 0, 0, width, height);
		}

		stroke(this.outline);
		strokeWeight(4);
		fill(this.background);
		rect(width * 0.2, height * 0.2, width * 0.6, height * 0.6);
		const escBtn = createButton("X");
		escBtn.position(width * 0.2 + 10, height * 0.21);
		escBtn.mousePressed(() => {
			this.handleClose();
		});
		this.btn = escBtn;
	}
}
