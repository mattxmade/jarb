import React, { useEffect, useRef, useState } from "react";
import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw"; // TODO => lazy-load Excalidraw
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

import { ReedSearchResponse } from "../types";
import useExcalidraw from "../hooks/useExcalidraw";

import content from "../../content/content.json";

type AppProps = {
    jobSearchResponse?: ReedSearchResponse;
    children?: React.ReactNode;
};

function App(props: AppProps) {
    const { setExcalidrawAPI, captureOnChange, handleTextSelection } =
        useExcalidraw();

    const jobSearchSectionRef = useRef<HTMLElement>(null);

    const [jobSectionVisibility, setJobSectionVisibility] = useState(
        window.innerWidth > 1203 ? true : false
    );

    const handleAriaControls = () => {
        window.innerWidth > 1203
            ? setJobSectionVisibility(true)
            : setJobSectionVisibility(false);
    };

    useEffect(() => {
        window.addEventListener("resize", handleAriaControls);

        return () => {
            window.removeEventListener("resize", handleAriaControls);
        };
    }, []);

    return (
        <div className="container">
            <button
                className="job-search--open"
                aria-controls="job-view"
                aria-expanded={jobSectionVisibility}
                onClick={() => {
                    jobSearchSectionRef.current &&
                        jobSearchSectionRef.current.classList.toggle(
                            "translate-in"
                        );
                    setJobSectionVisibility(true);
                }}
            >
                <i className="fa-solid fa-magnifying-glass-plus" />
            </button>

            <section
                id="job-view"
                ref={jobSearchSectionRef}
                className="section--job-view"
            >
                {/* <h1>{props?.user?.name ?? "____"}'s Job View</h1> */}
                <button
                    className="job-search--close"
                    aria-controls="job-view"
                    aria-expanded={jobSectionVisibility}
                    onClick={() => {
                        jobSearchSectionRef.current &&
                            jobSearchSectionRef.current.classList.toggle(
                                "translate-in"
                            );
                        setJobSectionVisibility(false);
                    }}
                >
                    <i className="fa-solid fa-circle-xmark job-search-toggle" />
                </button>

                {props.children}

                {props.jobSearchResponse?.results.length ? (
                    <>
                        <p className="search-results-total">
                            {props.jobSearchResponse.totalResults === 1
                                ? "1 result"
                                : `${props.jobSearchResponse.totalResults} results`}
                        </p>
                        <ul className="job-search-results">
                            {props.jobSearchResponse.results.map(
                                (jobSearchResult) => (
                                    <li
                                        key={jobSearchResult.jobId}
                                        className="job-result-card"
                                    >
                                        <h3
                                            className="job-result-card__job-title"
                                            onPointerUp={handleTextSelection}
                                        >
                                            {jobSearchResult.jobTitle}{" "}
                                            <span
                                                className="job-result-card__job-id"
                                                onPointerUp={
                                                    handleTextSelection
                                                }
                                            >
                                                {jobSearchResult.jobId}
                                            </span>
                                        </h3>

                                        <div className="job-result-card__posted-by-cont">
                                            <p
                                                onPointerUp={
                                                    handleTextSelection
                                                }
                                            >
                                                {jobSearchResult.date}{" "}
                                            </p>
                                            <p
                                                onPointerUp={
                                                    handleTextSelection
                                                }
                                            >
                                                {jobSearchResult.employerName}
                                            </p>
                                        </div>

                                        {jobSearchResult.minimumSalary &&
                                        jobSearchResult.maximumSalary ? (
                                            <p
                                                className="job-result-card__salary"
                                                onPointerUp={
                                                    handleTextSelection
                                                }
                                            >
                                                <i className="fa-solid fa-hand-holding-dollar" />{" "}
                                                {`£${jobSearchResult.minimumSalary}-£${jobSearchResult.maximumSalary}`}
                                            </p>
                                        ) : null}

                                        <p
                                            className="job-result-card__location"
                                            onPointerUp={handleTextSelection}
                                        >
                                            <i className="fa-solid fa-location-dot" />{" "}
                                            {jobSearchResult.locationName}
                                        </p>
                                        <p
                                            className="job-result-card__description"
                                            onPointerUp={handleTextSelection}
                                        >
                                            {jobSearchResult.jobDescription}
                                        </p>

                                        <div className="job-result-card__etc-details-cont">
                                            <p
                                                onPointerUp={
                                                    handleTextSelection
                                                }
                                            >
                                                Expires:{" "}
                                                {jobSearchResult.expirationDate}
                                            </p>
                                            <p
                                                onPointerUp={
                                                    handleTextSelection
                                                }
                                            >
                                                Applications:{" "}
                                                {jobSearchResult.applications}
                                            </p>
                                        </div>

                                        <p className="job-result-card__job-url">
                                            <a
                                                href={jobSearchResult.jobUrl}
                                                referrerPolicy="no-referrer"
                                            >
                                                more info
                                            </a>
                                        </p>
                                    </li>
                                )
                            )}
                        </ul>
                    </>
                ) : (
                    <div className="placeholder">
                        <p>
                            <i
                                role="presentation"
                                className="fa-solid fa-magnifying-glass-plus"
                            />{" "}
                            {props.jobSearchResponse &&
                            props.jobSearchResponse?.results.length === 0
                                ? "Your search returned 0 results"
                                : "Job search results will appear here..."}
                        </p>
                    </div>
                )}
            </section>

            <section className="note-view">
                {/* <h2>Note View</h2> */}

                <div className="note-view__editor">
                    <Excalidraw
                        ref={(api) =>
                            setExcalidrawAPI(api as ExcalidrawImperativeAPI)
                        }
                        onChange={captureOnChange}
                    >
                        <WelcomeScreen>
                            <WelcomeScreen.Center>
                                <WelcomeScreen.Center.Heading>
                                    {content.excalidraw.heading}
                                    <p>{content.excalidraw.subheading}</p>
                                </WelcomeScreen.Center.Heading>
                            </WelcomeScreen.Center>
                        </WelcomeScreen>
                    </Excalidraw>
                </div>
            </section>
        </div>
    );
}

export default App;
