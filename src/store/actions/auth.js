import * as actionTypes from "./actionTypes";
import jwtDecode from "jwt-decode";
import axios from "axios";
import axiosInst from "../../axiosInstance/AxiosInstance";

export const authLogoutCreator = (timeoutID) => (dispatch) => {
  axiosInst
    .post("/users/logout")
    .then((resp) => {
      localStorage.clear();
      dispatch({
        type: actionTypes.AUTH_LOGOUT,
        timeoutID,
      });
    })
    .catch((err) => console.log(err));
};
const authLogout = (expirationTime) => (dispatch) => {
  const id = setTimeout(
    () => dispatch(authLogoutCreator(id)),
    expirationTime * 1000
  );
  dispatch({ type: actionTypes.SET_TIMEOUT_ID, id });
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
export const authenticate = (email, password, isSignUp, name) => (dispatch) => {
  const url = isSignUp
    ? `http://localhost:3000/users`
    : `http://localhost:3000/users/login`;
  axios
    .post(url, { email, password, name })
    .then((resp) => {
      localStorage.setItem(
        "expiryTime",
        new Date(new Date().getTime() + resp.data.expiresIn * 1000)
      );
      localStorage.setItem("token", resp.data.idToken);
      const user = jwtDecode(resp.data.idToken);
      axiosInst.defaults.headers.common["auth"] = `Bearer ${resp.data.idToken}`;
      /*localStorage.setItem("userid", resp.data.localId);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("role", "N/A");*/
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
    })
    .catch((err) => {
      let error;
      console.log(err.error);
      if (err.response) error = err.response.data.error.message;
      dispatch(authFailureCreator(error || "Error"));
    });
};

//save the user info
// const postUsers = (email, name, key, token) => {
//   axiosInst
//     .put(`/allUsers/${key}.json?auth=${token}`, {
//       name,
//       email,
//       role: "N/A",
//     })
//     .then((resp) => null)
//     .catch((err) => console.log(err));
// };
// const getUser = (token, userid, expiry) => (dispatch) =>
//   axiosInst
//     .get(`/allUsers/${userid}.json?auth=${token}`)
//     .then((resp) => {
//       localStorage.setItem("name", resp.data.name);
//       localStorage.setItem("email", resp.data.email);
//       localStorage.setItem("role", resp.data.role);
//       localStorage.setItem("token", token);
//       localStorage.setItem("userid", userid);
//       dispatch(
//         authSuccessCreator(
//           token,
//           userid,
//           resp.data.name,
//           resp.data.email,
//           resp.data.role
//         )
//       );
//       dispatch(authLogout(expiry));
//     })
//     .catch((err) => {
//       dispatch(authFailureCreator("Error"));
//     });

//auto login the user
export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  if (!token) dispatch(authLogoutCreator());
  else {
    const expirationDate = new Date(localStorage.getItem("expiryTime"));
    if (expirationDate > new Date()) {
      const user = jwtDecode(token);
      axiosInst.defaults.headers.common["auth"] = `Bearer ${token}`;
      dispatch(
        authSuccessCreator(token, userid, user.name, user.email, user.role)
      );
      dispatch(
        authLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
      );
    } else {
      dispatch(authLogoutCreator());
    }
  }
};
