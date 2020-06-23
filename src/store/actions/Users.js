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
export const postUserCreator = (id, obj) => (dispatch) =>
  axios
    .post(`/users/${id}.json`, obj)
    .then((resp) => dispatch(fetchUsersCreator()));
