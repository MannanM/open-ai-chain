import * as React from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { FormValues, largeInput, mediumInput, QueryType, smallInput } from "./Model";
import { CodeBlock } from "./CodeBlock";

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
    const onSubmit = (data: FormValues) => console.log(data);
    renderCount++;

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input style={mediumInput} {...register("apiKey")} placeholder="Your API Key"/>
                {fields.map((field, index) => {
                    return (
                        <div key={field.id}>
                            <section className={"section"} key={field.id}>
                                <select
                                    {...register(`queries.${index}.type` as const, {
                                        required: true
                                    })}
                                    style={smallInput}
                                    className={errors?.queries?.[index]?.type ? "error" : ""}
                                    defaultValue={field.type}>
                                    <option value={QueryType.List}>List</option>
                                    <option value={QueryType.Detail} disabled={index === 0}>Detail</option>
                                    <option value={QueryType.Image} disabled={index === 0}>Image</option>
                                </select>
                                <input
                                    placeholder="query"
                                    type="text"
                                    {...register(`queries.${index}.query` as const, {
                                        required: true
                                    })}
                                    style={largeInput}
                                    className={errors?.queries?.[index]?.query ? "error" : ""}
                                    defaultValue={field.query}
                                />
                                <input
                                    placeholder="variable"
                                    type="text"
                                    {...register(`queries.${index}.variable` as const, {
                                        required: true
                                    })}
                                    className={errors?.queries?.[index]?.variable ? "error" : ""}
                                    style={smallInput}
                                    defaultValue={field.variable}
                                />
                                <button
                                    type="button"
                                    style={smallInput}
                                    onClick={() => remove(index)}
                                    disabled={index === 0}
                                >
                                    🗑️ Delete
                                </button>
                            </section>
                        </div>
                    );
                })}

                <button
                    type="button"
                    style={smallInput}
                    onClick={() =>
                        append({
                            type: QueryType.List,
                            query: 'What is the name of the top 5 trending food dishes?',
                            variable: 'dish'
                        })
                    }
                >
                    ➕ Add
                </button>
                {/*<input type="submit"/>*/}
                <Total control={control}/>
            </form>
        </div>
    );
}
