import { Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

import TextEditor from "./TextEditor";

//testing-components
// import TestingComponent from "./TestingComponent";
// import TestingTextEditor from "./TestingTextEditor";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`documents/${uuidV4()}`} replace />}
      />

      <Route path="documents/:id" element={<TextEditor />} />
    </Routes>
  );
}

export default App;
