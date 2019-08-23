import React from "react"
import styled from "styled-components"
import uuid from "uuid/v4"

import { lighten, darken } from '../colorUtils'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(19, auto);
  margin: 10px;
  padding: 10px;
  row-gap: 10px;
  width: fit-content;
`

const Box = styled.div`
  background: ${p => p.color};
  height: 50px;
  width: 25px;
`

const ColorBox = ({ color }) => {
  const adjs = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
  return (
    <Container>
      { adjs.map(a => 1 - a).map(a => <Box key={ uuid() } color={darken(color, a)} />) }
      <Box color={ color } style={{ width: "50px", margin: "0 10px" }} />
      { adjs.map(a => <Box key={ uuid() } color={ lighten(color, a) } />) }

      { adjs.map(a => 1 - a).map(a => <Box key={ uuid() } color={darken(color, a, true)} />) }
      <Box color={ color } style={{ width: "50px", margin: "0 10px" }} />
      { adjs.map(a => <Box key={ uuid() } color={lighten(color, a, true)} />) }
    </Container>
  )
}

const ShadeDemo = () => (
  <div className="App">
    <ColorBox color="#00FFFF" />
    <ColorBox color="#FF00FF" />
    <ColorBox color="#FFFF00" />
    <ColorBox color="#000000" />
  </div>
)

export default ShadeDemo
