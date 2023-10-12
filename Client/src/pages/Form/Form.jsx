import React from "react";
import { Input, Button, TextArea } from "../../components/index";
import { useError } from "../../context/errorContext";
import { useTodo } from "../../context/todoContext";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate, postTodos } from "../../api/todosAPI";

const Form = () => {
  const queryClient = useQueryClient();
  const { errorObj, setErrorMessage, deleteErrorMessage } = useError();
  const { todoObj, updateTodoObj, resetTodoObj } = useTodo();

  // Add Todos
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

  // Update Todos
  const updateMutation = useMutation({
    mutationFn: (todo) => postTodos(todo),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["todos"], (prevData) => {
        return prevData.map((todo) => {
          if (todo._id === variables._id) {
            todo = data?.result;
            todo.date = formatDate(data?.result?.date);
          }
          return todo;
        });
      });
      toast.success(`${data?.result?.title} updated successfully`);
      resetTodoObj();
    },
  });
  updateMutation.error && toast.error(updateMutation.error.message);

  // Handle input OnChange
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

  // Handle Form Submit
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
  };


  // Handling Edit
  const handleSave = async (event) => {
    event.preventDefault();

    const anyError = Object.values(errorObj).some((err) => err !== "");
    if (anyError) return;

    if (todoObj.date === "") {
      setErrorMessage("date", "Select a due date");
      return;
    }

    updateMutation.mutate(todoObj);
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
