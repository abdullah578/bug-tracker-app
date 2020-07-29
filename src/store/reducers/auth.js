import * as actionTypes from "../actions/actionTypes";

const initialState = {
  id: null,
  token: null,
  expiredToken: null,
  expiredUserid: null,
  error: null,
  email: null,
  name: null,
  role: null,
  timeoutID: null,
};

const authSuccess = (state, action) => ({
  ...state,
  token: action.token,
  id: action.userid,
  email: action.email,
  name: action.name,
  role: action.role,
  error: null,
});
const authFailure = (state, action) => ({
  ...state,
  token: null,
  id: null,
  error: action.error,
});
const setTimeoutID = (state, action) => ({
  ...state,
  timeoutID: action.id,
});
const setExpiredToken = (state, action) => ({
  ...state,
  expiredToken: action.token,
  expiredUserid: action.userid,
});
const clearExpiredToken = (state, action) => ({
  ...state,
  expiredToken: null,
  expiredUserid: null,
});
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAILURE:
      return authFailure(state, action);
    case actionTypes.AUTH_EXPIRE:
      return setExpiredToken(state, action);
    case actionTypes.AUTH_EXPIRE_CLEAR:
      return clearExpiredToken(state, action);
    case actionTypes.SET_TIMEOUT_ID:
      return setTimeoutID(state, action);
    default:
      return state;
  }
};

export default authReducer;
