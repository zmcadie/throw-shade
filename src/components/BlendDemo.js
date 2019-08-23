import React from "react"
import styled from "styled-components"
import uuid from "uuid/v4"

import { blend } from '../colorUtils'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(11, auto);
  margin: 10px;
  padding: 10px;
  row-gap: 10px;
  width: fit-content;
`

const Box = styled.div`
  background: ${p => p.color};
  height: 50px;
  width: 40px;
`

const ColorBox = ({ color1, color2 }) => {
  const adjs = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
  return (
    <Container>
      <Box color={ color1 } style={{ width: "50px", margin: "0 10px" }} />
      { adjs.map(a => <Box key={ uuid() } color={ blend(color1, color2, a) } />) }
      <Box color={ color2 } style={{ width: "50px", margin: "0 10px" }} />
      
      <Box color={ color1 } style={{ width: "50px", margin: "0 10px" }} />
      { adjs.map(a => <Box key={ uuid() } color={ blend(color1, color2, a, true) } />) }
      <Box color={ color2 } style={{ width: "50px", margin: "0 10px" }} />
    </Container>
  )
}

const BlendDemo = () => (
  <div className="App">
    <ColorBox color1="#FF0000" color2="#00FF00" />
    <ColorBox color1="#00FF00" color2="#0000FF" />
    <ColorBox color1="#0000FF" color2="#FF0000" />
  </div>
)

export default BlendDemo
