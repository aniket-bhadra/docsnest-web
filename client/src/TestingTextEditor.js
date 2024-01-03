import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TestingTextEditor = () => {
  const containerRef = useRef();
  useEffect(() => {
    // containerRef.current.innerHTML = "";
    new Quill("#child", {
      theme: "snow",
    });
    // console.log(containerRef.current.innerHTML);
  }, []);

  return (
    <div id="container" ref={containerRef}>
      <div id="child"></div>
    </div>
  );
};

export default TestingTextEditor;
