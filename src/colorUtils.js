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
  
  // luminance = max + min / 2
  let lum = (min + max) / 2

  // if min === max there is no saturation
  // if luminance is > 50% then saturation = (max - min) / (2 - max - min)
  // if luminance is < 50% then saturation = (max - min) / (max + min)
  let sat = min === max ? 0 : (lum < 0.5
  	? (max - min) / (max + min)
    : (max - min) / (2 - max - min))
  
  // if saturation is 0 hue is also 0
  // the formula for hue depends on what value is greatest
  // if max is red then hue = (green - blue) / (max - min)
  // if max is green then hue = 2 + (blue - red) / (max - min)
  // if max is blue then hue = 4 + (red - green) / (max - min)
  let hue = sat
  	? r === max
    	? (g - b) / (max - min)
      : g === max
      	? 2 + (b - r) / (max - min)
        : 4 + (r - g) / (max - min)
  	: 0
  
  // convert hue to degrees, saturation and luminance to percent
  hue = Math.round(hue * 60)
  if (hue < 0) hue = hue + 360
  sat = Math.round(sat * 100)
  lum = Math.round(lum * 100)

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
  return rgb.map(c => {
    return Math.round(c < 0 ? 0 : c * 255)
  })
}

// more precise than above function
// based on formula found at: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
// 
//    TO DO
//    ‾‾‾‾‾
//    fix issue in demo where first half of hsl blend is black
// 
//////////
const hslToRGB2 = hsl => {
  const [h, s, l] = hsl.map((n, i) => i === 0 ? n : n / 100)

  // if there's no saturation it's a shade of grey so we just convert luminence and set r, g, and b to that level
  if (s === 0) { return Array(3).fill(Math.round(l * 255)) }

  // get chroma of original colour, (chroma is intensity of colour, similar to saturation)
  const c = (1 - (2 * l - 1)) * s
  // convert hue to a side of the rgb cube
  const h1 = h / 60
  // temp value for calculations
  const x = c * (1 - (h1 % 2 - 1))

  let rgb1 = [0, 0, 0]
  // find point along bottom three faces of the RGB cube with the same hue and chroma as our colour
  switch (Math.trunc(h1)) {
    case 5: rgb1 = [c, 0, x]; break
    case 4: rgb1 = [x, 0, c]; break
    case 3: rgb1 = [0, x, c]; break
    case 2: rgb1 = [0, c, x]; break
    case 1: rgb1 = [x, c, 0]; break
    default: rgb1 = [c, x, 0]
  }

  // value to add to each channel to match lightness
  const m = l - c / 2
  // add m to each channel and convert to [0, 255] for RGB
  rgb1 = rgb1.map(ch => Math.round((ch + m) * 255))
  console.log(hsl, rgb1)
  return rgb1
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
//    3. hslToRGB consistently converts to one or two points off of the correct conversion.
//       Look into rounding errors and other points of imprecision
//
//////////////////////////////

const mixNum = (num1, num2, adj) => num1 + ((num2 - num1) * adj)
const blendArr = (arr1, arr2, adj) => arr1.map((num, i) => mixNum(num, arr2[i], adj))

const logBlend = (color1, color2, adj) => {
  const color1Squared = color1.map(clr => clr ** 2)
  const color2Squared = color2.map(clr => clr ** 2)
  return blendArr(color1Squared, color2Squared, adj).map(clr => Math.trunc(clr ** 0.5))
}

const linearBlend = (color1, color2, adj) => blendArr(color1, color2, adj).map(num => Math.trunc(num))

// convert [r, g, b] channels to hsl, blend, and convert back
const hslBlend = (color1, color2, adj) => {
  const hsl1 = rgbToHSL(color1)
  const hsl2 = rgbToHSL(color2)
  if (hsl1[0] > hsl2[0] && hsl1[0] - hsl2[0] > hsl2[0] + 360 - hsl1[0]) hsl2[0] += 360
  if (hsl1[0] < hsl2[0] && hsl2[0] - hsl1[0] > hsl1[0] + 360 - hsl2[0]) hsl1[0] += 360
  const blended = blendArr(hsl1, hsl2, adj)
  return hslToRGB2(blended)
}

const blenders = { log: logBlend, linear: linearBlend, hsl: hslBlend }

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
  getColorArray,
  rgbToHSL,
  hslToRGB: hslToRGB2
}

const blendingFunctions = {
  mixNum,
  blendArr,
  logBlend,
  linearBlend,
  hslBlend
}

export {
  blendColors as blend,
  lighten,
  darken,
  conversionFunctions,
  blendingFunctions
}
