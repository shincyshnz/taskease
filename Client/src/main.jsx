import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ErrorProvider } from "./context/errorContext.jsx";
import { TodoProvider } from "./context/todoContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorProvider>
      <TodoProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </TodoProvider>
    </ErrorProvider>
  </React.StrictMode>
);