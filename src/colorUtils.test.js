import { conversionFunctions, blendingFunctions, blend, lighten, darken } from './colorUtils'

const { pad0, parseHex, parseRGB, parseHSL, arrToRGB, arrToHex, arrToHsl, getColorArray, rgbToHSL, hslToRGB } = conversionFunctions
const { mixNum, blendArr, logBlend, linearBlend, hslBlend } = blendingFunctions

describe('test color to array and array to color functions', () => {
  describe('helper functions for conversion functions', () => {
    test('adds a 0 in front of any string that is only 1 character', () => {
      expect(pad0('a')).toEqual('0a')
      expect(pad0('ff')).toEqual('ff')
    })
  })

  describe('string => array functions', () => {
    test('turns a 7 digit hex code into an array of values representing rgb', () => {
      expect(parseHex('#FFFFFF')).toEqual([255, 255, 255])
      expect(parseHex('#FF8000')).toEqual([255, 128, 0])
    })

    test('turns an rgb string into an array of values representing rgb', () => {
      expect(parseRGB('rgb(255, 128, 0')).toEqual([255, 128, 0])
      expect(parseRGB('rgb(255, 255, 255')).toEqual([255, 255, 255])
    })

    test('turns an hsl string into an array of values representing hsl', () => {
      expect(parseHSL('hsl(360, 50%, 0%')).toEqual([360, 50, 0])
      expect(parseHSL('hsl(14, 77%, 33%')).toEqual([14, 77, 33])
    })
  })

  describe('array => string functions', () => {
    test('turns an array of values representing rgb into a string rgb value', () => {
      expect(arrToRGB([255, 50, 0])).toEqual('rgb(255, 50, 0)')
      expect(arrToRGB([0, 0, 0])).toEqual('rgb(0, 0, 0)')
    })

    test('turns an array of values representing rgb into a 7 digit hex code', () => {
      expect(arrToHex([255, 50, 0])).toEqual('#ff3200')
      expect(arrToHex([255, 255, 255])).toEqual('#ffffff')
    })

    test('turns an array of values representing hsl into an hsl string', () => {
      expect(arrToHsl([80, 99, 10])).toEqual('hsl(80, 99%, 10%)')
      expect(arrToHsl([355, 6, 72])).toEqual('hsl(355, 6%, 72%)')
    })
  })

  describe('combined string => array conversion function', () => {
    test('converts hex, rgb, or hsl string to an array that represents rgb or hsl', () => {
      expect(getColorArray('#FFFFFF')).toEqual(["hex", [255, 255, 255]])
      expect(getColorArray('rgb(255, 128, 0')).toEqual(["rgb", [255, 128, 0]])
      expect(getColorArray('hsl(14, 77%, 33%')).toEqual(["hsl", [14, 77, 33]])
    })
  })
})

describe('rgb array <=> hsl array conversion functions', () => {
  test('converts array of values representing r, g, b to array of h, s, l', () => {
    expect(rgbToHSL([255, 0, 255])).toEqual([300, 100, 50])
    expect(rgbToHSL([255, 255, 255])).toEqual([0, 0, 100])
    expect(rgbToHSL([0, 0, 0])).toEqual([0, 0, 0])
  })
  
  test('converts array of values representing h, s, l to array of r, g, b', () => {
    expect(hslToRGB([300, 100, 50])).toEqual([255, 0, 255])
    expect(hslToRGB([0, 0, 100])).toEqual([255, 255, 255])
    expect(hslToRGB([0, 0, 0])).toEqual([0, 0, 0])
  })
})

describe('test color blending functions', () => {
  describe('test single number blending and array blending', () => {
    test('returns a number at a specified point between two numbers', () => {
      expect(mixNum(5, 10, 0.5)).toEqual(7.5)
      expect(mixNum(13, 17.7, 0.7)).toEqual(16.29)
      expect(mixNum(0, 0, 1)).toEqual(0)
    })
    
    test('blends each element of an array with corresponding element of second array', () => {
      expect(blendArr([5, 13, 0], [10, 17.7, 0], 0.7)).toEqual([8.5, 16.29, 0])
      expect(blendArr([0, 0, 0], [255, 255, 255], 0.5)).toEqual([127.5, 127.5, 127.5])
    })
  })

  describe('test log and linear blending functions', () => {
    test('get square of array elements blend them, then return square root of elements', () => {
      expect(logBlend([255, 0, 128], [128, 128, 0], 0.75)).toEqual([168, 110, 64])
      expect(logBlend([0, 255, 255], [255, 255, 255], 0.50)).toEqual([180, 255, 255])
      expect(logBlend([255, 255, 255], [0, 0, 0], 0.25)).toEqual([220, 220, 220])
    })
    
    test('blend each element of two arrays', () => {
      expect(linearBlend([65, 68, 193], [192, 98, 94], 0.43)).toEqual([119, 80, 150])
      expect(linearBlend([204, 204, 204], [162, 35, 255], 0.33)).toEqual([190, 148, 220])
      expect(linearBlend([255, 255, 255], [0, 0, 0], 0.25)).toEqual([191, 191, 191])
    })
  })

  describe('convert color array to hsl, blend, then convert back', () => {
    test('rgb => hsl => blend => rgb', () => {
      expect(hslBlend([250, 128, 114], [139, 69, 19], 0.8)).toEqual([178, 76, 20])
      expect(hslBlend([0, 0, 0], [255, 255, 255], 0.5)).toEqual([128, 128, 128])
      expect(hslBlend([255, 0, 0], [0, 255, 0], 0.5)).toEqual([255, 255, 0])
    })
  })
})

describe('test exported functions blend, lighten, darken', () => {
  test('given two color strings, adjustment, and blend type returns color string of blended color', () => {
    expect(blend("#41c1b7", "#e77943", 0.33)).toEqual("#8eac9a")
    expect(blend("#41c1b7", "#e77943", 0.33, "linear")).toEqual("#77a990")
    expect(blend("#41c1b7", "#e77943", 0.33, "hsl")).toEqual("#41cf4a")
  })
  
  test('lighten color string by given amount, linear and log', () => {
    expect(lighten("#77fa91", 0.33)).toEqual("#affbbc")
    expect(lighten("#77fa91", 0.33, "linear")).toEqual("#a3fbb5")
  })
  
  test('darken color string by given amount, linear and log', () => {
    expect(darken("#77fa91", 0.33)).toEqual("#61cc76")
    expect(darken("#77fa91", 0.33, "linear")).toEqual("#4fa761")
  })
})