import * as actionTypes from "../actions/actionTypes";
const initialState = {
  projects: [],
  error: false,
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROJECTS_SUCCESS: {
      console.log(action.projects);
      return {
        ...state,
        projects: action.projects,
        error: false,
      };
    }
    case actionTypes.FETCH_PROJECTS_FAILURE: {
      return {
        ...state,
        error: true,
      };
    }
    default:
      return state;
  }
};

export default projectReducer;
