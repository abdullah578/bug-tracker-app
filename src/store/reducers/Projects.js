import * as actionTypes from "../actions/actionTypes";
const initialState = {
  projects: [],
  dispSpinner: false,
  error: false,
};
const fetchProjectsInit = (state, action) => ({
  ...state,
  dispSpinner: true,
  error: false,
});
const fetchProjectsSuccess = (state, action) => ({
  ...state,
  projects: action.projects,
  dispSpinner: false,
  error: false,
});
const fetchProjectsFailure = (state, action) => ({
  ...state,
  dispSpinner: false,
  error: true,
});
const updateProject = (state, action) => ({
  ...state,
  projects: state.projects.concat(action.proj),
});
const deleteProject = (state, action) => ({
  ...state,
  projects: state.projects.filter((curr) => curr.key !== action.id),
});

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROJECTS_INIT:
      return fetchProjectsInit(state, action);

    case actionTypes.FETCH_PROJECTS_SUCCESS:
      return fetchProjectsSuccess(state, action);

    case actionTypes.FETCH_PROJECTS_FAILURE:
      return fetchProjectsFailure(state, action);

    case actionTypes.UPDATE_PROJECT:
      return updateProject(state, action);
    case actionTypes.DELETE_PROJECT:
      return deleteProject(state, action);

    default:
      return state;
  }
};

export default projectReducer;
