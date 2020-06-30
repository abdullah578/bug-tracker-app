import * as actionTypes from "./actionTypes";
import { parseResponse } from "../Utils/Utils";
import axios from "../../axiosInstance/AxiosInstance";

const fetchUsersInit = () => ({
  type: actionTypes.FETCH_USERS_INIT,
});
const fetchUsersSuccess = (usersArr, allUsersArr) => ({
  type: actionTypes.FETCH_USERS_SUCCESS,
  users: usersArr,
  allUsers: allUsersArr,
});
const fetchUsersFailure = () => ({
  type: actionTypes.FETCH_USERS_FAILURE,
});
const fetchProjUsersInit = () => ({
  type: actionTypes.FETCH_PROJ_USERS_INIT,
});
const fetchProjUsersSuccess = (usersArr, projid) => ({
  type: actionTypes.FETCH_PROJ_USERS_SUCCESS,
  users: usersArr,
  projid,
});
const fetchProjUsersFailure = () => ({
  type: actionTypes.FETCH_PROJ_USERS_FAILURE,
});
const updateUsers = (user, key) => ({
  type: actionTypes.UPDATE_USERS,
  obj: user,
  key,
});
const postProjUser = (user, projID) => ({
  type: actionTypes.UPDATE_PROJ_USERS,
  obj: user,
  id: projID,
});
export const fetchAllUsersCreator = () => (dispatch) => {
  dispatch(fetchUsersInit());
  axios
    .get(`/allUsers.json`)
    .then((resp) => {
      const allUsersArray = parseResponse(resp);
      const usersArray = allUsersArray.filter((curr) => curr.role !== "N/A");
      dispatch(fetchUsersSuccess(usersArray, allUsersArray));
    })
    .catch((err) => dispatch(fetchUsersFailure()));
};
export const fetchProjUsersCreator = (id) => (dispatch) => {
  dispatch(fetchProjUsersInit());
  axios
    .get(`/users/${id}.json`)
    .then((resp) => {
      const usersArray = parseResponse(resp).filter(
        (curr) => curr.role !== "N/A"
      );
      dispatch(fetchProjUsersSuccess(usersArray, id));
    })
    .catch((err) => dispatch(fetchProjUsersFailure()));
};

export const getProjUsersCreator = (id) => ({
  type: actionTypes.GET_PROJ_USERS,
  id,
});
export const updateUsersCreator = (key, obj) => (dispatch) => {
  axios
    .put(`/allUsers/${key}.json`, obj)
    .then((resp) => dispatch(updateUsers(obj, key)))
    .catch((err) => null);
};
export const postUserCreator = (id, obj) => (dispatch) => {
  axios
    .put(`/users/${id}/${obj.key}.json`, obj)
    .then((resp) => {
      dispatch(postProjUser(obj, id));
    })
    .catch((err) => console.log(err));
};






const deleteUserCreator = (projectID, userKey) => (dispatch) => {
  axios
    .delete(`users/${projectID}/${userKey}.json`)
    .then((resp) =>
      dispatch({
        type: actionTypes.DELETE_PROJ_USERS,
        id: projectID,
        key: userKey,
      })
    )
    .catch((err) => console.log(err));
};

export const deleteUserTicketsCreator = (projectID, userEmail, userKey) => (
  dispatch
) => {
  axios
    .get(`/tickets.json?orderBy="projid"&equalTo="${projectID}"`)
    .then((resp) => {
      const filterKeys = Object.keys(resp.data).filter(
        (key) =>
          resp.data[key].assignedEmail === userEmail ||
          resp.data[key].submitterEmail === userEmail
      );
      filterKeys.map((key) =>
        axios
          .delete(`/tickets/${key}.json`)
          .then((resp) =>
            dispatch({
              type: actionTypes.DELETE_TICKET,
              key,
              id: projectID,
            })
          )
          .catch((err) => console.log(err))
      );
      dispatch(deleteUserCreator(projectID, userKey));
    })
    .catch((err) => console.log(err));
};
