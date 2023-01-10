import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import App from "../components/App";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main>
      <h1>
        open-ai-chain
      </h1>
      <App />
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>open-ai-chain | Automating tasks using OpenAi.com</title>
