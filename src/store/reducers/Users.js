import * as actionTypes from "../actions/actionTypes";
const initialState = {
  users: [],
  allUsers: [],
  projUsers: [],
  dispSpinner: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERS_INIT: {
      return {
        ...state,
        dispSpinner: true,
        allUsers: [],
        users: [],
      };
    }
    case actionTypes.FETCH_PROJ_USERS_INIT: {
      return {
        ...state,
        dispSpinner: true,
        projUsers: [],
      };
    }
    case actionTypes.FETCH_USERS_SUCCESS: {
      return {
        ...state,
        users: action.users,
        dispSpinner: false,
        allUsers: action.allUsers,
      };
    }
    case actionTypes.FETCH_USERS_FAILURE: {
      return {
        ...state,
        dispSpinner: false,
      };
    }
    case actionTypes.FETCH_PROJ_USERS_SUCCESS: {
      return {
        ...state,
        projUsers: action.users,
        dispSpinner: false,
      };
    }
    case actionTypes.FETCH_PROJ_USERS_FAILURE: {
      return {
        ...state,
        dispSpinner: false,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
