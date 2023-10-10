import React, { useState } from "react";
import "./Input.css";
import { useTodo } from "../../context/todoContext";

const Input = ({
  type,
  placeholder = "",
  className,
  onChange,
  name,
}) => {
  const { todoObj } = useTodo();

  return (
    <input
      className={className}
      name={name}
      id={name}
      value={todoObj[name] }
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
