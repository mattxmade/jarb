import React, { useCallback, useEffect, useRef, useState } from "react";
import { Excalidraw, restoreElements } from "@excalidraw/excalidraw";

import {
    AppState,
    BinaryFiles,
    ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";

import {
    ExcalidrawElement,
    ExcalidrawTextElement,
} from "@excalidraw/excalidraw/types/element/types";

import {
    getBoundTextElement,
    getBoundTextMaxWidth,
    getContainerElement,
    measureText,
    normalizeText,
    redrawTextBoundingBox,
    wrapText,
} from "./excalidraw/src/element/textElement";

// TODO => lazy-load Excalidraw

import { nanoid } from "nanoid";

function App() {
    const allowRef = useRef(false);
    const lastTextRef = useRef<string | null>(null);
    const lastContainerRef = useRef<string | null>(null);

    const [viewText, setViewText] = useState("");

    const [excalidrawAPI, setExcalidrawAPI] =
        useState<ExcalidrawImperativeAPI | null>(null);

    const handleTextSelection = useCallback(
        (e: React.UIEvent<HTMLElement, MouseEvent>) => {
            const view = e.view as unknown as Window;

            const selection = view.getSelection()?.toString();
            if (!selection?.length) return;

            setViewText(selection);
        },
        [viewText]
    );

    const captureOnChange = useCallback(
        (
            excalidrawElements: readonly ExcalidrawElement[],
            appState: AppState,
            files: BinaryFiles
        ) => {
            console.dir(appState);

            if (allowRef.current && excalidrawAPI) {
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

                allowRef.current = false;

                // canvas width :)
                // const editor = document.querySelector(".note-view__editor");
                // const editorWidth =
                //     editor &&
                //     Number(getComputedStyle(editor).width.slice(0, -2));

                // if (editorWidth) appState.width = editorWidth;

                // -39rem
                // bottom bar 6.5rem
                // top bar -5.8rem
                // side bar 8rem
            }
        },
        [excalidrawAPI]
    );

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

            allowRef.current = true;

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

    return (
        <div className="container">
            <section>
                <h1>Job View</h1>

                <p onMouseUp={handleTextSelection}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Facere doloremque sit vero magni atque dignissimos
                    repellendus, exercitationem eum consectetur facilis nam ut
                    accusamus consequuntur iure corporis, dolore nemo hic rem!
                    Quo cum consectetur cupiditate magnam perspiciatis.
                    Voluptatibus adipisci quod magnam ex dignissimos iusto!
                    Nobis expedita, nihil cupiditate assumenda odio ducimus
                    aperiam dolorum illum asperiores optio aut corporis
                    repudiandae reprehenderit ab. Ex, modi eum itaque, id
                    similique hic aliquam tenetur mollitia quisquam voluptates
                    est sunt atque quidem rerum exercitationem necessitatibus
                    perspiciatis doloremque aperiam, ipsum qui! Tempora minus
                    numquam mollitia! Earum, rem? Est hic reiciendis officia
                    libero fugit commodi velit, at, minima dolore obcaecati
                    aliquam exercitationem placeat. Fuga beatae laudantium unde
                    dolores possimus ad voluptates earum, facere hic nemo!
                    Nihil, libero optio. Expedita omnis sapiente porro, impedit
                    dignissimos ipsum, voluptatem vitae pariatur distinctio quam
                    voluptates eum? Odio quos ratione velit ut modi nostrum
                    itaque asperiores? Neque veniam dolores ullam error.
                    Placeat, illo.
                </p>
            </section>

            <section className="note-view">
                <h2>Note View</h2>

                <div className="note-view__editor">
                    <ul role="nav" className="note-view__editor__nav-items">
                        <li>
                            <button className="button-icon">
                                <i className="fa-solid fa-file-pen" />
                            </button>
                        </li>
                        <li>
                            <button className="button-icon">
                                <i className="fa-solid fa-floppy-disk" />
                            </button>
                        </li>
                        <li>
                            <button className="button-icon">
                                <i className="fa-solid fa-folder" />
                            </button>
                        </li>
                        <li>
                            <button className="button-icon">
                                <i className="fa-solid fa-trash" />
                            </button>
                        </li>
                        <li>
                            <button className="button-icon">
                                <i className="fa-solid fa-download" />
                            </button>
                        </li>
                    </ul>

                    <Excalidraw
                        ref={(api) =>
                            setExcalidrawAPI(api as ExcalidrawImperativeAPI)
                        }
                        onChange={captureOnChange}
                    />
                </div>
            </section>
        </div>
    );
}

export default App;

/*==============================================================================

[1] info: Make readonly type definitions writeable
    link: https://stackoverflow.com/a/43001581

==============================================================================*/
