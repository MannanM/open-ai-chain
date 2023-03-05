import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, Col, ProgressBar, Row, Table } from "react-bootstrap";
import { FormValues, Query, QueryType, StringMap } from "./Model";
import { Download } from "./Download";

export const Execute = (
    {data, executing, callback}: { data: FormValues, executing: boolean, callback: (value: boolean) => void }) => {

    const [results, setResults] = useState<StringMap[]>([]);
    const [error, setError] = useState<React.ReactNode | null>(null);
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

    function getResponsePromise(query: Query, prompt: string): Promise<string> {
        const localStorageKey = prompt;
        const item = localStorage.getItem(localStorageKey);
        if (item) {
            console.log('resolved from config ' + localStorageKey)
            return Promise.resolve(item)
        }
        return fetch('https://api.openai.com/v1/completions', {
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
            if (result.ok) {
                return result.json().then(json => {
                    const resultText = json.choices[0].text;
                    localStorage.setItem(localStorageKey, resultText);
                    return resultText;
                })
            } else {
                result.json().then(json => {
                    setError(<>
                        Received error from Open AI status: {result.status}, body:
                        <pre>{JSON.stringify(json)}</pre>
                    </>);
                    setProgress(0);
                    callback(false);
                });
                throw new Error('Something went wrong!')
            }
        })
    }

    async function extracted(vars: StringMap, query: Query, index: number): Promise<StringMap[]> {
        let prompt = replaceFunction(query.query, vars);
        if (query.type == QueryType.List) {
            prompt = prompt + ' Write the results in a json array containing only strings.'
        }

        const results = await getResponsePromise(query, prompt).then(json => {
            if (query.type == QueryType.List) {
                return JSON.parse(json);
            } else {
                return json;
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
            setProgress(0);
            callback(false);
        }

        if (data.queries.length > 0 && executing && progress === 0) {
            localStorage.setItem('api-key', data.apiKey);
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
        <Row className="mb-3">
            <Col>
                <h1>Results</h1>
            </Col>
            <Col>
                <Download results={results} queries={data.queries} />
            </Col>
        </Row>
        {progress > 0 && progress < 100 ?
            <Row className="mb-3">
                <Col>
                    <ProgressBar variant="success" animated now={progress}/>
                </Col>
            </Row> : null
        }
        {results.length ?
            <Row className="mb-3">
                <Col>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            {
                                Object
                                    .entries(results[0])
                                    .map(([name, value], n: number) => <th
                                        style={{textTransform: "capitalize"}}
                                        key={`content_header_${n}`}>{name.replaceAll('_', ' ')}</th>
                                    )
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
            </Row> : null
        }
    </>;
};