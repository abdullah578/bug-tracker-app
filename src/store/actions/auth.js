import * as actionTypes from "./actionTypes";
import axios from "axios";
import axiosInst from "../../axiosInstance/AxiosInstance";
const authLogout = (expirationTime) => (dispatch) => {
  setTimeout(() => dispatch(authLogoutCreator()), expirationTime * 1000);
};

export const authLogoutCreator = () => {
  localStorage.clear();
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
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
export const authenticate = (email, password, isSignUp, name) => (dispatch) => {
  const url = isSignUp
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=
    ${process.env.REACT_APP_API_KEY}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`;
  axios
    .post(url, { email, password, returnSecureToken: true })
    .then((resp) => {
      localStorage.setItem(
        "expiryTime",
        new Date(new Date().getTime() + resp.data.expiresIn * 1000)
      );
      if (isSignUp) {
        postUsers(email, name, resp.data.localId);
        localStorage.setItem("token", resp.data.idToken);
        localStorage.setItem("userid", resp.data.localId);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("role", "N/A");
        dispatch(
          authSuccessCreator(
            resp.data.idToken,
            resp.data.localId,
            name,
            email,
            "N/A"
          )
        );
        dispatch(authLogout(resp.data.expiresIn));
      } else {
        dispatch(
          getUser(resp.data.idToken, resp.data.localId, resp.data.expiresIn)
        );
      }
    })
    .catch((err) => {
      let error;
      if(err.response) error=err.response.data.error.message;
      dispatch(authFailureCreator( error || "Error"));
    });
};

const postUsers = (email, name, key) => {
  axiosInst.put(`/allUsers/${key}.json`, {
    name,
    email,
    role: "N/A",
  });
};
const getUser = (token, userid, expiry) => (dispatch) =>
  axiosInst
    .get(`/allUsers/${userid}.json`)
    .then((resp) => {
      localStorage.setItem("name", resp.data.name);
      localStorage.setItem("email", resp.data.email);
      localStorage.setItem("role", resp.data.role);
      localStorage.setItem("token", resp.data.idToken);
      localStorage.setItem("userid", resp.data.localId);
      dispatch(
        authSuccessCreator(
          token,
          userid,
          resp.data.name,
          resp.data.email,
          resp.data.role
        )
      );
      dispatch(authLogout(expiry));
    })
    .catch((err) => {
      dispatch(authFailureCreator("Error"));
    });

export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  if (!token) dispatch(authLogoutCreator());
  else {
    const expirationDate = new Date(localStorage.getItem("expiryTime"));
    if (expirationDate > new Date()) {
      dispatch(
        authSuccessCreator(
          token,
          userid,
          localStorage.getItem("name"),
          localStorage.getItem("email"),
          localStorage.getItem("role")
        )
      );
      dispatch(
        authLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
      );
    } else {
      dispatch(authLogoutCreator());
    }
  }
};
