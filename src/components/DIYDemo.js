import React from "react"
import styled from "styled-components"

import ColorPicker from "./ColorPicker"
import Slider from "./Slider"

import { blend, lighten, darken } from '../colorUtils'

const colorFunctions = { blend, lighten, darken }


////////////////////////////////////////
//////                            //////
//////      Component Styles      //////
//////                            //////

const FormSelectContainer = styled.div`
  align-items: flex-end;
  display: flex;
  height: 50px;
  margin: 0 1px;
`

const FormSelectButton = styled.button.attrs(props => {
  let background
  switch (props.type) {
    case "blend": background = "#FF6961"; break
    case "lighten": background = "#77DD77"; break
    default: background = "#AEC6CF"; break
  }
  const height = props.selected ? "50px" : "30px"
  const opacity = props.selected ? 1 : 0.5
  return {
    onClick: () => props.setFunc(props.type),
    style: { background, height, opacity }
  }
})`
  border: none;
  border-radius: 0;
  color: #444;
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0 1px;
  outline: 2px solid #444;
  text-transform: uppercase;
  transition: height 0.15s, opacity 0.15s;
  width: 100%;

  :not(:first-child) {
    border-left: none;
  }
`

const FormContainer = styled.form`
  border: 2px solid #444;
  display: flex;
  flex-direction: column;
  min-height: 330px;
  padding: 20px;
  padding-bottom: 0;

  > label {
    display: block;

    > :first-child {
      padding-top: 12px;
    }
    
    &:not(:first-child) {
      margin-top: 12px;
    }
  }

  > button[type="submit"] {
    margin-top: auto;
  }
`

const FormSubmit = styled.button.attrs({type: "submit"})`
  background: ${p => p.background};
  border: none;
  border-top: 2px solid #444;
  color: #444;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 30px -20px 0;
  padding: 8px;
  text-align: center;
  text-transform: capitalize;
  transition: background-color 0.1s, box-shadow 0.1s;
  width: calc(100% + 40px);

  :active {
    background: ${p => darken(p.background)};
    box-shadow: inset 2px -2px #0004;
  }

  :focus, :active {
    outline: none;
  }
`

const FormResultDisplay = styled.div`
  align-items: center;
  border: 2px solid #444;
  border-top: none;
  display: flex;
  padding: 20px 20px 30px;

  > *:not(:first-child) {
    margin-left: 10px;
  }
`

const DisplayBlock = styled.div`
  background: ${props => props["data-color"]};
  border: 2px solid #444;
  height: 100px;
  position: relative;
  width: 100px;

  &::after {
    content: attr(data-color);
    display: block;
    line-height: 30px;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 100%;
  }
`

//////                            //////
//////      Component Styles      //////
//////                            //////
////////////////////////////////////////


///////////////////////////////////////
//////                           //////
//////      Form Components      //////
//////                           //////

const LightenForm = () => {
  const [color, setColor] = React.useState("#77DD77")
  return (
    <>
      <label>
        Base Colour
        <ColorPicker
          name="color"
          value={ color }
          onChange={ clr => setColor(clr) }
        />
      </label>
      <label style={{ marginTop: "30px" }}>
        Percent to lighten by
        <Slider
          name="percent"
          background={ `linear-gradient(to right, ${color}, white)` }
        />
      </label>
      <FormSubmit background="#77DD77">Lighten Colour</FormSubmit>
    </>
  )
}

const DarkenForm = () => {
  const [color, setColor] = React.useState("#aec6cf")
  return (
    <>
      <label>
        Base Colour
        <ColorPicker
          name="color"
          value={ color }
          onChange={ clr => setColor(clr) }
        />
      </label>
      <label style={{ marginTop: "30px" }}>
        Percent to darken by
        <Slider
          name="percent"
          background={ `linear-gradient(to right, ${color}, black)` }
        />
      </label>
      <FormSubmit background="#aec6cf">Darken Colour</FormSubmit>
    </>
  )
}

const BlendForm = () => {
  const [color1, setColor1] = React.useState("#ff6961")
  const [color2, setColor2] = React.useState("#6EB5FF")
  return (
    <>
      <label>
        Base Colour
        <ColorPicker
          name="base-color"
          value={ color1 }
          onChange={ clr => setColor1(clr) }
        />
      </label>
      <label>
        Blend With
        <ColorPicker
          name="blend-color"
          value={ color2 }
          onChange={ clr => setColor2(clr) }
        />
      </label>
      <label style={{ marginTop: "30px" }}>
        Percent to blend by
        <Slider
          name="percent"
          background={ `linear-gradient(to right, ${color1}, ${color2})` }
        />
      </label>
      <FormSubmit background="#ff6961">Blend Colours</FormSubmit>
    </>
  )
}

//////                           //////
//////      Form Components      //////
//////                           //////
///////////////////////////////////////


const forms = {
  lighten: <LightenForm />,
  darken: <DarkenForm />,
  blend: <BlendForm />
}

const DIYDemo = () => {
  const [func, setFunc] = React.useState("blend")
  const [formData, setFormData] = React.useState()
  
  const handleSubmit = e => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    const args = func === "blend"
      ? [form["base-color"], form["blend-color"], form.percent / 100]
      : [form.color, form.percent / 100]
    const res = colorFunctions[func](...args)
    setFormData({...form, res})
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <FormSelectContainer>
        <FormSelectButton {...{setFunc}} selected={func === "blend"} type="blend">Blend</FormSelectButton>
        <FormSelectButton {...{setFunc}} selected={func === "lighten"} type="lighten">Lighten</FormSelectButton>
        <FormSelectButton {...{setFunc}} selected={func === "darken"} type="darken">Darken</FormSelectButton>
      </FormSelectContainer>
      <FormContainer onSubmit={ handleSubmit }>
        { forms[func] }
      </FormContainer>
      { formData
        ? (
          <FormResultDisplay>
            <DisplayBlock data-color={formData.color || formData["base-color"]} />
            {
              formData["blend-color"]
                ? (
                  <>
                    <span>and</span>
                    <DisplayBlock data-color={formData["blend-color"]} />
                  </>
                ) : ""
            }
            <span>{ `${func}ed by ${formData.percent}% is ` }</span>
            <DisplayBlock data-color={formData.res} />
          </FormResultDisplay>
        ) : ""
      }
    </div>
  )
}

export default DIYDemo
