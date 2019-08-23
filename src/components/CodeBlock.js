import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeBlock = ({ codeString }) => (
  <SyntaxHighlighter language="javascript" style={xonokai}>
    {codeString}
  </SyntaxHighlighter>
)

export default CodeBlock