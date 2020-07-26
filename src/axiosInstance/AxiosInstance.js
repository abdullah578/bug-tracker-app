import axios from "axios";

const myInstance = axios.create({
  baseURL: "http://localhost:3000",
});
export default myInstance;
