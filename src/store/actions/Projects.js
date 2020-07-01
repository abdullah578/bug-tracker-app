import * as actionTypes from "./actionTypes";
import { parseResponse, parseProjectResponse } from "../Utils/Utils";
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
export const fetchProjectsCreator = (role, userKey) => (dispatch) => {
  dispatch(fetchProjectsInit());
  role === "Admin"
    ? axios
        .get("/projects.json")
        .then((resp) => {
          const projArray = parseResponse(resp);
          dispatch(fetchProjectsSuccess(projArray));
        })
        .catch((err) => dispatch(fetchProjectsFailure()))
    : axios
        .get("/projects.json")
        .then((projects) => {
          axios.get("/users.json").then((users) => {
            const userProjects = parseProjectResponse(projects, users, userKey);
            dispatch(fetchProjectsSuccess(userProjects));
          });
        })
        .catch((err) => fetchProjectsFailure());
};
export const postProjectCreator = (obj) => (dispatch) =>
  axios
    .post("/projects.json", obj)
    .then((resp) => dispatch(postProject(obj, resp.data.name)))
    .catch((err) => console.log(err));
