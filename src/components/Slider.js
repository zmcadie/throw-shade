import React from 'react'
import styled from 'styled-components'

const SliderComponent = styled.div.attrs(props => ({
  style: {
    background: props.background,
  }
}))`
  border: 2px solid #444;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
  display: inline-block;
  height: 30px;
  position: relative;
  width: 200px;
`

const SliderMarker = styled.div.attrs(props => ({
  style: {
    left: `${props.value}%`
  }
}))`
  bottom: 0;
  position: absolute;
  top: 0;
  width: 0;

  &::before, &::after {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    content: "";
    height: 0;
    left: -10px;
    position: absolute;
  }

  &::before {
    border-top: 15px solid #444;
    bottom: 80%;
  }

  &::after {
    border-bottom: 15px solid #444;
    top: 80%;
  }
`

const SliderContainer = styled.div`
  display: flex;
  height: 34px;
  margin: 5px 0;

  > input {
    border: 2px solid #444;
    border-right: none;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    font-size: 0.9rem;
    padding: 0 5px;
    width: 30px;
  }
`

const Slider = ({
  value = 10,
  range = [1, 99],
  step = 1,
  name = "",
  background = "linear-gradient(to right, black, white)",
  ...props
}) => {
  const [controlledValue, setControlledValue] = React.useState(value)

  const getMarkerPosition = React.useCallback(() => {
    if (controlledValue >= range[0] && controlledValue <= range[1]) {
      return (controlledValue - range[0]) / (range[1] - range[0]) * 100
    }
    return controlledValue > range[0] ? 100 : 0
  }, [ controlledValue, range ])

  const getNewPosition = e => {
    const bounds = e.target.getBoundingClientRect()
    return Math.round(((e.clientX - bounds.x) / bounds.width * (range[1] - range[0]) + range[0]))
  }

  const handleClick = e => {
    e.preventDefault()
    const newValue = getNewPosition(e)
    if (Number.isInteger(newValue)) setControlledValue(newValue)
  }

  const handleMouseMove = e => {
    e.preventDefault()
    const newValue = getNewPosition(e)
    if (Number.isInteger(newValue)) setControlledValue(newValue)
  }

  const handleMouseUp = e => {
    e.preventDefault()
    e.currentTarget.onmousemove = ""
    e.currentTarget.onmouseup = ""
  }

  const handleMouseDown = e => {
    e.preventDefault()
    const newValue = getNewPosition(e)
    if (Number.isInteger(newValue)) setControlledValue(newValue)
    e.currentTarget.onmousemove = handleMouseMove
    e.currentTarget.onmouseup = handleMouseUp
  }
  
  return (
    <SliderContainer {...props}>
      <input
        name={ name }
        type="number"
        min={ range[0] }
        max={ range[1] }
        value={ controlledValue }
        onChange={ e => setControlledValue(e.target.value) }
      />
      <SliderComponent
        background={ background }
        onClick={ handleClick }
        onMouseDown={ handleMouseDown }
      >
        <SliderMarker value={ getMarkerPosition() } />
      </SliderComponent>
    </SliderContainer>
  )
}

export default Slider
