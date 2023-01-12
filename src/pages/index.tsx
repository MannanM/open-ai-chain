import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import App from "../components/App";
import { Main } from "../components/layout/Main";

import 'bootstrap/dist/css/bootstrap.min.css';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Main>
        <App />
    </Main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>open-ai-chain | Automating tasks using OpenAi.com</title>
