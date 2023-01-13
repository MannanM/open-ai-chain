import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import JSONData from "../../../content/colombia/results.json"
import { Main } from "../../components/layout/Main";
import { Col, Row, Table } from "react-bootstrap";
import { graphql } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

export const pageQuery = graphql`{
  allFile(filter: {
    relativeDirectory: {eq: "colombia/files"}
  }) {
    edges {
      node {
        childImageSharp {
          fluid {
            originalName
          }
          gatsbyImageData
        }
      }
    }
  }
}`

function extractImage(value: any, imageData: any[]) {
    if (value.toString().startsWith('file://')) {
        const fileName = value.substring(13)
        const image = imageData.find(xy => xy.fluid.originalName === fileName)
        if (image) {
            return <GatsbyImage image={image.gatsbyImageData} alt={fileName}/>
        }
        return fileName
    }
    return value
}

interface FileDataProps {
    data: {
        allFile: {
            edges: {
                node: {
                    childImageSharp: {
                        fluid: {
                            originalName: string
                        },
                        gatsbyImageData: IGatsbyImageData
                    }
                }
            }[]
        }
    }
}

// @ts-ignore
const IndexPage: React.FC<PageProps> = ({data} : FileDataProps) => {
    const imageData = data.allFile.edges.map(x => x.node.childImageSharp)
    return (
        <Main>
            <Row>
                <Col>
                    <h1>Popular tourist destinations in Colombia</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            {
                                Object
                                    .entries(JSONData.results[0])
                                    .map(([name, value], n: number) => <th key={`content_header_${n}`}>{name}</th>)
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {JSONData.results.map((data, index) => {
                            const cells = Object.entries(data).map(([name, value], n: number) => {
                                return <td key={`content_item_${index}_${n}`}>
                                    {extractImage(value, imageData)}
                                </td>
                            })
                            return <tr key={`content_item_${index}`}>{cells}</tr>;
                        })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Main>
    )
}

export default IndexPage

export const Head: HeadFC = () => <title>open-ai-chain | Popular tourist destinations in Colombia</title>
