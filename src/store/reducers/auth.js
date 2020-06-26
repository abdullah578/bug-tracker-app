import * as actionTypes from "../actions/actionTypes";

const initialState = {
  id: null,
  token: null,
  error: null,
  email: null,
  name: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        token: action.token,
        id: action.userid,
        email: action.email,
        name: action.name,
        error: null,
      };
    case actionTypes.AUTH_FAILURE:
      return {
        ...state,
        token: null,
        id: null,
        error: action.error,
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        id: null,
        email: null,
        name: null,
      };
    default:
      return state;
  }
};

export default authReducer;
