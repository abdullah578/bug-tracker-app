import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

const fetchOrdersInit = () => ({
  type: actionTypes.FETCH_PROJECTS_INIT,
});
export const fetchOrdersCreator = () => (dispatch) => {
  dispatch(fetchOrdersInit());
  axios
    .get("/projects.json")
    .then((resp) => {
      const projArray = Object.keys(resp.data).map((key) => ({
        key,
        ...resp.data[key],
      }));
      dispatch({
        type: actionTypes.FETCH_PROJECTS_SUCCESS,
        projects: projArray,
      });
    })
    .catch((err) => console.log(err));
};
export const postOrderCreator = (obj) => (dispatch) =>
  axios
    .post("/projects.json", obj)
    .then((resp) => dispatch(fetchOrdersCreator()));
