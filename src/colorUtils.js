const pad0 = str => `${str.length === 1 ? '0' : ''}${str}`

// only works with 7 character hex codes, i.e. #007BFF
const parseHex = color => color.slice(1).match(/.{2}/g).map(c => parseInt(c, 16))

// only works with rgb, does not support alpha channel
const parseRGB = color => color.slice(4, -1).split(", ").map(c => parseInt(c, 10))

const arrToRGB = arr => `rgb(${arr.join(", ")})`

const arrToHex = arr => `#${arr.map(n => pad0(n.toString(16))).join("")}`

//////////////////////////////
//
//    TO DO
//    ‾‾‾‾‾
//    1. Add alpha channel support to parseHex and parseRGB
//
//    2. Add support for 3 digit hex shorthand (and 4 digit with alpha channel support)
//
//////////////////////////////

const parseAction = {
  hex: parseHex,
  rgb: parseRGB,
  unknown: c => c
}

const toStrAction = {
  hex: arrToHex,
  rgb: arrToRGB,
  unknown: c => c
}

const getColorArray = color => {
  const type = color[0] === "#"
    ? "hex"
    : color.slice(0, 3).toLowerCase() === "rgb"
      ? "rgb"
      : "unknown"
  return [ type, parseAction[type](color) ]
}

const logBlend = (color1, color2, adj) => {
  const squareShade = shade => color => shade * (color ** 2)
  const squareColor = (clr, shd) => clr.map(squareShade(shd))
  const color1Squared = squareColor(color1, 1 - adj)
  const color2Squared = squareColor(color2, adj)
  const blendSquareRoot = (clr, i) => Math.trunc((clr + color2Squared[i]) ** 0.5)
  return color1Squared.map(blendSquareRoot)
}

const linearBlend = (color1, color2, adj) => {
  const blend = (clr, i) => clr + Math.trunc((color2[i] - clr) * adj)
  return color1.map(blend)
}

const blenders = { log: logBlend, linear: linearBlend }

const blend = (color1, color2, adj = 0.5, log = false) => {
  const [ type1, colorArr1 ] = getColorArray(color1)
  const [ , colorArr2 ] = getColorArray(color2)
  const blended = blenders[log ? 'log' : 'linear'](colorArr1, colorArr2, adj)
  return toStrAction[type1](blended)
}

const lighten = (color, adj = 0.1, log = false) => blend(color, "#FFFFFF", adj, log)

const darken = (color, adj = 0.1, log = false) => blend(color, "#000000", adj, log)

export {
  lighten,
  darken
}
