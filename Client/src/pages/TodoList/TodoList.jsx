import React, { useEffect } from "react";
import "./TodoList.css";
import {
  MdDeleteOutline,
  MdOutlineModeEditOutline,
  MdTaskAlt,
} from "react-icons/md";
import { toast } from "react-toastify";
import { Button } from "../../components/index";
import { useError } from "../../context/errorContext";
import { useTodo } from "../../context/todoContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completeTodo, deleteTodo, getTodos } from "../../api/todosAPI";

const TodoList = () => {
  const { setTodoObj } = useTodo();

  const queryClient = useQueryClient();
  const { setErrorMessage } = useError();

  // Fetching Todo List from DB
  const { data: todoList, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const deleteMutation = useMutation({
    mutationFn: (todo) => deleteTodo(todo),
    onSuccess: (data) => {
      // Update todoList in cache without refetching
      queryClient.setQueryData(["todos"], (prevData) =>
        prevData.filter((todo) => todo._id !== data.result)
      );
      toast.warning("Todo deleted successfully");
    },
  });

  deleteMutation.error && toast.error(deleteMutation.error.message);

  const isCompleteMutation = useMutation({
    mutationFn: (todoId) => completeTodo(todoId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["todos"], (prevData) => {
        return prevData.map((todo) => {
          if (todo._id === variables) {
            todo.isCompleted = data?.result?.isCompleted;
          }
          return todo;
        });
      });

      data?.result?.isCompleted
        ? toast.success(`Hurray!... You completed the ${data?.result?.title}`)
        : toast.warning(`You marked ${data?.result?.title} as incomplete.`);
    },
  });

  isCompleteMutation.error && toast.error(isCompleteMutation.error.message);

  useEffect(() => {
    if (error) {
      setErrorMessage(
        "apiError",
        error?.response?.data?.message || error?.message
      );
    }
  }, [error]);

  // Populating edit data to the form
  const handleEdit = (todoId) => {
    const found = todoList?.find((todo) => todo._id == todoId);
    setTodoObj((prev) => (prev = found));
  };

  return (
    <>
      <div className="todo-container">
        {isLoading ? (
          <div>Loading...</div>
        ) : todoList?.length > 0 ? (
          todoList?.map((todoItem, index) => (
            <div
              className={`todo-list-container ${
                todoItem?.isCompleted && "complete"
              }`}
              key={index}
            >
              <div className="title-container">
                <div className="title-box">
                  <h2
                    className={`todo-title ${
                      todoItem?.isCompleted && "complete"
                    }`}
                    style={{ color: "white" }}
                  >
                    {todoItem?.title?.toUpperCase()}
                  </h2>
                </div>

                <MdTaskAlt
                  size={25}
                  cursor="pointer"
                  color={`${
                    todoItem?.isCompleted
                      ? "var( --list-completed)"
                      : "var(--bg-light-grey)"
                  }`}
                  onClick={() => isCompleteMutation.mutate(todoItem?._id)}
                ></MdTaskAlt>
              </div>

              <div className="title-container">
                <p
                  className={`todo-description ${
                    todoItem?.isCompleted && "complete"
                  }`}
                >
                  {todoItem?.description}
                </p>
              </div>

              <div className="date-btn-container">
                <p className="date">{todoItem?.date}</p>
                <div className="btn-container">
                  <Button
                    className="todo-edit"
                    onClick={() => handleEdit(todoItem?._id)}
                    buttonText={<MdOutlineModeEditOutline className="md" />}
                  ></Button>
                  <Button
                    className="todo-delete"
                    onClick={() => deleteMutation.mutate({ id: todoItem?._id })}
                    buttonText={<MdDeleteOutline className="md" />}
                  ></Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No Tasks</div>
        )}
      </div>
    </>
  );
};

export default TodoList;
