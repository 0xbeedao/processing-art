/**
 * @fileoverview This file contains the configuration panel for the wormbots game.
 * @version 0.1.0
 */

const defaultSettings = {
	wormCount: 2,
	frameRate: 10,
	columns: 10,
	colors: "dt04",
	show: true,
};

class ConfigPanel {
	constructor(callback, overrides = {}) {
		this.settings = Object.assign({}, defaultSettings, overrides);
		const colorstack = chromatomeColors(this.settings.colors);
		this.outline = colorstack.next();
		this.background = colorstack.next();
		this.callback = callback;
	}

	toggle() {
		this.settings.show = !this.settings.show;
	}

	draw() {
		beginLayer();
		stroke(this.outline);
		strokeWeight(4);
		fill(this.background);
		rect(width * 0.2, height * 0.2, width * 0.6, height * 0.6);

		endLayer(this.settings.show);
	}
}
