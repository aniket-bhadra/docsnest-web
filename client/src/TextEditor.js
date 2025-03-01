import React, { useCallback, useEffect, useState, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { UserContext } from "./context/UserContext";

const SAVE_INTERVAL_MS = 2000;
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
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { user } = useContext(UserContext);
  if (user) {
    console.log(user._id);
  }

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;
    //since in this case we've to listen this event once,this is why here `once` used,this will automatically cleanup the event after it gets listened to once
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });
    socket.on("user-joined", (user) => {
      console.log(user.name, "joined");
    });
    socket.emit("get-document", {
      documentId,
      userId: user._id,
      user,
    });
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      //we only ever want to track the changes that user makes, not through api
      if (source !== "user") return;

      //delta--is just the thing that is changing,its not the whole doucment its just a small subset of what is changing in the doucment
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    //with each socket, quill changes this clears the prevuos listenr and then add new listenr to avoid any unexpected eorr or multple same event lsitner attached
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
    // This useCallback runs when the div is rendered. The callback gets called with the div element.
    // wrapper is the actual DOM element (the div)
    // This ensures that the function executes only after the DOM renders.
    // If placed inside useEffect, there’s a chance that useEffect runs before the ref is set.
    // Instead of using a variable ref, we use a callback ref so it only executes when the div is rendered.
    // useCallback prevents unnecessary re-creations of the function, optimizing performance.

    if (wrapper == null) return;

    //that div contain toolbar and editor
    //everytime we run our code we want to empty string to reset previous code,unless multiple toolbar can shown up & stacking one after another so everytime we run this code we want to make sure we clean the previous editor & toolbar so that multiple editor , toolbar do not stack one after another, and do that we need to make sure that we wrap the toolbar and editor insdie an parent div,so that everytime i make changes during delopment, i can cleanued its innerHtml which is basically cleaing the preivous toolbar and editro, that is why not drielcy quil is attached but rather we create element an parent div then attaches the editor and toolbar, becuse on whatever elemetn i attach quill, it attaches the editor on that div, and toolbar outside of that div, that is why we created an parent div, and dynmically created an div, where we attach quill, means in thisdynmic div quill ataches the editor and outsdife of that dynmic div, quill renders toolbar, so everything render insdie my div, so that whnver i make change i can cleaned previous stuff, and prevent mulple toolbar stakcing one after anther
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
    q.disable();
    q.setText("Loading....");
    setQuill(q);
  }, []);
  return (
    <div class="google-docs-container">
      <div class="header">
        <div class="document-name">Untitled Document</div>
        <div class="profile-icon">
          <div class="avatar">JD</div>
        </div>
      </div>
      <div class="editor-container" ref={wrapperRef}></div>
    </div>
  );
};

export default TextEditor;
