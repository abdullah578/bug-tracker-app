import * as actionTypes from "./actionTypes";
import jwtDecode from "jwt-decode";
import axios from "axios";
import axiosInst from "../../axiosInstance/AxiosInstance";

export const authLogoutCreator = (timeoutID) => (dispatch) => {
  axiosInst
    .post("/users/logout")
    .then((resp) => {})
    .catch((err) => console.log(err));
  localStorage.clear();
  dispatch({
    type: actionTypes.AUTH_LOGOUT,
    timeoutID,
  });
};
const authLogout = (expirationTime) => (dispatch) => {
  const id = setTimeout(
    () => dispatch(authLogoutCreator(id)),
    expirationTime * 1000
  );
  dispatch({ type: actionTypes.SET_TIMEOUT_ID, id });
};

const authExpireCreator = (token, userid) => (dispatch) => {
  axiosInst
    .post(`/users/logout/${token}/${userid}`)
    .then((resp) => dispatch({ type: actionTypes.AUTH_EXPIRE_CLEAR }))
    .catch((err) => console.log(err));
};
const authSuccessCreator = (token, userid, name, email, role) => ({
  type: actionTypes.AUTH_SUCCESS,
  token,
  userid,
  name,
  email,
  role,
});
const authFailureCreator = (error) => ({
  type: actionTypes.AUTH_FAILURE,
  error,
});

//authenticate the user
export const authenticate = (
  email,
  password,
  isSignUp,
  name,
  expiryToken,
  expiryUserid
) => (dispatch) => {
  const url = isSignUp
    ? `${process.env.REACT_APP_API_URL}/users`
    : `${process.env.REACT_APP_API_URL}/users/login`;
  axios
    .post(url, { email, password, name })
    .then((resp) => {
      localStorage.setItem(
        "expiryTime",
        new Date(new Date().getTime() + resp.data.expiresIn * 1000)
      );
      localStorage.setItem("token", resp.data.idToken);
      localStorage.setItem("userid", resp.data.localId);
      const user = jwtDecode(resp.data.idToken);
      axiosInst.defaults.headers.common["auth"] = `Bearer ${resp.data.idToken}`;
      dispatch(
        authSuccessCreator(
          resp.data.idToken,
          resp.data.localId,
          user.name,
          user.email,
          user.role
        )
      );
      dispatch(authLogout(resp.data.expiresIn));
      if (expiryToken) dispatch(authExpireCreator(expiryToken, expiryUserid));
    })
    .catch((err) => {
      dispatch(authFailureCreator("Error"));
    });
};
export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  if (!token) return null;
  else {
    const expirationDate = new Date(localStorage.getItem("expiryTime"));
    if (expirationDate > new Date()) {
      const user = jwtDecode(token);
      axiosInst.defaults.headers.common["auth"] = `Bearer ${token}`;
      dispatch(
        authSuccessCreator(token, user._id, user.name, user.email, user.role)
      );
      dispatch(
        authLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
      );
    } else {
      dispatch({
        type: actionTypes.AUTH_EXPIRE,
        token,
        userid,
      });
    }
  }
};
