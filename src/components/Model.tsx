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


function getFoo(width: number) {
    return {
        padding: '10px',
        margin: '10px 5px',
        border: '2px solid #eee',
        borderRadius: '10px',
        // border: '0',
        boxShadow: '0 0 15px 4px rgba(0,0,0,0.06)',
        width: width + 'px',
    };
}

export const smallInput = getFoo(100)
export const mediumInput = getFoo(400)
export const largeInput = getFoo(800)
