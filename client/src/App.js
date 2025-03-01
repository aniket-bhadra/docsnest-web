import { Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

import TextEditor from "./TextEditor";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Routes>
      {/* <Route
        path="/"
        element={<Navigate to={`documents/${uuidV4()}`} replace />}
      /> */}

      <Route path="/" element={<Auth />} />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/documents/:id"
        element={
          <RequireAuth>
            <TextEditor />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
