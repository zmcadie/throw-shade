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
  const clrArr = hex
    .slice(1)
    .match(/.{2}/g)
    .map(clr => parseInt(clr, 16));
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
