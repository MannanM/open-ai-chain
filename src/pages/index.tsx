import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import App from "../components/App";
import { Main } from "../components/layout/Main";

import 'bootstrap/dist/css/bootstrap.min.css';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Main>
        <h1 className="mt-3 mb-3">Create your chain!</h1>
        <App />
    </Main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>open-ai-chain | Automating tasks using OpenAi.com</title>
