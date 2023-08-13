import { useCallback, useEffect, useRef, useState } from "react";
import { restoreElements } from "@excalidraw/excalidraw";

import {
    AppState,
    BinaryFiles,
    ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";

import {
    ExcalidrawElement,
    ExcalidrawTextElement,
} from "@excalidraw/excalidraw/types/element/types";

import { redrawTextBoundingBox } from "../components/excalidraw/src/element/textElement";

import { nanoid } from "nanoid";

const useExcalidraw = () => {
    // API
    const [excalidrawAPI, setExcalidrawAPI] =
        useState<ExcalidrawImperativeAPI | null>(null);

    // Text Content
    const [viewText, setViewText] = useState("");

    // Text Element trackers
    const lastTextRef = useRef<string | null>(null);
    const lastContainerRef = useRef<string | null>(null);

    // Canvas update tracker
    const allowDrawUpdateRef = useRef(false);

    const handleTextSelection = useCallback(
        (e: React.UIEvent<HTMLElement, MouseEvent>) => {
            const view = e.view as unknown as Window;

            const selection = view.getSelection()?.toString();
            if (!selection?.length) return;

            setViewText(selection);
        },
        [viewText]
    );

    const captureOnChange = (
        excalidrawElements: readonly ExcalidrawElement[],
        appState: AppState,
        files: BinaryFiles
    ) => {
        if (allowDrawUpdateRef.current && excalidrawAPI) {
            const elements = excalidrawElements;

            if (elements.length) {
                const rec = elements.find(
                    (el) => el.id === lastContainerRef.current
                );
                const tex = elements.find(
                    (el) => el.id === lastTextRef.current
                ) as ExcalidrawTextElement;

                if (rec && tex) {
                    redrawTextBoundingBox(tex, rec);
                }
            }

            excalidrawAPI.scrollToContent(elements[elements.length - 1], {
                fitToContent: true,
                animate: true,
                duration: 0,
            });

            allowDrawUpdateRef.current = false;
        }
    };

    useEffect(() => {
        if (!viewText.length || !excalidrawAPI) return;

        const id_container = nanoid();
        const id_textElement = nanoid();

        const sessionElements = restoreElements(
            excalidrawAPI.getSceneElements(),
            null,
            {
                refreshDimensions: true,
                repairBindings: true,
            }
        );

        let lastElementsCount = sessionElements.length;

        const yPos = sessionElements.sort((a, z) => a.y - z.y)[
            sessionElements.length - 1
        ];

        const sceneData = {
            elements: [
                ...sessionElements,
                {
                    id: id_container,
                    type: "rectangle",
                    x: 250,
                    y: yPos ? yPos.y + 15 + yPos.height : 140,
                    width: 600,
                    height: 25,
                    angle: 0,
                    strokeColor: "transparent",
                    backgroundColor: "transparent",
                    fillStyle: "hachure",
                    strokeWidth: 1,
                    strokeStyle: "solid",
                    roughness: 1,
                    opacity: 100,
                    groupIds: [],
                    roundness: {
                        type: 3,
                    },
                    isDeleted: false,
                    boundElements: [
                        {
                            type: "text",
                            id: id_textElement,
                        },
                    ],
                    link: null,
                    locked: false,
                },
            ],
            appState: excalidrawAPI.getAppState(),
        };

        lastContainerRef.current = id_container;
        excalidrawAPI?.updateScene(sceneData as any);

        const onComplete = setInterval(() => {
            if (excalidrawAPI.getSceneElements().length === lastElementsCount)
                return;

            lastElementsCount = excalidrawAPI.getSceneElements().length;
            clearInterval(onComplete);

            const lastContainer = excalidrawAPI
                .getSceneElements()
                .find((el) => el.id === id_container);

            const textElement = {
                id: id_textElement,
                containerId: id_container,

                type: "text",
                fontSize: 20,
                fontFamily: 1,

                originalText: viewText,
                text: viewText,

                x: 0,
                y: 0,

                width: 0,
                height: 0,

                textAlign: "center",
                verticalAlign: "middle",

                roughness: 1,
                opacity: 100,
                locked: false,

                angle: 0,
                baseline: 18,
                lineHeight: 1.25,

                strokeWidth: 1,
                strokeStyle: "solid",
                strokeColor: "#000000",

                fillStyle: "hachure",
                backgroundColor: "transparent",
            } as unknown as ExcalidrawTextElement;

            const sessionElements = restoreElements(
                excalidrawAPI.getSceneElements(),
                null,
                {
                    refreshDimensions: true,
                    repairBindings: true,
                }
            );

            const sceneData = {
                elements: [...sessionElements, textElement],
                appState: excalidrawAPI.getAppState(),
            };

            excalidrawAPI.updateScene(sceneData as any);
            lastTextRef.current = id_textElement;

            allowDrawUpdateRef.current = true;

            const restored = setInterval(() => {
                if (
                    lastElementsCount ===
                    excalidrawAPI.getSceneElements().length
                )
                    return;

                clearInterval(restored);

                const sessionElements = restoreElements(
                    excalidrawAPI.getSceneElements(),
                    null,
                    {
                        refreshDimensions: true,
                        repairBindings: true,
                    }
                );

                const sceneData = {
                    elements: sessionElements,
                    appState: excalidrawAPI.getAppState(),
                };

                excalidrawAPI.updateScene(sceneData as any);
            }, 10);
        }, 10);
    }, [viewText]);

    return { setExcalidrawAPI, captureOnChange, handleTextSelection };
};

export default useExcalidraw;
