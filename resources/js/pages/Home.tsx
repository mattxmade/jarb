import { Head, router, usePage } from "@inertiajs/react";

import { JobSearchFields, JobSearchResult, ReedSearchResponse } from "../types";

import App from "../components/App";
import { meta } from "../../content/content.json";

import JobSearchForm from "../components/JobSearchForm";
import useLoadscreen from "../hooks/useLoadscreen";
import { useCallback, useRef, useState } from "react";

type AppProps = {
    jobDetailsResponse?: any;
    searchResponse?: ReedSearchResponse;
};

const restoreItem = (key: string, fallback: any) => {
    const item = router.restore(key);
    return typeof item === "string" ? JSON.parse(item) : fallback;
};

export default function Home(props: AppProps) {
    useLoadscreen();

    const { errors } = usePage().props;

    if (props.searchResponse) {
        localStorage.setItem(
            "searchResults",
            JSON.stringify(props.searchResponse)
        );
    }

    const resultsJson = localStorage.getItem("searchResults");
    const resultsCache: ReedSearchResponse =
        resultsJson && JSON.parse(resultsJson);

    const results = props.searchResponse || resultsCache || undefined;

    const [status, setStatus] = useState(() => restoreItem("status", "ready"));

    const handleStatus = useCallback(
        (status: string) => {
            setStatus(status);
            router.remember("status", status);
        },
        [status]
    );

    const onLoad = setTimeout(() => {
        clearTimeout(onLoad);
        if (results && status === "pending") setStatus("ready");
    }, 1000);

    return (
        <App jobSearchResponse={results} status={status}>
            <Head>
                <title>{meta.title}</title>
                <meta name={meta.name} content={meta.content} />
            </Head>
            <JobSearchForm
                searchResponse={results}
                handleStatus={handleStatus}
            />
        </App>
    );
}
