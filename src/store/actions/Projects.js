import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

const fetchOrdersCreator = () => (dispatch) =>
  axios
    .get("/projects.json")
    .then((resp) => {
      dispatch({ type: actionTypes.FETCH_PROJECTS_SUCCESS});
      console.log(resp);
    })
    .catch((err) => console.log(err));
