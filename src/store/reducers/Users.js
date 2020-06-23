import * as actionTypes from "../actions/actionTypes";
const initialState = {
  users: [],
  dispSpinner: false,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERS_INIT: {
      return {
        ...state,
        dispSpinner: true,
      };
    }
    case actionTypes.FETCH_USERS_SUCCESS: {
      return {
        ...state,
        users: action.users,
        dispSpinner: false,
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

export default projectReducer;
