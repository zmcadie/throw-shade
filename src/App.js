import React from "react"
import styled from "styled-components"
import uuid from "uuid/v4"

import { lighten, darken, rgblogend } from './colorUtils'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(19, auto);
  margin: 10px;
  padding: 10px;
  row-gap: 10px;
  width: fit-content;
`;

const Box = styled.div`
  background: ${p => p.color};
  height: 50px;
  width: 25px;
`;

const ColorBox = ({ hex, rgb }) => {
  const adjs = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  return (
    <Container>
      { adjs.map(a => 1 - a).map(a => <Box key={ uuid() } color={darken(hex, a)} />) }
      <Box color={ hex } style={{ width: "50px", margin: "0 10px" }} />
      { adjs.map(a => <Box key={ uuid() } color={ lighten(hex, a) } />) }

      { adjs.map(a => 1 - a).map(a => <Box key={ uuid() } color={rgblogend(rgb, "rgb(0, 0, 0)", a)} />) }
      <Box color={ hex } style={{ width: "50px", margin: "0 10px" }} />
      { adjs.map(a => <Box key={ uuid() } color={rgblogend(rgb, "rgb(255, 255, 255)", a)} />) }
    </Container>
  );
};

const App = () => (
  <div className="App">
    <ColorBox hex="#00FFFF" rgb="rgb(0, 255, 255)" />
    <ColorBox hex="#FF00FF" rgb="rgb(255, 0, 255)" />
    <ColorBox hex="#FFFF00" rgb="rgb(255, 255, 0)" />
    <ColorBox hex="#000000" rgb="rgb(0, 0, 0)" />
  </div>
)

export default App;
