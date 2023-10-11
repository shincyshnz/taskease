import axios from "axios";

export const getTodos = async ()=>{
    const response = await axios(import.meta.env.VITE_TODOS_API);
    return response?.data;
}