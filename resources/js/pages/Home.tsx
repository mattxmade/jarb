import { Head, usePage } from "@inertiajs/react";

import { JobSearchFields, JobSearchResult, ReedSearchResponse } from "../types";

import App from "../components/App";
import { meta } from "../../content/content.json";

import JobSearchForm from "../components/JobSearchForm";
import useLoadscreen from "../hooks/useLoadscreen";

type AppProps = {
    jobDetailsResponse?: any;
    searchResponse?: ReedSearchResponse;
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

    return (
        <App jobSearchResponse={results}>
            <Head>
                <title>{meta.title}</title>
                <meta name={meta.name} content={meta.content} />
            </Head>
            <JobSearchForm searchResponse={results} />
        </App>
    );
}
