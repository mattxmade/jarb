import wordList from "../../json/words.json";
import allowedList from "../../json/allowed.json";

export const repeatInputValues = (
    inputs: HTMLInputElement[],
    lastValues: any | undefined
) => {
    if (!lastValues) return;

    return ![...inputs].every((input) => {
        return (
            lastValues[input.name] === input.value ||
            lastValues[input.name] === input.checked
        );
    });
};

export const isTextInputAaZz = (value: string): boolean => {
    return value.split("").every((char) => /[A-Za-z" "]/.test(char));
};

export const wordsFilter = (value: string): boolean => {
    return (
        allowedList.every((word) => value !== word) &&
        wordList.some((word) => value === word)
    );
};
