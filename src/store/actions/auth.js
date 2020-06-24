import * as actionTypes from "./actionTypes";
import axios from "axios";
import axiosInst from "../../axiosInstance/AxiosInstance";

const authLogout = (expirationTime) => (dispatch) => {
  setTimeout(
    () => dispatch({ type: actionTypes.AUTH_LOGOUT }),
    expirationTime * 1000
  );
};

const authLogoutCreator = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userid");
  localStorage.removeItem("expiryTime");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};
const authSuccessCreator = (token, userid) => ({
  type: actionTypes.AUTH_SUCCESS,
  token,
  userid,
});
const authFailureCreator = (error) => ({
  type: actionTypes.AUTH_FAILURE,
  error,
});
export const authenticate = (email, password, isSignUp, name) => (dispatch) => {
  const url = isSignUp
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=
    ${process.env.REACT_APP_API_KEY}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`;
  axios
    .post(url, { email, password, returnSecureToken: true })
    .then((resp) => {
      localStorage.setItem("token", resp.data.idToken);
      localStorage.setItem("userid", resp.data.localId);
      localStorage.setItem(
        "expiryTime",
        new Date(new Date().getTime() + resp.data.expiresIn * 1000)
      );
      dispatch(authSuccessCreator(resp.data.idToken, resp.data.localId));
      dispatch(authLogout(resp.data.expiresIn));
      if (isSignUp) postUsers(email, name);
    })
    .catch((err) => {
      dispatch(authFailureCreator(err.response.data.error.message));
    });
};

const postUsers = (email, name) => {
  axiosInst.post("/allUsers.json", {
    name,
    email,
    role: "N/A",
  });
};

export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  if (!token) dispatch(authLogoutCreator());
  else {
    const expirationDate = new Date(localStorage.getItem("expiryTime"));
    if (expirationDate > new Date()) {
      dispatch(authSuccessCreator(token, userid));
      dispatch(
        authLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
      );
    } else {
      dispatch(authLogoutCreator());
    }
  }
};
