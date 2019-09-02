import { conversionFunctions } from './colorUtils'

const { pad0, parseHex, parseRGB, parseHSL, arrToRGB, arrToHex, arrToHsl, getColorArray, rgbToHSL, hslToRGB } = conversionFunctions

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
})