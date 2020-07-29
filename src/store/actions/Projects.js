import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

const fetchProjectsInit = () => ({
  type: actionTypes.FETCH_PROJECTS_INIT,
});
const fetchProjectsSuccess = (arr) => ({
  type: actionTypes.FETCH_PROJECTS_SUCCESS,
  projects: arr,
});
const fetchProjectsFailure = () => ({
  type: actionTypes.FETCH_PROJECTS_FAILURE,
});
const postProject = (projObj, key) => ({
  type: actionTypes.UPDATE_PROJECT,
  proj: { ...projObj, key },
});

export const deleteProject = (projid) => ({
  type: actionTypes.DELETE_PROJECT,
  id: projid,
});

//fetch projects from API
export const fetchProjectsCreator = () => (dispatch) => {
  dispatch(fetchProjectsInit());

  axios
    .get("/projects")
    .then((resp) => {
      const projects = resp.data;
      dispatch(fetchProjectsSuccess(projects));
    })
    .catch((err) => fetchProjectsFailure());
};

//save project in API
export const postProjectCreator = (obj) => (dispatch) =>
  axios
    .post("/projects", obj)
    .then((resp) => dispatch(postProject(obj, resp.data.name)))
    .catch((err) => console.log(err));

export const deleteProjectCreator = (projID) => (dispatch) => {
  axios
    .delete(`/projects/${projID}`)
    .then((resp) => {
      resp.data.forEach((key) => {
        dispatch({
          type: actionTypes.DELETE_TICKET,
          key,
          id: projID,
        });
      });
      dispatch(deleteProject(projID));
    })
    .catch((err) => console.log(err));
};
