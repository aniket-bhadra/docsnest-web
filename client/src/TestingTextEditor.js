import React, { useCallback, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TestingTextEditor = () => {
  const wrapperRef = useRef();
  useEffect(() => {
    const editor = document.createElement("div");
    wrapperRef.current.append(editor);
    new Quill(editor, {
      theme: "snow",
    });
    
    return () => {
      console.log(wrapperRef.innerHTML);
      wrapperRef.innerHTML = "";
    };
  }, []);
  return <div id="container" ref={wrapperRef}></div>;
};

export default TestingTextEditor;
