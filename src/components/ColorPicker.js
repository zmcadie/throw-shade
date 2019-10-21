import React from 'react'
import { ChromePicker } from 'react-color';
import styled from 'styled-components';

const ButtonOuter = styled.div`
  background: #fdfdfd;
  border: 2px solid #444;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
  height: 20px;
  padding: 5px;
  width: 30px;
`

const ButtonInner = styled.div`
  box-shadow:
    1px 1px #ddd,
    1px -1px #ddd,
    -1px 1px #ddd,
    -1px -1px #ddd;
  background: ${props => props.color };
  height: 100%;
`

const Button = ({ handleClick, color }) => (
  <ButtonOuter onClick={ handleClick }>
    <ButtonInner color={ color } />
  </ButtonOuter>
)

const Popover = styled.div`
  position: absolute;
  z-index: 2;
`

const Overlay = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`

const PickerContainer = styled.div`
  display: flex;

  > input {
    border: 2px solid #444;
    border-right: none;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    font-size: 0.9rem;
    padding: 0 5px;
    width: 100px;
  }
`

// required props: onChange[func: (colorStr) => {...}], value[colorStr], name[str]
const ColorPicker = ({ value, name, onChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [color, setColor] = React.useState(value)

  const handleInputChange = e => {
    setColor(e.target.value)
  }

  React.useEffect(() => {
    if (color !== value) onChange(color)
  }, [ color, onChange, value ])

  return (
    <PickerContainer {...props}>
      <input name={ name } value={ color } onChange={ handleInputChange } />
      <Button color={ color } handleClick={ () => setIsOpen(!isOpen) } />
      { isOpen ? (
        <Popover>
          <Overlay onClick={() => setIsOpen(false)} />
          <ChromePicker onChangeComplete={ color => setColor(color.hex) } color={ color } />
        </Popover>
      ) : "" }
    </PickerContainer>
  )
}

export default ColorPicker
