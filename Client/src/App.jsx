import React from "react";
import Header from "./components/Header/Header";
import TodoList from "./pages/TodoList/TodoList";
import Form from "./pages/Form/Form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Header />
      <Form />
      <TodoList />
      <ToastContainer />
    </>
  );
}

export default App;
