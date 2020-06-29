import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

const fetchUsersInit = () => ({
  type: actionTypes.FETCH_USERS_INIT,
});
const fetchProjUsersInit = () => ({
  type: actionTypes.FETCH_PROJ_USERS_INIT,
});
export const fetchProjUsersCreator = (id) => (dispatch) => {
  dispatch(fetchProjUsersInit());
  axios
    .get(`/users/${id}.json`)
    .then((resp) => {
      const usersArray = resp.data
        ? Object.keys(resp.data)
            .map((key) => ({
              key,
              ...resp.data[key],
            }))
            .filter((curr) => curr.role !== "N/A")
        : [];
      dispatch({
        type: actionTypes.FETCH_PROJ_USERS_SUCCESS,
        users: usersArray,
        projid: id,
      });
    })
    .catch((err) => dispatch({ type: actionTypes.FETCH_PROJ_USERS_FAILURE }));
};

export const getProjUsersCreator = (id) => ({
  type: actionTypes.GET_PROJ_USERS,
  id,
});
export const fetchAllUsersCreator = () => (dispatch) => {
  dispatch(fetchUsersInit());
  axios
    .get(`/allUsers.json`)
    .then((resp) => {
      console.log(resp);
      const usersArray = [];
      const allUsersArray = [];
      if (resp.data) {
        Object.keys(resp.data).forEach((curr) => {
          allUsersArray.push({ ...resp.data[curr], key: curr });
          if (resp.data[curr].role !== "N/A")
            usersArray.push({ ...resp.data[curr], key: curr });
        });
      }
      dispatch({
        type: actionTypes.FETCH_USERS_SUCCESS,
        users: usersArray,
        allUsers: allUsersArray,
      });
    })
    .catch((err) => dispatch({ type: actionTypes.FETCH_USERS_FAILURE }));
};
export const updateUsersCreator = (key, obj) => (dispatch) => {
  axios
    .put(`/allUsers/${key}.json`, obj)
    .then((resp) => dispatch({ type: actionTypes.UPDATE_USERS, obj, key }))
    .catch((err) => null);
};
export const postUserCreator = (id, obj) => (dispatch) => {
  axios
    .put(`/users/${id}/${obj.key}.json`, obj)
    .then((resp) => {
      dispatch({ type: actionTypes.UPDATE_PROJ_USERS, obj, id });
    })
    .catch((err) => console.log(err));
  /*axios.put(`/allUsers/${obj.key}.json`, {
    name: obj.name,
    email: obj.email,
    role: obj.role,
    projects: obj.projects,
    tickets: obj.tickets,
  })*/
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
