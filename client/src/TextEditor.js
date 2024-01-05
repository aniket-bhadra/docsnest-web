import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      //we only ever want to track the changes that user makes, it is ensuring that nothing that we programatically do, is going to be sent to the server
      if (source !== "user") return;

      //delta--is just the thing that is changing,its not the whole doucment its just a small subset of what is changing in the doucment
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      //remove this event listener if we no longer need it
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta) => {
      //on our code it actually make it actually do those changes, basically updating our document to have the changes that are being passed  from our other client
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      //remove this event listener if we no longer need it
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    // console.log("inside callback");

    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });
    setQuill(q);
  }, []);
  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
