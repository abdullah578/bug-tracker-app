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
    .get(`/users.json`)
    .then((resp) => {
      console.log(resp);
      const usersArray = [];
      if (resp.data) {
        for (let projKey in resp.data) {
          for (let userKey in resp.data[projKey])
            if (
              usersArray.findIndex(
                (curr) => curr.email === resp.data[projKey][userKey].email
              ) === -1
            )
              usersArray.push({ key: userKey, ...resp.data[projKey][userKey] });
        }
      }
      dispatch({
        type: actionTypes.FETCH_USERS_SUCCESS,
        users: usersArray,
      });
    })
    .catch((err) => dispatch({ type: actionTypes.FETCH_USERS_FAILURE }));
};
export const postUserCreator = (id, obj) => (dispatch) =>
  axios
    .post(`/users/${id}.json`, obj)
    .then((resp) => dispatch(fetchUsersCreator()));
