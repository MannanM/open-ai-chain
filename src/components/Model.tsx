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

export type StringMap = {
    [key: string]: string;
};
