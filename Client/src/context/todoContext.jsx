import { useContext, useState, createContext } from "react";
import { useError } from "./errorContext";

export const TodoContext = createContext(null);

export const TodoProvider = ({ children }) => {
  const INITIAL_TODOOBJ = {
    title: "",
    description: "",
    date: "",
  };
  const [todoObj, setTodoObj] = useState(INITIAL_TODOOBJ);
  const { setErrorObj } = useError();

  const updateTodoObj = (key, value) => {
    setTodoObj((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetTodoObj = () => {
    setErrorObj((prev) => (prev = {}));
    setTodoObj((prev) => (prev = INITIAL_TODOOBJ));
  };

  return (
    <TodoContext.Provider
      value={{
        todoObj,
        setTodoObj,
        updateTodoObj,
        resetTodoObj,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  return useContext(TodoContext);
};
