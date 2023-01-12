export enum QueryType {
    List = "LIST",
    Detail = "DETAIL",
    Image = "IMAGE",
}

export type FormValues = {
    apiKey: string;
    queries: {
        type: QueryType;
        variable: string;
        query: string;
    }[];
};
