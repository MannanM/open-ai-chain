import * as React from "react";
import { FormValues, QueryType } from "./Model";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';

export const CodeBlock = (props: FormValues) => {
    console.log(props.apiKey)

    const start = props.queries.map((value, index) => {

        const trueIndent = props.queries
            .filter((value2, index2) => value2.type === QueryType.List && index2 < index)
            .length
        const space = ' '.repeat(trueIndent * 4)
        const smallSpace = ' '.repeat(trueIndent)

        if (value.type === QueryType.List) {
            return `${space}${value.variable}_results=$(AiText "${value.query} Write the results in a json array containing only strings." array)
${space}for ${value.variable}_row in $(echo "$${value.variable}_results"); do
${space}    ${value.variable}=$(echo "$${value.variable}_row" | base64 --decode -i)
${space}    echo "${smallSpace}- $${value.variable}"

`
        } else if (value.type == QueryType.Detail) {
            return `${space}${value.variable}_results=$(AiText "${value.query}")
${space}${value.variable}=$(echo "$${value.variable}_results" | tr '\\r\\n' ' ' | awk '{$1=$1};1')
${space}echo "${smallSpace}- $${value.variable}"

`
        } else {
            return `${space}TEMP=""
${space}${value.variable}=$(echo "\${TEMP// /_}.png")
${space}AiImage "${value.query}" "$${value.variable}"
${space}echo "${smallSpace} - Generated Image"

`
        }
    }).join('')

    const jqArgList = props.queries.map((value, index) => {
        return `--arg ${value.variable} "$${value.variable}"`
    }).join(' ')

    //todo: fix spacing
    const midSpace = ' '.repeat((props.queries.length - 1) * 4);

    const jqField = props.queries
        .filter(value => value.type === QueryType.List)
        .map((value) => `[$${value.variable}]`)
        .join('')

    const jqValue = props.queries
        .filter(value => value.type !== QueryType.List)
        .map((value) => `"${value.variable}": $${value.variable}`)
        .join()

    const end = props.queries.map((value, index) => {
        if (value.type != QueryType.List) {
            return ''
        }
        const trueIndent = props.queries
            .filter((value2, index2) => value2.type === QueryType.List && index2 < index)
            .length
        const space = ' '.repeat(trueIndent * 4)
        return `${space}done
`
    }).reverse().join('')

    const codeString = `

function AiText() {
    local promptval="{\\"model\\": \\"text-davinci-003\\", \\"prompt\\": \\"$1\\", \\"temperature\\": 0, \\"max_tokens\\": 500}"
    echo "$promptval" >> prompt_log.txt

    local retval=$(curl https://api.openai.com/v1/completions -s \\
        -H "Content-Type: application/json; charset=utf-8" \\
        -H "Authorization: Bearer ${props.apiKey}" \\
        --data-ascii "$promptval")
    echo "$retval" >> response_log.txt
    if [ ! -z $2 ]; then
        echo "$retval" | jq -r '.choices[0].text | fromjson | .[] | @base64'
    else
        echo "$retval" | jq -r '.choices[0].text'
    fi
}

function AiImage() {
    local promptval="{ \\"prompt\\": \\"$1\\", \\"n\\": 1, \\"size\\": \\"1024x1024\\" }"
    echo "$promptval" >> prompt_log.txt
    local json=$(curl https://api.openai.com/v1/images/generations -s \\
        -H "Content-Type: application/json" \\
        -H "Authorization: Bearer ${props.apiKey}" \\
        --data-ascii "$promptval")
    echo "$json" >> response_log.txt
    local url=$(echo "$json" | jq -r '.data[0].url')
    curl --output "$2" -s "$url"
}

OUTPUT="{}"
${start}${midSpace}TEMP=$(echo "$OUTPUT" | jq \\
${midSpace}         ${jqArgList} \\
${midSpace}         '.results${jqField} += [{${jqValue}}]')
${midSpace}OUTPUT="$TEMP"
${end}
echo "$OUTPUT" > results.json
echo "Completed"
`
    return <>
        <SyntaxHighlighter showLineNumbers={true} style={docco}>
            {codeString}
        </SyntaxHighlighter>
        <button onClick={() => navigator.clipboard.writeText(codeString)}>
            Copy to Clipboard
        </button>
    </>;
};
