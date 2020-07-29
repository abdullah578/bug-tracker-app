import axios from "axios";

const myInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
export default myInstance;
