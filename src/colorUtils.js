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

// The following two functions are based on the math explained by Nikolai Waldman here: https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/

// convert array of [r, g, b] values to [h, s, l] values
const rgbToHSL = rgb => {
  // convert RGB to values between 0-1
  const [r, g, b] = rgb.map(c => c / 255)

  // get min/max
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  
  // luminance = max + min / 2, round up and convert to percent
  const lum = Math.round(((min + max) / 2) * 100)

  // if min === max there is no saturation
  // if luminance is > 50% then saturation = (max - min) / (2 - max - min)
  // if luminance is < 50% then saturation = (max - min) / (max + min)
  // round up and convert to percent
  const sat = min === max ? 0 : Math.round((lum < 50
  	? (max - min) / (max + min)
    : (max - min) / (2 - max - min)) * 100)
  
  // if saturation is 0 hue is also 0
  // the formula for hue depends on what value is greatest
  // if max is red then hue = (green - blue) / (max - min)
  // if max is green then hue = 2 + (blue - red) / (max - min)
  // if max is blue then hue = 4 + (red - green) / (max - min)
  // round up and convert to degrees
  let hue = sat
  	? r === max
    	? (g - b) / (max - min)
      : g === max
      	? 2 + (b - r) / (max - min)
        : 4 + (r - g) / (max - min)
  	: 0
  hue = Math.round(hue * 60)
	if (hue < 0) hue = hue + 360

	return [hue, sat, lum]
}

// convert array of [h, s, l] values to [r, g, b] values
const hslToRGB = hsl => {
  const [h, s, l] = hsl.map((n, i) => i === 0 ? n / 360 : n / 100)

  // if there's no saturation it's a shade of grey so we just convert luminence and set r, g, and b to that level
  if (s === 0) {
    const lum = Math.round(l * 255)
    return Array(3).fill(lum)
  }

  // we create temp variables to help with calculations later
  // if luminance is < 50% then temp1 = luminance * (1 + saturation)
  // if luminance is > 50% then temp1 = (luminance + saturation) - (luminance * saturation)
  const temp1 = l < 0.5 ? l * (1 + s) : (l + s) - (l * s)
  const temp2 = 2 * l - temp1

  // now we save temporary values for each color channel
  // if any values are above 1 we subtract 1, if below 1 we add 1
  const tempR = h < 0.667 ? h + 0.333 : h - 0.667
  const tempG = h
  const tempB = h < 0.333 ? h + 0.667 : h - 0.333

  // now we do up to three test for each channel to find the right formula
  // test1: if 6 x temporary channel is < 1 then channel = temp2 + (temp1 - temp2) * 6 * temporary channel
  // test2: if 2 x temporary channel is < 1 then channel = temp1
  // test3: if 3 x temporary channel is < 2 then channel = temp2 + (temp1 - temp2) * (0.666 - temporary channel) * 6
  // if none pass then channel = temp2
  const test = ch => 6 * ch < 1
    ? temp2 + (temp1 - temp2) * 6 * ch
    : 2 * ch < 1
      ? temp1
      : 3 * ch < 2
        ? temp2 + (temp1 - temp2) * (0.666 - ch) * 6
        : temp2
  const rgb = [tempR, tempG, tempB].map(test)

  // convert to 8-bit colors and return
  return rgb.map(c => Math.round(c * 255))
}

//////////////////////////////
//
//    TO DO
//    ‾‾‾‾‾
//    1. Check hsl blending functions, color's don't blend as smoothly as linear & log
//       maybe number of colors between two colors in hsl color spectrum is greater?
//       Problem visible in color blending demo
// 
//    2. Fix hsl blending for colors that wrap around the visible spectrum
//       Currently blue mixed with red goes through green spectrum instead of just blending to purple
//
//////////////////////////////

const mixNum = (num1, num2, adj) => num1 + ((num2 - num1) * adj)
const blendArr = (arr1, arr2, adj) => arr1.map((num, i) => Math.trunc(mixNum(num, arr2[i], adj)))

const logBlend = (color1, color2, adj) => {
  const color1Squared = color1.map(clr => clr ** 2)
  const color2Squared = color2.map(clr => clr ** 2)
  return blendArr(color1Squared, color2Squared, adj).map(clr => Math.trunc(clr ** 0.5))
}

// convert [r, g, b] channels to hsl, blend, and convert back
const hslBlend = (color1, color2, adj) => hslToRGB(blendArr(rgbToHSL(color1), rgbToHSL(color2), adj))

const blenders = { log: logBlend, linear: blendArr, hsl: hslBlend }

const blendColors = (color1, color2, adj = 0.5, type = "log") => {
  const [ type1, colorArr1 ] = getColorArray(color1)
  const [ type2, colorArr2 ] = getColorArray(color2)
  if (type1 !== type2) {
    console.error(`Blending colours must be the same format.\nColor 1 is type: ${type1}\nColor 2 is type: ${type2}`)
  }
  const blendType = type1 === "hsl" ? "linear" : type
  const blended = blenders[blendType](colorArr1, colorArr2, adj)
  return toStrAction[type1](blended)
}

const lighten = (color, adj = 0.1, type = "log") => blendColors(color, "#FFFFFF", adj, type)

const darken = (color, adj = 0.1, type = "log") => blendColors(color, "#000000", adj, type)

const conversionFunctions = {
  pad0,
  parseHex,
  parseRGB,
  parseHSL,
  arrToRGB,
  arrToHex,
  arrToHsl,
  getColorArray
}

export {
  blendColors as blend,
  lighten,
  darken,
  conversionFunctions
}
