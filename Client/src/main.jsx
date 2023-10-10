import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ErrorProvider } from "./context/errorContext.jsx";
import { TodoProvider } from "./context/todoContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorProvider>
      <TodoProvider>
        <App />
      </TodoProvider>
    </ErrorProvider>
  </React.StrictMode>
);
