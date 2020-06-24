import * as actionTypes from "../actions/actionTypes";
const initialState = {
  users: [],
  allUsers: [],
  dispSpinner: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERS_INIT: {
      return {
        ...state,
        dispSpinner: true,
        users: [],
        allUsers: [],
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
    default:
      return state;
  }
};

export default userReducer;
