class RingStack {
  constructor(series, options = {}) {
    this.series = series;
    this.options = options;
    this.index = 0;
  }

  burn(index = -1) {
    const burnIx = index === -1 ? this.index : index % this.series.length;
    const val = this.series[burnIx];
    const trimmed = [];
    this.series.forEach((c, ix) => {
      if (ix !== burnIx) {
        trimmed.push(c);
      }
    });
    this.series = trimmed;
    this.reset(index);
    return val;
  }

  burnRandom() {
    const index = Math.floor(Math.random() * this.series.length);
    return this.burn(index);
  }

  duplicate() {
    return new RingStack(this.series);
  }

  get(index) {
    if (index === undefined) {
      return this.get(this.index);
    }
    return this.series[index % this.series.length];
  }

  next() {
    const val = this.series[this.index];
    this.reset(this.index + 1);
    return val;
  }

  random() {
    const index = int(random(this.series.length));
    return this.series[index];
  }

  reset(ix = 0) {
    this.index = ix % this.series.length;
    return this;
  }

  shuffle() {
    this.series = shuffle(this.series);
    return this;
  }
}

class ColorStack extends RingStack {
  duplicate() {
    return new ColorStack(this.series);
  }

  background() {
    if (!this.options.background) {
      this.options.background = this.burnRandom();
    }
    return this.options.background;
  }

  stroke() {
    if (!this.options.stroke) {
      this.options.stroke = this.burnRandom();
    }
    return this.options.stroke;
  }

  nextWithOpacity(opacity) {
    const val = this.next();
    console.log(`val: ${val}`);
    const r = val.slice(1, 3);
    const g = val.slice(3, 5);
    const b = val.slice(5, 7);
    const rgba = `rgba(${unhex(r)}, ${unhex(g)}, ${unhex(b)}, ${opacity})`;
    console.log({ rgba, r, g, b });
    return color(rgba);
  }
}

function coolorsColors(url, interleave) {
  const raw = url.split("/");
  const colors = raw[raw.length - 1].split("-").map((c) => `#${c}`);
  if (!interleave) {
    return new ColorStack(colors);
  }
  const wider = [];
  colors.forEach((c) => {
    wider.push(c);
    wider.push(interleave);
  });
  return new ColorStack(wider);
}

function chromatoneColors() {
  const chroma = chromotome.get();
  return new ColorStack(chroma.colors, chroma);
}

module.exports = {
  coolorsColors,
  chromatoneColors,
  ColorStack,
  RingStack,
};
