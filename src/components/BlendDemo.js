import React from "react"
import styled from "styled-components"
import uuid from "uuid/v4"

import { blend } from '../colorUtils'

const Container = styled.div`
  background: #000;
  border: 1px solid #ddd;
  color: white;
  /* display: grid;
  grid-template-columns: repeat(11, auto); */
  margin: 20px 0;
  padding: 20px 20px 20px;
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
  background: ${ p => p.color };
  height: 50px;
  width: 1%;
`

const SmoothGradient = ({ c1, c2, log = true }) => (
  <StyledGradient>
    { [...Array(100).keys()].map(n => <GradItem key={ uuid() } color={blend(c1, c2, n / 100, log)} />) }
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
    <ColorBox color1="#FF0000" color2="#00FF00" c1name="Red" c2name="Green" />
    <ColorBox color1="#00FF00" color2="#0000FF" c1name="Green" c2name="Blue" />
    <ColorBox color1="#0000FF" color2="#FF0000" c1name="Blue" c2name="Red" />
  </div>
)

export default BlendDemo
