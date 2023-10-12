import React, { useEffect, useLayoutEffect } from "react";
import Button from "../../components/Button/Button";
import {
  MdDeleteOutline,
  MdOutlineModeEditOutline,
  MdTaskAlt,
} from "react-icons/md";
import "./TodoList.css";
import { useTodo } from "../../context/todoContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useError } from "../../context/errorContext";
import { deleteTodo, getTodos, postTodos } from "../../api/todosAPI";

const API_URL = "http://localhost:3050/api/todo";

const TodoList = () => {
  const {
    // todoList,
    updateTodoList,
    deleteTodoList,
    setTodoObj,
    resetTodoObj,
  } = useTodo();

  const queryClient = useQueryClient();
  const { setErrorMessage } = useError();

  const { data: todoList, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const deleteMutation = useMutation({
    mutationFn: (todo) => deleteTodo(todo),
    onSuccess: (data) => {
      toast.warning("Todo deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });


  deleteMutation.isError && toast.error(deleteMutation.error.message);

  // const isCompleteMutation = useMutation({
  //   mutationFn: postTodos(todo),
  //   onSuccess: (data) => {
  //     toast.success("Hurray!... You completed the task");
  //     queryClient.invalidateQueries({ queryKey: ["todos"] });
  //   },
  // });

  useEffect(() => {
    if (error) {
      setErrorMessage(
        "apiError",
        error?.response?.data?.message || error?.message
      );
    }
  }, [error]);

  const handleEdit = (todoId) => {
    const found = todoList?.find((todo) => todo._id == todoId);
    setTodoObj((prev) => (prev = found));
  };

  // const handleIsComplete = async (todoId) => {
  //   const found = todoList.find((todo) => todo._id == todoId);
  //   found.isCompleted = !found.isCompleted;

  //   try {
  //     const response = await axios(API_URL, {
  //       method: "PUT",
  //       data: found,
  //     });

  //     if (response) {
  //       updateTodoList(response.data);
  //       response.data.result.isCompleted &&
  //         toast.success(`${response.data.result.title} Completed successfully`);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  // const handleDelete = async (todoId) => {
  //   try {
  //     const response = await axios(API_URL, {
  //       method: "DELETE",
  //       data: {
  //         id: todoId,
  //       },
  //     });

  //     if (response) {
  //       resetTodoObj();
  //       toast.warning("Todo deleted successfully");
  //       deleteTodoList(response?.data?.result);
  //     }
  //   } catch (err) {
  //     setErrorInputField((prev) => ({
  //       ...prev,
  //       apiError: {
  //         errorMessage: err.response.data.message,
  //       },
  //     }));
  //   }
  // };

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
                  color={`${
                    todoItem?.isCompleted
                      ? "var( --list-completed)"
                      : "var(--bg-light-grey)"
                  }`}
                  // onClick={() => handleIsComplete(todoItem?._id)}
                  onClick={() => editMutation.mutate({ id: todoItem?._id })}
                />
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
                    // onClick={() => handleDelete(todoItem?._id)}
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
