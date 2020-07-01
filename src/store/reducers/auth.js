import * as actionTypes from "../actions/actionTypes";

const initialState = {
  id: null,
  token: null,
  error: null,
  email: null,
  name: null,
  role: null,
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
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAILURE:
      return authFailure(state, action);
    default:
      return state;
  }
};

export default authReducer;
