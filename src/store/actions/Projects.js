import * as actionTypes from "./actionTypes";
import { parseResponse } from "../Utils/Utils";
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
export const fetchProjectsCreator = () => (dispatch) => {
  dispatch(fetchProjectsInit());
  axios
    .get("/projects.json")
    .then((resp) => {
      const projArray = parseResponse(resp);
      dispatch(fetchProjectsSuccess(projArray));
    })
    .catch((err) => dispatch(fetchProjectsFailure()));
};
export const postProjectCreator = (obj) => (dispatch) =>
  axios
    .post("/projects.json", obj)
    .then((resp) => dispatch(postProject(obj, resp.data.name)))
    .catch((err) => console.log(err));
