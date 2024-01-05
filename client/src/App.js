import { Routes, Route } from "react-router-dom";

import TextEditor from "./TextEditor";

//testing-components
// import TestingComponent from "./TestingComponent";
import TestingTextEditor from "./TestingTextEditor";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TestingTextEditor />} />
      </Routes>
      {/* <TextEditor /> */}
    </>
  );
}

export default App;
