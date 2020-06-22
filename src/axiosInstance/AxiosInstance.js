import axios from "axios";

const myInstance = axios.create({
  baseURL: "https://vocal-raceway-244209.firebaseio.com/",
});

export default myInstance;
