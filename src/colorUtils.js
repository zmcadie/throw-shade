// only works with 7 character hex codes, i.e. #007BFF
const parseHex = color => color.slice(1).match(/.{2}/g).map(c => parseInt(c, 16))

// only works with rgb, does not support alpha channel
const parseRGB = color => color.slice(4, -1).split(", ").map(c => parseInt(c, 10))

//////////////////////////////
//
//    TO DO
//    ‾‾‾‾‾
//    1. Add alpha channel support to parseHex and parseRGB
//
//    2. Add support for 3 digit hex shorthand (and 4 digit with alpha channel support)
//
//////////////////////////////

const actions = {
  hex: parseHex,
  rgb: parseRGB,
  unknown: c => c
}

const getRGB = color => {
  const type = color[0] === "#"
    ? "hex"
    : color.slice(0, 3).toLowerCase() === "rgb"
      ? "rgb"
      : "unknown"
  return {
    type,
    color: actions[type](color)
  }
}

const rgblogend = (c0, c1, p) => {
  const v = s => _ => s * parseInt(_) ** 2;
  const C = (_, s) =>
    _.slice(4)
      .split(/,\s*/)
      .map(v(s));
  const f = C(c0, 1 - p);
  const t = C(c1, p);
  const g = (_, i) => parseInt((f[i] + t[i]) ** 0.5, 10);
  const o = f.map(g);
  const res = `rgb(${o[0]},${o[1]},${o[2]})`;
  return res;
};

const lighten = (hex, adj = 0.1) => {
  const clrArr = getRGB(hex).color
  const adjusted = clrArr.map(clr => clr + Math.round((255 - clr) * adj));
  const strArr = adjusted.map(a => `${a < 16 ? "0" : ""}${a.toString(16)}`);
  return `#${strArr.join("")}`;
};

const darken = (hex, adj = 0.1) => {
  const clrArr = hex
    .slice(1)
    .match(/.{2}/g)
    .map(clr => parseInt(clr, 16));
  const adjusted = clrArr.map(clr => clr - Math.round(clr * adj));
  const strArr = adjusted.map(a => `${a < 16 ? "0" : ""}${a.toString(16)}`);
  return `#${strArr.join("")}`;
};

export {
  lighten,
  darken,
  rgblogend
}
