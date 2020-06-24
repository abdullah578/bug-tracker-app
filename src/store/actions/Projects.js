import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

const fetchProjectsInit = () => ({
  type: actionTypes.FETCH_PROJECTS_INIT,
});
export const fetchProjectsCreator = () => (dispatch) => {
  dispatch(fetchProjectsInit());
  axios
    .get("/projects.jsohn")
    .then((resp) => {
      const projArray = resp.data
        ? Object.keys(resp.data).map((key) => ({
            key,
            ...resp.data[key],
          }))
        : [];
      dispatch({
        type: actionTypes.FETCH_PROJECTS_SUCCESS,
        projects: projArray,
      });
    })
    .catch((err) => dispatch({ type: actionTypes.FETCH_PROJECTS_FAILURE }));
};
export const postProjectCreator = (obj) => (dispatch) =>
  axios
    .post("/projects.json", obj)
    .then((resp) => dispatch(fetchProjectsCreator()));
