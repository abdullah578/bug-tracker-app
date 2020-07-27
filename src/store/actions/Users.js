import * as actionTypes from "./actionTypes";
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
export const fetchAllUsersCreator = () => (dispatch) => {
  dispatch(fetchUsersInit());
  axios
    .get(`/users`)
    .then((resp) => {
      const allUsersArray = resp.data;
      const usersArray = allUsersArray.filter((curr) => curr.role !== "N/A");
      dispatch(fetchUsersSuccess(usersArray, allUsersArray));
    })
    .catch((err) => dispatch(fetchUsersFailure()));
};

//fetch projects users from API
export const fetchProjUsersCreator = (id, token) => (dispatch) => {
  dispatch(fetchProjUsersInit());
  axios
    .get(`/projects/${id}/users`)
    .then((resp) => {
      const usersArray = resp.data.filter((curr) => curr.role !== "N/A");
      dispatch(fetchProjUsersSuccess(usersArray, id));
    })
    .catch((err) => dispatch(fetchProjUsersFailure()));
};
//update user role in API
export const updateUserRoleCreator = (obj, key) => (dispatch) => {
  axios
    .put(`/users`, { role: obj.role, key })
    .then((resp) => dispatch(updateUsers(obj, key)))
    .catch((err) => null);
};
/*update user role in all projects , if user role is N/A,
remove the user from project*/
export const updateUsersCreator = (key, obj, token) => (dispatch, getState) => {
  const state = getState();
  console.log(Object.keys(state.user.allProjUsers));
  Object.keys(state.user.allProjUsers).forEach((projKey) =>
    dispatch(updateUserRoles(projKey, obj, key))
  );
  dispatch(updateUserRoleCreator(obj, key));
};

//save user in API
export const postUserCreator = (id, obj, token) => (dispatch) => {
  axios
    .post(`/projects/${id}/users`, { userid: obj.key })
    .then((resp) => {
      dispatch(postProjUser(obj, id));
    })
    .catch((err) => console.log(err));
};
//delete user from API
//delete all corresponding tickets of user from API
export const deleteUserTicketsCreator = (
  projectID,
  userEmail,
  userKey,
  token
) => (dispatch) => {
  axios
    .delete(`/projects/${projectID}/${userKey}`)
    .then((resp) => {
      resp.data.forEach((key) =>
        dispatch({
          type: actionTypes.DELETE_TICKET,
          key,
          id: projectID,
        })
      );
      dispatch({
        type: actionTypes.DELETE_PROJ_USERS,
        id: projectID,
        key: userKey,
      });
    })
    .catch((err) => console.log(err));
};
