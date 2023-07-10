import React, { useCallback, useEffect, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

function App() {
    const [viewText, setViewText] = useState("");

    const handleTextSelection = useCallback(
        (e) => {
            const selection = e.view.getSelection().toString();
            if (!selection.length) return;

            setViewText(selection);
        },
        [viewText]
    );

    useEffect(() => {
        const container = document.querySelector(".excalidraw-tooltip");
        if (container) setTimeout(() => container.remove(), 100);
    }, []);

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
                    <Excalidraw />
                    {viewText ? <p>{viewText}</p> : null}
                </div>
            </section>
        </div>
    );
}

export default App;
