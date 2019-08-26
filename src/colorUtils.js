const pad0 = str => `${str.length === 1 ? '0' : ''}${str}`

// only works with 7 character hex codes, i.e. #007BFF
const parseHex = color => color.slice(1).match(/.{2}/g).map(c => parseInt(c, 16))

// only works with rgb, does not support alpha channel
const parseRGB = color => color.match(/\d+/g).map(n => parseInt(n, 10))

const parseHSL = parseRGB

const arrToRGB = arr => `rgb(${arr.join(", ")})`

const arrToHex = arr => `#${arr.map(n => pad0(n.toString(16))).join("")}`

const arrToHsl = arr => `hsl(${arr[0]}, ${arr[1]}%, ${arr[2]}%)`

//////////////////////////////
//
//    TO DO
//    ‾‾‾‾‾
//    1. Add alpha channel support to parseHex and parseRGB
//
//    2. Add support for 3 digit hex shorthand (and 4 digit with alpha channel support)
//
//////////////////////////////

const parse = {
  hex: parseHex,
  rgb: parseRGB,
  hsl: parseHSL,
  unknown: c => c
}

const toStrAction = {
  hex: arrToHex,
  rgb: arrToRGB,
  hsl: arrToHsl,
  unknown: c => c
}

const getColorArray = color => {
  const func = color.slice(0, 3).toLowerCase()
  const type = color[0] === "#"
    ? "hex"
    : ["rgb", "hsl"].includes(func)
      ? func
      : "unknown"
  return [ type, parse[type](color) ]
}

const mixNum = (num1, num2, adj) => num1 + ((num2 - num1) * adj)
const blendArr = (arr1, arr2, adj) => arr1.map((num, i) => Math.trunc(mixNum(num, arr2[i], adj)))

const logBlend = (color1, color2, adj) => {
  const color1Squared = color1.map(clr => clr ** 2)
  const color2Squared = color2.map(clr => clr ** 2)
  return blendArr(color1Squared, color2Squared, adj).map(clr => Math.trunc(clr ** 0.5))
}

const blenders = { log: logBlend, linear: blendArr }

const blendColors = (color1, color2, adj = 0.5, log = true) => {
  const [ type1, colorArr1 ] = getColorArray(color1)
  const [ , colorArr2 ] = getColorArray(color2)
  const blended = blenders[log && type1 !== "hsl" ? 'log' : 'linear'](colorArr1, colorArr2, adj)
  return toStrAction[type1](blended)
}

const lighten = (color, adj = 0.1, log = true) => blendColors(color, "#FFFFFF", adj, log)

const darken = (color, adj = 0.1, log = true) => blendColors(color, "#000000", adj, log)

export {
  blendColors as blend,
  lighten,
  darken
}
