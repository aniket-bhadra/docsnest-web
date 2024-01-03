import React from "react";

const TestingComponent = () => {
  const refFunction = (ref) => {
    console.log(ref);
    console.log(`before append-- ${ref.innerHTML}`)
    const editor = document.createElement("div");
    ref.append(editor);
    console.log(`after append-- ${ref.innerHTML}`)
  };
  console.log("insdie TestingComponent");
  return <div ref={refFunction}>TestingComponent</div>;
};

export default TestingComponent;
