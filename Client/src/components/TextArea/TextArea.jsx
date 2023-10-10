import React from "react";
import "../Input/Input.css";
import { useTodo } from "../../context/todoContext";

const TextArea = ({ name, todoData, onChange }) => {
  const { todoObj } = useTodo();

  return (
    <textarea
      name={name}
      id={name}
      className="todo-input"
      placeholder="Description"
      style={{ height: "100px" }}
      value={todoObj[name]}
      onChange={onChange}
    ></textarea>
  );
};

export default TextArea;
