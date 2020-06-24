import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

const fetchUsersInit = () => ({
  type: actionTypes.FETCH_USERS_INIT,
});
export const fetchUsersCreator = (id) => (dispatch) => {
  dispatch(fetchUsersInit());
  axios
    .get(`/users/${id}.json`)
    .then((resp) => {
      const usersArray = resp.data
        ? Object.keys(resp.data).map((key) => ({
            key,
            ...resp.data[key],
          }))
        : [];
      dispatch({
        type: actionTypes.FETCH_USERS_SUCCESS,
        users: usersArray,
      });
    })
    .catch((err) => dispatch({ type: actionTypes.FETCH_USERS_FAILURE }));
};
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
    .then((resp) => dispatch(fetchAllUsersCreator()))
    .catch((err) => null);
};
export const postUserCreator = (id, obj) => (dispatch) =>
  axios
    .post(`/users/${id}.json`, obj)
    .then((resp) => dispatch(fetchUsersCreator()));
