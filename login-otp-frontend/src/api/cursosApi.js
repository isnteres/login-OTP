import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const getCursos = () => API.get("/courses");
export const registrarClick = (data) => API.post("/course-clicks", data);
export const getAnalitica = () => API.get("/course-clicks");
