import { nanoid } from "nanoid";
import { router, usePage } from "@inertiajs/react";
import { useCallback, useRef, useState } from "react";

import {
    FormInputError,
    JobSearchFields,
    JobSearchResult,
    ReedSearchResponse,
} from "../types";

import { wordsFilter, isTextInputAaZz } from "../utils/inputValidators";

const restoreSearchFields = () => {
    const values = router.restore("searchFields");
    return typeof values === "string" ? JSON.parse(values) : values;
};

type AppProps = {
    jobDetailsResponse?: any;
    searchResponse?: ReedSearchResponse;
};

export default function JobSearchForm(props: AppProps) {
    const { errors } = usePage().props;

    const formRef = useRef<HTMLFormElement>(null);
    const [values, setValues] = useState<JobSearchFields>(restoreSearchFields);

    const [keywords, setKeywords] = useState("");
    const [locationName, setLocationName] = useState("");

    const [formErrorMessages, setFormErrorMessages] = useState<
        FormInputError[]
    >([]);

    const handleTextInput = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const input = event.target as HTMLInputElement;

            const setState =
                input.name === "keywords" ? setKeywords : setLocationName;

            isTextInputAaZz(input.value) ? setState(input.value) : null;

            const inputError: FormInputError = formErrorMessages.find(
                (formError) => formError[input.name] && formError
            ) ?? { input: input.name, errors: [] };

            // clear current input error messages
            setFormErrorMessages((prevErrors) =>
                [...prevErrors].filter((err) => err.input !== input.name)
            );

            // clear language input error message
            if (inputError.errors.includes("language")) {
                inputError.errors = [
                    ...inputError.errors.filter((err) => err !== "language"),
                ];
            }
        },
        [setKeywords, setLocationName, setFormErrorMessages]
    );

    const inputErrors = (inputName: string) => {
        const inputError = formErrorMessages.find(
            (inputError) => inputError.input === inputName
        );

        return inputError ? inputError.errors.map((err) => err) : null;
    };

    const handleFormSumbit = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            let newQuery = "";
            let canSearch = true;

            const searchFields = {} as JobSearchFields;
            const inputs = formRef.current?.querySelectorAll("input");
            const selectors = formRef.current?.querySelectorAll("select");

            const fields = inputs && selectors && [...inputs, ...selectors];

            fields?.forEach((input) => {
                if (wordsFilter(input.value.trim())) {
                    canSearch = false;

                    const inputError: FormInputError = formErrorMessages.find(
                        (formError) => formError[input.name] && formError
                    ) ?? { input: input.name, errors: [] };

                    if (!inputError.errors.includes("language")) {
                        inputError.errors = [...inputError.errors, "language"];
                    }

                    // add inputError and update state | sets error boundaries for current input
                    formErrorMessages.length
                        ? setFormErrorMessages((prevFormErrors) => [
                              ...[...prevFormErrors]
                                  .filter(
                                      (formError) =>
                                          formError.input !== input.name
                                  )
                                  .map((item) => item),
                              inputError,
                          ])
                        : setFormErrorMessages([inputError]);
                    return;
                }

                if (input.value.length && canSearch) {
                    switch (input.type) {
                        case "text":
                            newQuery += `${input.name}=${input.value.trim()}&`;
                            searchFields[input.name] = input.value.trim();
                            break;

                        case "number":
                            const numValue = Number(input.value);
                            if (Number.isNaN(numValue)) return;

                            newQuery += `${input.name}=${numValue}&`;
                            searchFields[input.name] = input.value;
                            break;

                        case "checkbox":
                            const checkbox = input as HTMLInputElement;
                            checkbox.checked
                                ? (newQuery += `${input.name}=true&`) &&
                                  (searchFields[input.name] = true)
                                : null;
                            break;

                        case "select-one":
                            newQuery += `${input.name}=${input.value}&`;
                            searchFields[input.name] = input.value;
                    }
                }
            });

            if (!newQuery.length || !canSearch) return;
            // TODO: alert user if all fields are empty

            newQuery = newQuery.endsWith("&")
                ? newQuery.slice(0, newQuery.length - 1)
                : newQuery;

            searchFields.id = nanoid();
            searchFields.query = newQuery;

            router.remember(JSON.stringify(searchFields), "searchFields");
            router.remember(true, "minimiseForm");

            setValues(searchFields);
            setFormErrorMessages([]);

            router.post("/", searchFields);
        },
        [formRef, values, setValues]
    );

    const [showForm, setShowForm] = useState(
        !props.searchResponse ? true : false
    );

    const toggleFormView = () => {
        setShowForm(!showForm);
    };

    if (props.searchResponse?.results && router.restore("minimiseForm")) {
        router.remember(undefined, "minimiseForm");

        if (!showForm) return;

        const delay = setTimeout(() => {
            clearTimeout(delay);
            toggleFormView();
        }, 0);
    }

    return (
        <div>
            <div className="form-buttons">
                <button type="submit" form="search" onClick={handleFormSumbit}>
                    Search Jobs
                </button>

                <button
                    onClick={toggleFormView}
                    aria-controls="job-search-form"
                    aria-expanded={showForm}
                    aria-label="Toggle form compact view"
                >
                    <i
                        className="fa-solid fa-caret-down"
                        style={{
                            marginRight: "1rem",
                            transition: "0.4s",
                            transform: `rotate(${showForm ? 0 : 90}deg)`,
                        }}
                    />
                </button>
            </div>

            <form
                ref={formRef}
                id="job-search-form"
                name="search"
                style={{
                    transition: "0.4s",
                    height: showForm ? "784px" : "9rem",
                    overflowY: "hidden",
                }}
            >
                {/*Keywords*/}
                <fieldset>
                    <legend>
                        <p>Keywords</p>
                    </legend>

                    <label htmlFor="keywords">
                        <p>
                            keywords{" "}
                            {formErrorMessages.length
                                ? inputErrors("keywords")?.map((item) =>
                                      item ? (
                                          <span key={item}>
                                              <i className="fa-solid fa-triangle-exclamation" />{" "}
                                              {item}
                                          </span>
                                      ) : null
                                  )
                                : null}
                        </p>
                        <input
                            type="text"
                            name="keywords"
                            pattern="[A-Za-z]"
                            value={keywords ?? ""}
                            placeholder={!keywords ? "Enter keyword(s)" : ""}
                            onChange={handleTextInput}
                        />
                    </label>

                    {/* <label htmlFor="employerProfileId">
                        keywords
                        <input
                            type="text"
                            pattern="[A-Za-z]"
                            name="employerProfileId"
                            placeholder="Employer name"
                        />
                    </label> */}
                </fieldset>

                <fieldset>
                    <legend>
                        <p>Location & Distance</p>
                    </legend>

                    {/*Location*/}
                    <label htmlFor="locationName">
                        <p>
                            location{" "}
                            {formErrorMessages.length
                                ? inputErrors("locationName")?.map((item) =>
                                      item ? (
                                          <span key={item}>
                                              <i className="fa-solid fa-triangle-exclamation" />{" "}
                                              {item}
                                          </span>
                                      ) : null
                                  )
                                : null}
                        </p>
                        <input
                            type="text"
                            pattern="[A-Za-z]"
                            name="locationName"
                            value={locationName ?? ""}
                            placeholder={
                                !locationName
                                    ? "Enter a location or postcode"
                                    : ""
                            }
                            onChange={handleTextInput}
                        />
                    </label>

                    {/*Distance*/}
                    <label htmlFor="distanceFromLocation">
                        <p>distance</p>
                        <select name="distanceFromLocation" defaultValue="10">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                        </select>
                    </label>
                </fieldset>

                {/*Hours*/}
                <fieldset className="checkbox">
                    <legend>
                        <p>Hours</p>
                    </legend>
                    <label htmlFor="fulltime">
                        <p>fulltime</p>
                        <input type="checkbox" name="fulltime" />
                    </label>

                    <label htmlFor="partime">
                        <p>partime</p>
                        <input type="checkbox" name="partime" />
                    </label>
                </fieldset>

                {/*Salary*/}
                <fieldset>
                    <legend>
                        <p>Salary</p>
                    </legend>

                    <label htmlFor="minimumSalary">
                        <p>min</p>
                        <input
                            type="number"
                            name="minimumSalary"
                            placeholder="Enter a number"
                        />
                    </label>

                    <label htmlFor="maximumSalary">
                        <p>max</p>
                        <input
                            type="number"
                            name="maximumSalary"
                            placeholder="Enter a number"
                        />
                    </label>
                </fieldset>

                {/*Type*/}
                <fieldset className="checkbox">
                    <legend>
                        <p>Type</p>
                    </legend>

                    <label htmlFor="temp">
                        <p>temp</p>
                        <input type="checkbox" name="temp" />
                    </label>

                    <label htmlFor="contract">
                        <p>contract</p>
                        <input type="checkbox" name="contract" />
                    </label>

                    <label htmlFor="permanent">
                        <p>permanent</p>
                        <input type="checkbox" name="permanent" />
                    </label>

                    <label htmlFor="graduate">
                        <p>graduate</p>
                        <input type="checkbox" name="graduate" />
                    </label>
                </fieldset>

                {/*PostedBy*/}
                <fieldset className="checkbox">
                    <legend>
                        <p>Posted By</p>
                    </legend>

                    <label htmlFor="postedByDirectEmployer">
                        <p>employer</p>

                        <input type="checkbox" name="postedByDirectEmployer" />
                    </label>

                    <label htmlFor="postedByRecruitmentAgency">
                        <p>agency</p>

                        <input
                            type="checkbox"
                            name="postedByRecruitmentAgency"
                        />
                    </label>
                </fieldset>
            </form>
        </div>
    );
}
