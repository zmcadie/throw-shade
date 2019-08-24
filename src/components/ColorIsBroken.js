import React from "react"
import styled from "styled-components"
import uuid from "uuid/v4"

import { SmoothGradient } from './BlendDemo'
import { blend } from '../colorUtils'

const ColorIsBroken = () => (
  <div style={{ lineHeight: "1.5rem" }}>
    <h1>Colour is Broken</h1>
    <br />
    <p>
      Okay, colour isn't broken. Sorry.
      <br /><br />
      Computers <i>are</i> lazy though!
      <br />
      This means that when you tell your computer to manipulate a colour it does it badly.
      <br /><br />
      Here's an example:
    </p>
    <SmoothGradient c1="#FF0000" c2="#00FF00" log={ false } />
    <p>
      What is that?
      <br /><br />
      Pretty sure mixing red light and green light shouldn't return whatever that brown sludge in the middle is.
      <br /><br />
      Hmmm...
      <br /><br />
      Let's see what it's supposed to look like:
    </p>
    <SmoothGradient c1="#FF0000" c2="#00FF00" />
    <p>
      That looks a little better!
      <br /><br />
      Let's break it down a bit and just look at the midpoint of each:
    </p>
    <div style={{ display: "flex" }}>
      <div style={{ height: "50px", width: "250px", background: blend("#FF0000", "#00FF00", 0.5, false) }} />
      <div style={{ height: "50px", width: "250px", background: blend("#FF0000", "#00FF00") }} />
    </div>
    <p>
      That's a pretty big difference!
      <br /><br />
      The first example is how most computer programs approach blending colours and the second is how they <b><i>should</i></b> approach blending colours.
      <br /><br />
      So what's going on? Why don't they do it properly? The short answer is math. The long answer is <i>maaaaaaaaath</i>.
      <br /><br />
      Sorry. Bad joke.
      <br /><br />
      The actual answer is that the way we tell computers what colour something is is limited.
      There's a few ways to do it but the typical way we represent colours is with three numbers, each on a scale from 0 to 255,
      each representing the amount of either red, green, or blue light in the colour. This method is a rough approximation of how our eyes process light and colour.
      I'll go into more detail later but the root of the problem is that what these numbers represent isn't actually the level of their respective wavelengths.
      These numbers actually represent much larger numbers that themselves are a much better approximation of the wavelengths they represent.
      <br /><br />
      Since these numbers are only approximate we won't get the correct value when we try blend them.
      Instead we have to take the time to calculate what they represent before we try any funny business.
      Unfortunately most software is lazy and skips that step.
    </p>
    <p>Lazy:</p>
    <SmoothGradient c1="#FF0000" c2="#00FF00" log={ false } />
    <p>Correct:</p>
    <SmoothGradient c1="#FF0000" c2="#00FF00" />
    <p>
      Let's just do things properly. They look better that way.
    </p>
  </div>
)

export default ColorIsBroken