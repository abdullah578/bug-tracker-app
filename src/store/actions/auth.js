import * as actionTypes from "./actionTypes";
import axios from "axios";
import axiosInst from "../../axiosInstance/AxiosInstance";

const authLogout = (expirationTime) => (dispatch) => {
  setTimeout(
    () => dispatch({ type: actionTypes.AUTH_LOGOUT }),
    expirationTime * 1000
  );
};
export const authenticate = (email, password, isSignUp, name) => (dispatch) => {
  const url = isSignUp
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=
    ${process.env.REACT_APP_API_KEY}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`;
  axios
    .post(url, { email, password, returnSecureToken: true })
    .then((resp) => {
      dispatch({
        type: actionTypes.AUTH_SUCCESS,
        token: resp.data.idToken,
        userid: resp.data.localId,
      });
      dispatch(authLogout(resp.data.expiresIn));
      if (isSignUp) postUsers(email, name);
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.AUTH_FAILURE,
        error: err.response.data.error.message,
      });
    });
};

const postUsers = (email, name) => {
  axiosInst.post("/allUsers.json", {
    name,
    email,
    role: "N/A",
    projects: [],
    tickets: [],
  });
};
