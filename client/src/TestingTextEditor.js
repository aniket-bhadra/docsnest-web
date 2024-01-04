import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TestingTextEditor = () => {
  // const containerRef = useRef();
  console.log("outiside");
  const refFn = (ref) => console.log(ref);
  useEffect(() => {
    // console.log(containerRef.current);
    // containerRef.current.innerHTML = "";
    new Quill("#child", {
      theme: "snow",
    });
    // console.log(containerRef.current.innerHTML);
  }, []);

  return (
    <div id="container" ref={refFn}>
      <div id="child">{console.log("hello")}</div>
    </div>
  );
};

export default TestingTextEditor;
