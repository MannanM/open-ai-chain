import * as React from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { FormValues, QueryType } from "./Model";
import { CodeBlock } from "./CodeBlock";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FieldErrors } from "react-hook-form/dist/types/errors";
import { useState } from "react";
import { Execute } from "./Execute";

let renderCount = 0;

const Total = ({control}: { control: Control<FormValues> }) => {
    const queries = useWatch({name: "queries", control});
    const apiKey: string = useWatch({name: "apiKey", control});
    return <CodeBlock apiKey={apiKey} queries={queries}/>;
};

export default function App() {
    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<FormValues>({
        defaultValues: {
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
                            <Form.Group className="mb-3" controlId="formApiKey">
                                <Form.Label>Open AI API Key</Form.Label>
                                <Form.Control
                                    placeholder="Your API Key"
                                    {...register("apiKey", {required: "Correo es obligatorio"})}
                                />
                                {errors.apiKey && (
                                    <Form.Text className="text-danger">
                                        {errors.apiKey.message}
                                    </Form.Text>
                                )}
                            </Form.Group>
                            {fields.map((field, index) => {
                                return (
                                    <Row key={field.id} className='gx-0'>
                                        <Col sm={1}>
                                            <Form.Select
                                                {...register(`queries.${index}.type` as const, {
                                                    required: true
                                                })}
                                                className={errors?.queries?.[index]?.type ? "error" : ""}
                                                defaultValue={field.type}>
                                                <option value={QueryType.List}>List</option>
                                                <option value={QueryType.Detail} disabled={index === 0}>Detail</option>
                                                <option value={QueryType.Image} disabled={index === 0}>Image</option>
                                            </Form.Select>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                placeholder="query"
                                                type="text"
                                                {...register(`queries.${index}.query` as const, {
                                                    required: true
                                                })}
                                                className={errors?.queries?.[index]?.query ? "error" : ""}
                                                defaultValue={field.query}
                                            />
                                        </Col>
                                        <Col sm={2}>
                                            <Form.Control
                                                placeholder="variable"
                                                type="text"
                                                {...register(`queries.${index}.variable` as const, {
                                                    required: true
                                                })}
                                                className={errors?.queries?.[index]?.variable ? "error" : ""}
                                                defaultValue={field.variable}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => remove(index)}
                                                disabled={index === 0}
                                            >
                                                🗑️
                                            </Button>
                                        </Col>
                                    </Row>
                                );
                            })}

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
                                Execute
                            </Button>
                        </fieldset>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Execute data={executeQueries} executing={executing} callback={setExecuting} />
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
