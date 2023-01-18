import { FormValues, Query, QueryType } from "./Model";
import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, Col, ProgressBar, Row, Table } from "react-bootstrap";

type StringMap = {
    [key: string]: string;
};

export const Execute = (
    {data, executing, callback}: { data: FormValues, executing: boolean, callback: (value: boolean) => void }) => {

    const [results, setResults] = useState<StringMap[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    function replaceFunction(prompt: string, vars: StringMap) {
        return prompt
            .split(/(\$[a-z]+)/g)
            .map(function (v) {
                if (v.startsWith('$')) {
                    return vars[v.substring(1)]
                }
                return v;
            })
            .join('');
    }

    async function extracted(vars: StringMap, query: Query, index: number): Promise<StringMap[]> {
        let prompt = replaceFunction(query.query, vars);
        if (query.type == QueryType.List) {
            prompt = prompt + ' Write the results in a json array containing only strings.'
        }

        const results = await fetch('https://api.openai.com/v1/completions', {
            headers: {
                'Authorization': `Bearer ${data.apiKey}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: prompt,
                temperature: 0,
                max_tokens: 500,
            })
        }).then(result => {
            console.log(result)
            if (result.ok) {
                return result.json()
            } else {
                result.json().then(json => {
                    setError(`Received error from OpenAI status:${result.status}, body:${json}`)
                });
            }
        }).then(json => {
            console.log(json)
            if (query.type == QueryType.List) {
                return JSON.parse(json.choices[0].text);
            } else {
                return json.choices[0].text;
            }
        });

        if (index === 0) {
            setProgress((0.5 / results.length) * 100);
        }

        if (index < data.queries.length - 1) {
            let resultArray: StringMap[] = []
            if (Array.isArray(results)) {
                for (let i = 0; i < results.length; i++) {
                    vars[query.variable] = results[i];
                    const items: StringMap[] = await extracted(vars, data.queries[index + 1], index + 1);
                    if (index === 0) {
                        console.log('Progress: ' + ((i + 1) / results.length) * 100);
                        setProgress(((i + 1) / results.length) * 100);
                    }
                    resultArray = resultArray.concat(items);
                }
                return resultArray;
            } else {
                vars[query.variable] = results;
                return await extracted(vars, data.queries[index + 1], index + 1);
            }
        }
        if (Array.isArray(results)) {
            return (results as string[]).map(result => {
                vars[query.variable] = result;
                return {...vars} as StringMap;
            })
        }
        vars[query.variable] = results;
        return [{...vars} as StringMap];
    }

    useEffect(() => {

        const fetchData = async () => {
            const vars: StringMap = {};
            const results = await extracted(vars, data.queries[0], 0);
            console.log(results);
            setResults(results);
            setProgress(100);
            callback(false);
        }

        if (data.queries.length > 0 && executing) {
            setResults([]);
            setProgress(2);
            setError(null);
            fetchData().catch(console.error);
        }
    }, [data, setResults, progress, executing, callback])

    if (error) {
        return <Alert variant="danger">
            <Alert.Heading>Sorry, something went wrong.</Alert.Heading>
            <p>
                An issue occurred, details are below.
            </p>
            <hr/>
            <p className="mb-0">
                {error}
            </p>
        </Alert>
    }

    if (results.length === 0 && !progress) {
        return <></>
    }

    return <>
        {progress < 100 &&
            <Row>
                <Col>
                    <ProgressBar variant="success" animated now={progress}/>
                </Col>
            </Row>
        }
        <Row>
            <Col>
                <h1>Results</h1>
            </Col>
        </Row>
        {results.length &&
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            {
                                Object
                                    .entries(results[0])
                                    .map(([name, value], n: number) => <th key={`content_header_${n}`}>{name}</th>)
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((data, index) => {
                            const cells = Object.entries(data).map(([name, value], n: number) => {
                                return <td key={`content_item_${index}_${n}`}>
                                    {value}
                                </td>
                            })
                            return <tr key={`content_item_${index}`}>{cells}</tr>;
                        })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        }
    </>;
};