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
const updateUserRoles = (projid, user, key) => ({
  type: actionTypes.UPDATE_USER_ROLES,
  id: projid,
  user,
  key,
});
const postProjUser = (user, projID) => ({
  type: actionTypes.UPDATE_PROJ_USERS,
  obj: user,
  id: projID,
});

//fetch users from API
export const fetchAllUsersCreator = (token) => (dispatch) => {
  dispatch(fetchUsersInit());
  axios
    .get(`/allUsers.json?auth=${token}`)
    .then((resp) => {
      const allUsersArray = parseResponse(resp);
      const usersArray = allUsersArray.filter((curr) => curr.role !== "N/A");
      dispatch(fetchUsersSuccess(usersArray, allUsersArray));
    })
    .catch((err) => dispatch(fetchUsersFailure()));
};

//fetch projects users from API
export const fetchProjUsersCreator = (id,token) => (dispatch) => {
  dispatch(fetchProjUsersInit());
  axios
    .get(`/users/${id}.json?auth=${token}`)
    .then((resp) => {
      const usersArray = parseResponse(resp).filter(
        (curr) => curr.role !== "N/A"
      );
      dispatch(fetchProjUsersSuccess(usersArray, id));
    })
    .catch((err) => dispatch(fetchProjUsersFailure()));
};
//update user role in API
export const updateUserRoleCreator = (obj, key,token) => (dispatch) => {
  axios
    .put(`/allUsers/${key}.json?auth=${token}`, obj)
    .then((resp) => dispatch(updateUsers(obj, key)))
    .catch((err) => null);
};
/*update user role in all projects , if user role is N/A,
remove the user from project*/
export const updateUsersCreator = (key, obj,token) => (dispatch) => {
  axios
    .get(`/users.json?auth=${token}`)
    .then((resp) => {
      const projList = [];
      if (resp.data)
        Object.keys(resp.data).forEach((projid) => {
          if (key in resp.data[projid]) projList.push(projid);
        });
      Promise.all(
        projList.map((projid) =>
          obj.role !== "N/A"
            ? axios
                .put(`/users/${projid}/${key}.json?auth=${token}`, obj)
                .then((resp) => dispatch(updateUserRoles(projid, obj, key)))
            : axios
                .delete(`/users/${projid}/${key}.json?auth=${token}`)
                .then((resp) =>
                  dispatch(deleteUserTicketsCreator(projid, obj.email, key,token))
                )
        )
      ).then((resp) => {
        dispatch(updateUserRoleCreator(obj, key,token));
      });
    })
    .catch((err) => console.log(err));
};

//save user in API
export const postUserCreator = (id, obj,token) => (dispatch) => {
  axios
    .put(`/users/${id}/${obj.key}.json?auth=${token}`, obj)
    .then((resp) => {
      dispatch(postProjUser(obj, id));
    })
    .catch((err) => console.log(err));
};
//delete user from API
const deleteUserCreator = (projectID, userKey,token) => (dispatch) => {
  axios
    .delete(`users/${projectID}/${userKey}.json?auth=${token}`)
    .then((resp) =>
      dispatch({
        type: actionTypes.DELETE_PROJ_USERS,
        id: projectID,
        key: userKey,
      })
    )
    .catch((err) => console.log(err));
};
//delete all corresponding tickets of user from API
export const deleteUserTicketsCreator = (projectID, userEmail, userKey,token) => (
  dispatch
) => {
  axios
    .get(`/tickets.json?auth=${token}&orderBy="projid"&equalTo="${projectID}"`)
    .then((resp) => {
      const filterKeys = resp.data
        ? Object.keys(resp.data).filter(
            (key) =>
              resp.data[key].assignedEmail === userEmail ||
              resp.data[key].submitterEmail === userEmail
          )
        : [];
      Promise.all(
        filterKeys.map((key) =>
          axios.delete(`/tickets/${key}.json?auth=${token}`).then((resp) =>
            dispatch({
              type: actionTypes.DELETE_TICKET,
              key,
              id: projectID,
            })
          )
        )
      )
        .then((resp) => dispatch(deleteUserCreator(projectID, userKey,token)))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
