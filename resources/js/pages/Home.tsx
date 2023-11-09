import { Head, router, usePage } from "@inertiajs/react";

import { JobSearchFields, JobSearchResult, ReedSearchResponse } from "../types";

import App from "../components/App";
import { meta } from "../../content/content.json";

import JobSearchForm, {
    restoreSearchFields,
} from "../components/JobSearchForm";
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
    const source = useRef(restoreItem("source", ""));

    const pageNum = useRef(restoreItem("pageNum", 1));

    const handleStatus = useCallback(
        (status: string, src: string, direction?: string) => {
            const totalNumberOfPages =
                !results || results.totalResults === 0
                    ? 0
                    : (results.totalResults / 25).toString().includes(".")
                    ? +(results.totalResults / 25).toFixed()
                    : results.totalResults / 25;

            setStatus(status);

            if (src === "search") {
                pageNum.current = 1;

                router.remember("status", status);
                router.remember("source", src);
                router.remember(pageNum.current, "pageNum");
            }

            if (src === "page") {
                const searchFields = restoreSearchFields() as JobSearchFields;

                const pagination =
                    direction === "next"
                        ? pageNum.current + 1
                        : pageNum.current - 1;

                if (
                    !searchFields ||
                    pagination > totalNumberOfPages ||
                    pagination < 1
                ) {
                    setStatus("ready");
                    source.current = "";

                    router.remember("status", "ready");
                    router.remember("source", src);
                    return;
                }

                pageNum.current = pagination;

                let resultsToSkip = router.restore("resultsToSkip") as number;

                !resultsToSkip
                    ? (resultsToSkip = 25)
                    : direction === "next"
                    ? (resultsToSkip += 25)
                    : (resultsToSkip -= 25);

                searchFields.resultsToSkip = resultsToSkip;

                if (searchFields.query.includes("resultsToSkip")) {
                    searchFields.query = searchFields.query.slice(
                        0,
                        searchFields.query.lastIndexOf("&")
                    );
                }

                searchFields.query += "&resultsToSkip=" + resultsToSkip;

                router.remember(JSON.stringify(searchFields), "searchFields");
                router.remember(true, "minimiseForm");
                router.remember(pageNum.current, "pageNum");
                router.remember(resultsToSkip, "resultsToSkip");

                router.post("/", searchFields);
            }
        },
        [status, results]
    );

    const onLoad = setTimeout(() => {
        clearTimeout(onLoad);
        if (results && status === "pending") setStatus("ready");
    }, 1500);

    return (
        <App
            jobSearchResponse={results}
            status={status}
            pageNum={pageNum.current}
            handleStatus={handleStatus}
        >
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
