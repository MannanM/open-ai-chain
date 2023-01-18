export enum QueryType {
    List = "LIST",
    Detail = "DETAIL",
    Image = "IMAGE",
}

export type Query = {
    type: QueryType;
    variable: string;
    query: string;
}

export type FormValues = {
    apiKey: string;
    queries: Query[];
};
