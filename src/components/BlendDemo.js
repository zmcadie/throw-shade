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

const FunctionLabel = styled.div`
  color: white;
  margin: 20px 0 0 -25px;
  text-align: center;
  transform: rotate(180deg);
  writing-mode: vertical-lr;
`

const StyledGradient = styled.div`
  display: flex;
  margin-top: 20px;
  width: 500px;
`

const GradItem = styled.div`
  height: 75px;
  width: 1%;
`

const SmoothGradient = ({ c1, c2, type = "log" }) => (
  <StyledGradient>
    { [...Array(100).keys()].map(n => <GradItem key={ uuid() } style={{ background: blend(c1, c2, n / 100, type) }} />) }
  </StyledGradient>
)

const ColorBox = ({ color1, color2, c1name, c2name }) => {
  return (
    <Container>
      { `${c1name} <=> ${c2name}` }
      <div style={{ display: "flex" }}>
        <FunctionLabel>Linear</FunctionLabel>
        <SmoothGradient c1={ color1 } c2={ color2 } type="linear" />
      </div>
      <div style={{ display: "flex" }}>
        <FunctionLabel>Log</FunctionLabel>
        <SmoothGradient c1={ color1 } c2={ color2 } />
      </div>
      <div style={{ display: "flex" }}>
        <FunctionLabel>HSL</FunctionLabel>
        <SmoothGradient c1={ color1 } c2={ color2 } type="hsl" />
      </div>
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

export {
  SmoothGradient
}