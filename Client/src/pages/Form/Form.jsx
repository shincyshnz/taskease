import React from "react";
import Input from "../../components/Input/Input";
import TextArea from "../../components/TextArea/TextArea";
import Button from "../../components/Button/Button";
import { useError } from "../../context/errorContext";
import { useTodo } from "../../context/todoContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTodos } from "../../api/todosAPI";

const API_URL = "http://localhost:3050/api/todo";

const Form = () => {
  const { errorObj, setErrorMessage, deleteErrorMessage } = useError();
  const {
    todoObj,
    updateTodoObj,
    resetTodoObj,
    addTodoList,
    updateTodoList,
  } = useTodo();

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (todo) => postTodos(todo),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["todos"], (prevData) => [
        ...prevData,
        data?.result,
      ]);
      toast.success("Todo added successfully");

      resetTodoObj();
    },
  });
  addMutation.error && toast.error(addMutation.error.message);

  const updateMutation = useMutation({
    mutationFn: (todo) => postTodos(todo),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["todos"], (prevData) => {
        return prevData.map((todo) => {
          if (todo._id === variables._id) {
            todo = data?.result;
          }
          return todo;
        });
      });
      toast.success(`${data?.result?.title} updated successfully`);
      resetTodoObj();
    },
  });
  updateMutation.error && toast.error(updateMutation.error.message);

  const handleChange = (event) => {
    const { value, name } = event.target;
    deleteErrorMessage(name);
    updateTodoObj(name, value);

    if (value === "") {
      setErrorMessage(
        name,
        `${name[0].toUpperCase()}${name.slice(1)} Cannot be empty`
      );
      return;
    }

    if (value.length <= 3) {
      setErrorMessage(
        name,
        `${name[0].toUpperCase()}${name.slice(
          1
        )} must be more than 3 characters`
      );
      return;
    }

    if (name === "date") {
      const today = new Date();
      const dueDate = new Date(value);
      dueDate <= today &&
        setErrorMessage(name, "Due Date must be Today or future");
      return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (todoObj.date === "") {
      setErrorMessage("date", "Select a due date");
      return;
    }

    if (
      errorObj.title !== "" ||
      errorObj.description !== "" ||
      errorObj.date !== ""
    )
      return;

    addMutation.mutate(todoObj);

    // try {
    //   const response = await axios(API_URL, {
    //     method: "POST",
    //     data: todoObj,
    //   });

    //   if (response) {
    //     addTodoList(response.data);
    //     toast.success("Todo added successfully");
    //     resetTodoObj();
    //   }
    // } catch (error) {
    //   toast.error(error.message);
    // }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const anyError = Object.values(errorObj).some((err) => err !== "");
    if (anyError) return;

    if (todoObj.date === "") {
      setErrorMessage("date", "Select a due date");
      return;
    }

    updateMutation.mutate(todoObj);

    // try {
    //   const response = await axios(API_URL, {
    //     method: "PUT",
    //     data: todoObj,
    //   });

    //   if (response) {
    //     resetTodoObj();
    //     updateTodoList(response.data);
    //     toast.success("Todo updated successfully");
    //   }
    // } catch (error) {
    //   toast.error(error.message);
    // }
  };

  return (
    <>
      <div className="container">
        <Input
          type="text"
          name="title"
          className="todo-input"
          placeholder="Title"
          onChange={handleChange}
        />
        {errorObj.title && <label className="error">{errorObj.title}</label>}
        <TextArea name="description" onChange={handleChange} />
        {errorObj.description && (
          <label className="error">{errorObj.description}</label>
        )}
        <Input
          type="date"
          name="date"
          className="todo-input"
          onChange={handleChange}
          placeholder="Due Date"
        />
        {errorObj.date && <label className="error">{errorObj.date}</label>}

        {todoObj?._id ? (
          <>
            <Button
              className={"btn-add"}
              onClick={handleSave}
              buttonText={"Save"}
            />
            <Button
              className={"btn-add"}
              onClick={() => resetTodoObj()}
              buttonText={"Cancel"}
            />
          </>
        ) : (
          <Button
            className={"btn-add"}
            onClick={handleSubmit}
            buttonText={"Add"}
          />
        )}

        {errorObj.apiError && (
          <label className="error">{errorObj.apiError}</label>
        )}
      </div>
    </>
  );
};

export default Form;
