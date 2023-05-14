import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routess from "./routes/routes";
import { AuthContextProvider } from "./contexts/authContext";
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div className="App">
          <Routess />
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
