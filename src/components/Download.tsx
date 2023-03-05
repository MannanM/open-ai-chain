import React from "react";
import { Button } from "react-bootstrap";
import { Query, StringMap } from "./Model";

type DownloadProps = {
    results: StringMap[]
    queries: Query[]
}

export const Download = ({results, queries}: DownloadProps) => {
    function extracted() {
        const contents = JSON.stringify({queries, results}, null, 2);
        const element = document.createElement("a");
        const file = new Blob([contents], {type: "text/json"});
        element.href = URL.createObjectURL(file);
        element.download = "results.json";
        // Required for this to work in FireFox
        document.body.appendChild(element);
        element.click();
    }

    return <Button className="float-end" variant="outline-success" onClick={extracted}>
        📄 Download
    </Button>;
}
