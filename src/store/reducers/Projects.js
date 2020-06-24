import * as actionTypes from "../actions/actionTypes";
const initialState = {
  projects: [],
  dispSpinner: false,
  error: false,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROJECTS_INIT: {
      return {
        ...state,
        dispSpinner: true,
        error: false,
      };
    }
    case actionTypes.FETCH_PROJECTS_SUCCESS: {
      return {
        ...state,
        projects: action.projects,
        dispSpinner: false,
        error: false,
      };
    }
    case actionTypes.FETCH_PROJECTS_FAILURE: {
      return {
        ...state,
        dispSpinner: false,
        error: true,
      };
    }
    default:
      return state;
  }
};

export default projectReducer;
