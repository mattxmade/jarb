type JobResultsHeaderProps = {
    status: string;
    pageNum: number;
    totalResults: number;
    handleStatus: (status: string, source: string, direction: string) => void;
    children?: React.ReactNode;
} & JSX.IntrinsicElements["div"];

const styles = {
    container: {
        paddingRight: "2rem",
        display: "flex",
        justifyContent: "space-between",
    },
};

export default function JobResultsHeader({
    status,
    pageNum,
    totalResults,
    handleStatus,
    ...props
}: JobResultsHeaderProps) {
    return (
        <div
            {...props}
            className="job-search-results-header"
            style={styles.container}
        >
            <p className="search-results-total">
                {totalResults === 1 ? "1 result" : `${totalResults} results`}
            </p>

            <ul style={{ gap: "1rem", display: "flex" }}>
                <li>
                    <button
                        aria-label="previous page button"
                        onClick={() => {
                            handleStatus("pending", "page", "prev");
                        }}
                    >
                        <i
                            className="fa-solid fa-caret-left"
                            style={{
                                color:
                                    pageNum > 1 ? "black" : "rgba(0,0,0,0.4)",
                                cursor: pageNum > 1 ? "pointer" : "default",
                            }}
                        />
                    </button>
                </li>
                <li>
                    <p>
                        {pageNum} /{" "}
                        {totalResults === 0
                            ? 0
                            : (totalResults / 25).toString().includes(".")
                            ? +(totalResults / 25).toFixed()
                            : totalResults / 25}
                    </p>
                </li>
                <li>
                    <button
                        aria-label="next page button"
                        onClick={() => {
                            handleStatus("pending", "page", "next");
                        }}
                    >
                        <i className="fa-solid fa-caret-right" />
                    </button>
                </li>
            </ul>
        </div>
    );
}
