import * as React from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { FormValues, QueryType } from "./Model";
import { CodeBlock } from "./CodeBlock";

let renderCount = 0;

const Total = ({control}: { control: Control<FormValues> }) => {
    const queries = useWatch({name: "queries", control});
    const apiKey: string = useWatch({name: "apiKey", control});
    return <CodeBlock apiKey={apiKey} queries={queries} />;
};

export default function App2() {
    const {
        register,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<FormValues>({
        defaultValues: {
            queries: [{
                type: QueryType.List,
                query: 'What are the most popular cities in Colombia for tourists?',
                variable: 'cities'
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
                <input {...register("apiKey")} placeholder="Your API Key"/>
                {fields.map((field, index) => {
                    return (
                        <div key={field.id}>
                            <section className={"section"} key={field.id}>
                                <select
                                    {...register(`queries.${index}.type` as const, {
                                        required: true
                                    })}
                                    className={errors?.queries?.[index]?.type ? "error" : ""}
                                    defaultValue={field.type}>
                                    <option value={QueryType.List}>List</option>
                                    <option value={QueryType.Detail}>Detail</option>
                                    <option value={QueryType.Image}>Image</option>
                                </select>
                                <input
                                    placeholder="query"
                                    type="text"
                                    {...register(`queries.${index}.query` as const, {
                                        required: true
                                    })}
                                    className={errors?.queries?.[index]?.query ? "error" : ""}
                                    defaultValue={field.query}
                                />
                                <input
                                    placeholder="value"
                                    type="text"
                                    {...register(`queries.${index}.variable` as const, {
                                        required: true
                                    })}
                                    className={errors?.queries?.[index]?.variable ? "error" : ""}
                                    defaultValue={field.variable}
                                />
                                <button type="button" onClick={() => remove(index)}>
                                    DELETE
                                </button>
                            </section>
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={() =>
                        append({
                            type: QueryType.List,
                            query: 'What is the name of the top 5 trending food dishes?',
                            variable: 'dish'
                        })
                    }
                >
                    APPEND
                </button>
                <input type="submit"/>



                <Total control={control}/>
            </form>
        </div>
    );
}
