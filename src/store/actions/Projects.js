import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

const fetchProjectsInit = () => ({
  type: actionTypes.FETCH_PROJECTS_INIT,
});
export const fetchProjectsCreator = () => (dispatch) => {
  dispatch(fetchProjectsInit());
  axios
    .get("/projects.json")
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
    .then((resp) =>
      dispatch({
        type: actionTypes.UPDATE_PROJECT,
        proj: { ...obj, key: resp.data.name },
      })
    )
    .catch((err) => console.log(err));
