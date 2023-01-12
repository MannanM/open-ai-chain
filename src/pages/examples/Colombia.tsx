import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import JSONData from "../../../content/colombia/results.json"
import { Main } from "../../components/layout/Main";

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Main>
            <div style={{maxWidth: `960px`, margin: `1.45rem`}}>
                <h1>Popular tourist destinations in Colombia</h1>
                <ul>
                    {JSONData.results.map((data, index) => {
                        // const phoo = data.attributes.map((data2, index2) => {
                        //     data[data2]
                        // }).join()
                        return <li key={`content_item_${index}`}>{'x'}</li>
                    })}
                </ul>
            </div>
        </Main>
    )
}

export default IndexPage

export const Head: HeadFC = () => <title>open-ai-chain | Automating tasks using OpenAi.com</title>
