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
  height: 80px;
  width: 25px;
`

const CenterBox = styled(Box)`
  margin: 0 10px;
  width: 80px;
`

const StyledBoxLabel = styled.div`
  background: #ddd;
  grid-column: span 9;
  height: 20px;
  text-align: center;
`

const CenterBoxLabel = styled(StyledBoxLabel)`
  grid-column: span 1;
  margin: 0 10px;
`

const BoxLabel = ({ color }) => (
  <>
    <StyledBoxLabel>Darken</StyledBoxLabel>
    <CenterBoxLabel style={{ gridColumn: "span 1" }}>{ color }</CenterBoxLabel>
    <StyledBoxLabel>Lighten</StyledBoxLabel>
  </>
)

const ColorBox = ({ color, name }) => {
  const adjs = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
  return (
    <Container>
      <BoxLabel color={ name } />
      { adjs.map(a => 1 - a).map(a => <Box key={ uuid() } color={darken(color, a, false)} />) }
      <CenterBox color={ color } />
      { adjs.map(a => <Box key={ uuid() } color={ lighten(color, a, false) } />) }

      { adjs.map(a => 1 - a).map(a => <Box key={ uuid() } color={darken(color, a)} />) }
      <CenterBox color={ color } />
      { adjs.map(a => <Box key={ uuid() } color={lighten(color, a)} />) }
    </Container>
  )
}

const ShadeDemo = () => (
  <div className="App">
    <ColorBox color="#00FFFF" name="Cyan" />
    <ColorBox color="#FF00FF" name="Magenta" />
    <ColorBox color="#FFFF00" name="Yellow" />
  </div>
)

export default ShadeDemo
