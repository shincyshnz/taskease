import axios from "axios";

// formatting date
export const formatDate = (dateString) => {
  const parsedDate = new Date(dateString);
  const year = parsedDate.getFullYear();
  const month = `${parsedDate.getMonth() + 1}`.padStart(2, "0"); // Months are zero-based
  const day = `${parsedDate.getDate()}`.padStart(2, "0");
  const formattedDateString = `${year}-${month}-${day}`;
  return formattedDateString;
};

// fetch Todos list
export const getTodos = async () => {
  const response = await axios(import.meta.env.VITE_TODOS_API);
  const result = response?.data?.result;
  if (result) {
    const updatedResult = result.map((item) => {
      const formattedDate = formatDate(item.date);
      item.date = formattedDate;
      return item;
    });
    return updatedResult;
  }
};

// Create or update todos
export const postTodos = async (todoObj) => {
  const response = await axios(import.meta.env.VITE_TODOS_API, {
    method:"POST",
    data: todoObj,
  });
  return response?.data;
};

export const updateTodos = async (todoObj) => {
  const response = await axios(import.meta.env.VITE_TODOS_API, {
    method:"PUT",
    data: todoObj,
  });
  return response?.data;
};

// Delete todo based on Id
export const deleteTodo = async (todo) => {
  const response = await axios(import.meta.env.VITE_TODOS_API, {
    method: "DELETE",
    data: {
      id: todo.id,
    },
  });
  return response?.data;
};

// Update complete status for todos
export const completeTodo = async (todoId) => {
  const response = await axios.put(`${import.meta.env.VITE_TODOS_API}/${todoId}`);
  return response?.data;
};