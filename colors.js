// Language: javascript
// Needs: https://unpkg.com/chromotome@1.19.1/dist/index.umd.js
class RingStack {
  constructor(series, options = {}) {
    this.series = series;
    this.options = options;
    this.index = -1;
  }

  burn(index = -1) {
    let burnIx = index === -1 ? this.index : index % this.series.length;
    if (burnIx === -1) {
      burnIx = 0;
    }
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

  dict(names) {
    const ret = {};
    names.forEach((c, ix) => {
      const key = names[ix];
      ret[names[ix]] = key === "bg" ? this.background() : this.next();
    });
    return ret;
  }

  get(index) {
    if (index === undefined) {
      return this.get(this.index);
    }
    return this.series[index % this.series.length];
  }

  next(count = 1) {
    this.reset(this.index + 1);
    if (count === 1) {
      return this.get(this.index);
    }
    const ret = [];
    for (let i = 0; i < count; i++) {
      ret.push(this.get(this.index + i));
    }
    return ret;
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
    //console.log(`val: ${val}`);
    const r = val.slice(1, 3);
    const g = val.slice(3, 5);
    const b = val.slice(5, 7);
    const rgba = `rgba(${unhex(r)}, ${unhex(g)}, ${unhex(b)}, ${opacity})`;
    // console.log({ rgba, r, g, b });
    return color(rgba);
  }
}

function chromatoneColors() {
  const chroma = chromotome.get();
  return new ColorStack(chroma.colors, chroma);
}
