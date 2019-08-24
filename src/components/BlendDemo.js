import React from "react"
import styled from "styled-components"
import uuid from "uuid/v4"

import { blend } from '../colorUtils'

const Container = styled.div`
  background: #000;
  border: 1px solid #ddd;
  color: #f8f8f8;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 40px;
  margin: 20px 0;
  padding: 10px 20px 20px;
  row-gap: 10px;
  text-align: center;
  width: fit-content;
`

const StyledGradient = styled.div`
  display: flex;
  margin-top: 10px;
  width: 500px;
`

const GradItem = styled.div`
  height: 50px;
  width: 1%;
`

const SmoothGradient = ({ c1, c2, log = true }) => (
  <StyledGradient>
    { [...Array(100).keys()].map(n => <GradItem key={ uuid() } style={{ background: blend(c1, c2, n / 100, log) }} />) }
  </StyledGradient>
)

const ColorBox = ({ color1, color2, c1name, c2name }) => {
  return (
    <Container>
      { `${c1name} <=> ${c2name}` }
      <SmoothGradient c1={ color1 } c2={ color2 } log={ false } />
      <SmoothGradient c1={ color1 } c2={ color2 } />
    </Container>
  )
}

const BlendDemo = () => (
  <div className="App">
    <ColorBox color1="#FF0000" color2="#00FF00" c1name="red" c2name="green" />
    <ColorBox color1="#00FF00" color2="#0000FF" c1name="green" c2name="blue" />
    <ColorBox color1="#0000FF" color2="#FF0000" c1name="blue" c2name="red" />
  </div>
)

export default BlendDemo

const BlendCode = `// Blend to colors by squaring before blending
// Then return the square root of the result
const logBlend = (color1, color2, adj) => {

  // given a shade (e.g. 0.4) returns a function
  // that multiplies the square of a given color value by that shade
  const squareShade = shade => color => shade * (color ** 2)

  // maps color values to squared and shaded values
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

const blend = (color1, color2, adj = 0.5, log = true) => {
  const [ type1, colorArr1 ] = getColorArray(color1)
  const [ , colorArr2 ] = getColorArray(color2)
  const blended = blenders[log ? 'log' : 'linear'](colorArr1, colorArr2, adj)
  return toStrAction[type1](blended)
}`

export {
  BlendCode,
  SmoothGradient
}