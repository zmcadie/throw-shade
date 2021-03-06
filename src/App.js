import React, { useState, useEffect } from "react"
import styled from "styled-components"
import uuid from "uuid/v4"

import ShadeDemo from "./components/ShadeDemo"
import BlendDemo from "./components/BlendDemo"
import DIYDemo from "./components/DIYDemo"
import CodeBlock from "./components/CodeBlock"

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr auto;
  height: 100vh;
  width: 100vw;
`

const Sidebar = styled.div`
  background: #663C6D;
  color: #f8f8f8;
  margin: 0;
  padding: 20px;
`

const StyledSidebarSection = styled.div`
  
`

const SidebarTitle = styled.h3`
  align-content: center;
  cursor: default;
  display: flex;
  justify-content: space-between;

  > svg {
    transform: ${ p => p.isOpen ? "rotate(90deg)" : "rotate(-90deg)" };
    transition: transform 250ms;
  }

  &:hover > svg {
    transform: scale(1.25) ${ p => p.isOpen ? "rotate(90deg)" : "rotate(-90deg)" };
  }
`

const SidebarActionsContainer = styled.ul`
  list-style: none;
  height: ${ p => p.isOpen ? "100%" : "0" };
  margin: 0;
  overflow: hidden;
  padding: 0 0 0 10px;
`

const SidebarAction = styled.li`
  color: ${p => p.selected ? "#84C68C" : "inherit"};
  cursor: pointer;
  padding: 10px 0;

  &:hover {
    color: #84C68C;
  }
`

const ContentContainer = styled.div`
  background: #f8f8f8;
  box-sizing: border-box;
  height: 100%;
  overflow-y: scroll;
  padding: 50px;
  width: 100%;
`

const StyledSvg = styled.svg`
  display: inline-block;
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 0;
`

const DownArrow = () => (
  <StyledSvg height="20" width="20" viewBox="0 0 20 20">
    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
  </StyledSvg>
)

const SidebarSection = ({ title, pages }) => {
  const [ isOpen, setIsOpen ] = useState(true)
  return (
    <StyledSidebarSection>
      <SidebarTitle isOpen={ isOpen } onClick={ () => setIsOpen(!isOpen) }>{ title }<DownArrow /></SidebarTitle>
      <SidebarActionsContainer isOpen={ isOpen }>
      {/* .map(p => ({ label: p.label, action: () => window.location = `#${p.slug}` })) } */}
        { pages.map(p => <SidebarAction key={ uuid() } selected={ window.location.hash.slice(1) === p.slug } onClick={ () => window.location = `#${p.slug}` }>{ p.label }</SidebarAction>) }
      </SidebarActionsContainer>
    </StyledSidebarSection>
  )
}

const demos = [
  {
    label: "Lighten and Darken",
    slug: "lighten-and-darken",
    Comp: ShadeDemo
  }, {
    label: "Blend Colors",
    slug: "blend-colors",
    Comp: BlendDemo
  }, {
    label: "DIY",
    slug: "diy",
    Comp: DIYDemo
  }
]

const pages = [ ...demos ]

const getPage = () => {
  const hash = window.location.hash
  const page = hash ? pages.find(p => p.slug === hash.slice(1)) : pages[0]
  return page
}

const App = () => {
  const [ page, setPage ] = useState(getPage())

  useEffect(() => {
    const handleHashChange = () => setPage(getPage())
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  })

  return (
    <AppContainer>
      <Sidebar>
        <SidebarSection
          title="Demos"
          pages={ demos }
        />
      </Sidebar>
      <ContentContainer>
        <page.Comp />
      </ContentContainer>
      { page.code ? <CodeBlock codeString={page.code} /> : "" }
    </AppContainer>
  )
}

export default App;
