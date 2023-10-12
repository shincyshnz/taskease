import axios from "axios";
import { createContext, useEffect } from "react";
import { useContext, useState } from "react";
import { useError } from "./errorContext";

const API_URL = "http://localhost:3050/api/todo";

export const TodoContext = createContext(null);

export const TodoProvider = ({ children }) => {
  const INITIAL_TODOOBJ = {
    title: "",
    description: "",
    date: "",
  };
  const [todoObj, setTodoObj] = useState(INITIAL_TODOOBJ);
  const [todoList, setTodoList] = useState([]);
  const { setErrorMessage, deleteErrorMessage } = useError();

  const formatDate = (dateString) => {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = `${parsedDate.getMonth() + 1}`.padStart(2, "0"); // Months are zero-based
    const day = `${parsedDate.getDate()}`.padStart(2, "0");
    const formattedDateString = `${year}-${month}-${day}`;
    return formattedDateString;
  };

  const fetchTodos = async () => {
    try {
      const response = await axios(API_URL);
      if (response.data) {
        const tempData = response?.data?.result;
        const updatedResult = tempData.map((item) => {
          const formattedDate = formatDate(item.date);
          item.date = formattedDate;
          return item;
        });
        setTodoList((prev) => (prev = updatedResult));
      }
    } catch (error) {
      setErrorMessage("apiError", error.message);
    }
  };

  const updateTodoObj = (key, value) => {
    setTodoObj((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetTodoObj = () => {
    setTodoObj((prev) => (prev = INITIAL_TODOOBJ));
  };

  useEffect(() => {
    deleteErrorMessage("apiError");
    fetchTodos();
  }, []);

  const addTodoList = (todoItem) => {
    setTodoList((prev) => ([
      ...prev,
      todoItem,
    ]));
  };

  const updateTodoList = (todoItem) => {
    // const tempTodos = todoList.map((todo) => {
    //   if (todo._id === todoItem._id) {
    //     todo = todoItem;
    //   }
    //   return todo;
    // });
    // setTodoList((prev) => (prev = tempTodos));
    setTodoList((prev) =>
      prev.map((todo) => (todo._id === todoItem._id ? todoItem : todo))
    );
  };

  const deleteTodoList = (todoItem) => {
    // const tempTodos = todoList.filter((todo) => {
    //   if (todo._id !== todoItem._id) {
    //     todo = todoItem;
    //   }
    //   return todo;
    // });
    // setTodoList((prev) => (prev = tempTodos));
    setTodoList((prev) => prev.filter((todo) => todo._id !== todoItem._id));
  };

  return (
    <TodoContext.Provider
      value={{
        todoObj,
        setTodoObj,
        updateTodoObj,
        resetTodoObj,
        todoList,
        setTodoList,
        addTodoList,
        updateTodoList,
        deleteTodoList,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  return useContext(TodoContext);
};
