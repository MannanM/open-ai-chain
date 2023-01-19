import * as React from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { FormValues, QueryType } from "./Model";
import { CodeBlock } from "./CodeBlock";
import { Accordion, Button, ButtonGroup, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FieldErrors } from "react-hook-form/dist/types/errors";
import { useState } from "react";
import { Execute } from "./Execute";

let renderCount = 0;

const Total = ({control}: { control: Control<FormValues> }) => {
    const queries = useWatch({name: "queries", control});
    const apiKey: string = useWatch({name: "apiKey", control});

    return <Accordion>
        <Accordion.Item eventKey="0">
            <Accordion.Header>Code Generation - Bash Shell Script</Accordion.Header>
            <Accordion.Body>
                <CodeBlock apiKey={apiKey} queries={queries}/>
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>;
};

export default function App() {
    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<FormValues>({
        defaultValues: {
            apiKey: localStorage.getItem('api-key') || '',
            queries: [{
                type: QueryType.List,
                query: 'What are the names of the five most popular cities to visit in Colombia for tourists?',
                variable: 'city'
            }, {
                type: QueryType.List,
                query: 'What are the name of the two most famous food dishes in the city of $city in Colombia?',
                variable: 'dish'
            }, {
                type: QueryType.Detail,
                query: 'Write a paragraph from a popular travel blog about why you must try the famous food dish \'$dish\' from the city of $city in Colombia?',
                variable: 'blog'
            }, {
                type: QueryType.Detail,
                query: 'Briefly describe the physical appearance of the famous food dish $dish from the city of $city in Colombia?',
                variable: 'appearance'
            }, {
                type: QueryType.Image,
                query: '$appearance, high contrast on the food, 50mm, photography',
                variable: 'image'
            }]
        },
        mode: "onBlur"
    });
    const {fields, append, remove} = useFieldArray({
        name: "queries",
        control
    });

    const [executeQueries, setExecuteQueries] = useState<FormValues>({apiKey: '', queries: []})
    const [executing, setExecuting] = useState<boolean>(false)

    const onSubmit = (data: FormValues) => {
        setExecuteQueries(data);
        setExecuting(true);
    };

    const onError = (error: FieldErrors<FormValues>) => {
        console.log("ERROR:::", error);
    };
    renderCount++;

    return (<>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit(onSubmit, onError)}>
                        <fieldset disabled={executing}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Open AI API Key</InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    placeholder="Your Open AI API Key"
                                    {...register("apiKey", {required: true})}
                                />
                                <Button
                                    onClick={() => window.open("https://beta.openai.com/account/api-keys", "_blank")}
                                >
                                    🔎
                                </Button>
                            </InputGroup>
                            {fields.map((field, index) => {
                                return (
                                    <InputGroup key={field.id} className="mb-3">
                                        <Form.Select
                                            style={{width: '10%'}}
                                            {...register(`queries.${index}.type` as const)}
                                            className={errors?.queries?.[index]?.type ? "error" : ""}
                                            defaultValue={field.type}>
                                            <option value={QueryType.List}>List</option>
                                            <option value={QueryType.Detail} disabled={index === 0}>Detail</option>
                                            <option value={QueryType.Image} disabled={index === 0}>Image</option>
                                        </Form.Select>
                                        <Form.Control
                                            style={{width: '70%'}}
                                            placeholder="query"
                                            type="text"
                                            {...register(`queries.${index}.query` as const, {
                                                required: true
                                            })}
                                            className={errors?.queries?.[index]?.query ? "error" : ""}
                                            defaultValue={field.query}
                                        />
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control
                                            style={{width: '10%'}}
                                            placeholder="variable"
                                            type="text"
                                            {...register(`queries.${index}.variable` as const, {
                                                required: true
                                            })}
                                            className={errors?.queries?.[index]?.variable ? "error" : ""}
                                            defaultValue={field.variable}
                                        />
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => remove(index)}
                                            disabled={index === 0}
                                        >
                                            🗑️
                                        </Button>
                                    </InputGroup>
                                );
                            })}

                            <ButtonGroup aria-label="Basic example" className="mb-3">
                                <Button
                                    variant="outline-primary"
                                    onClick={() =>
                                        append({
                                            type: QueryType.List,
                                            query: 'What is the name of the top 5 trending food dishes?',
                                            variable: 'dish'
                                        })
                                    }
                                >
                                    ➕ Add
                                </Button>
                                <Button variant="primary" type="submit">
                                    🏃 Execute
                                </Button>
                            </ButtonGroup>
                        </fieldset>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Execute data={executeQueries} executing={executing} callback={setExecuting}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Total control={control}/>
                </Col>
            </Row>
        </>
    );
}
