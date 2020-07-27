import * as actionTypes from "../actions/actionTypes";
const initialState = {
  users: [],
  allUsers: [],
  projUsers: [],
  allProjUsers: {},
  dispSpinner: false,
  error: false,
};

const fetchUsersInit = (state, action) => ({
  ...state,
  dispSpinner: true,
  error: false,
  allUsers: [],
  users: [],
});
const fetchUsersSuccess = (state, action) => ({
  ...state,
  users: action.users,
  dispSpinner: false,
  error: false,
  allUsers: action.allUsers,
});
const fetchUsersFailure = (state, action) => ({
  ...state,
  dispSpinner: false,
  error: true,
});
const fetchProjUsersInit = (state, action) => ({
  ...state,
  dispSpinner: true,
  error: false,
  projUsers: [],
});
const fetchProjUsersSucess = (state, action) => ({
  ...state,
  allProjUsers: { ...state.allProjUsers, [action.projid]: action.users },
  projUsers: action.users,
  dispSpinner: false,
  error: false,
});
const fetchProjUsersFailure = (state, action) => ({
  ...state,
  dispSpinner: false,
  error: true,
});
const updateUsers = (state, action) => {
  const allUsersCopy = [...state.allUsers];
  const index = state.allUsers.findIndex((curr) => curr.key === action.key);
  allUsersCopy[index] = action.obj;
  return {
    ...state,
    allUsers: allUsersCopy,
    users: allUsersCopy.filter((curr) => curr.role !== "N/A"),
  };
};
const updateUserRoles = (state, action) => {
  if (!state.allProjUsers[action.id]) return state;
  const userIndex = state.allProjUsers[action.id].findIndex(
    (curr) => curr.key === action.key
  );
  if (userIndex === -1) return state;
  const userCopy = [...state.allProjUsers[action.id]];
  if (action.user.role !== "N/A") userCopy[userIndex] = action.user;
  else userCopy.splice(userIndex, 1);
  return {
    ...state,
    allProjUsers: {
      ...state.allProjUsers,
      [action.id]: userCopy,
    },
  };
};
const updateProjUsers = (state, action) => ({
  ...state,
  projUsers: state.projUsers.concat(action.obj),
  allProjUsers: {
    ...state.allProjUsers,
    [action.id]: state.allProjUsers[action.id].concat(action.obj),
  },
});
const deleteProjUsers = (state, action) => ({
  ...state,
  projUsers: state.projUsers.filter((curr) => curr.key !== action.key),
  allProjUsers: {
    ...state.allProjUsers,
    [action.id]: state.allProjUsers[action.id].filter(
      (curr) => curr.key !== action.key
    ),
  },
});

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERS_INIT:
      return fetchUsersInit(state, action);
    case actionTypes.FETCH_USERS_SUCCESS:
      return fetchUsersSuccess(state, action);
    case actionTypes.FETCH_USERS_FAILURE:
      return fetchUsersFailure(state, action);
    case actionTypes.FETCH_PROJ_USERS_INIT:
      return fetchProjUsersInit(state, action);
    case actionTypes.FETCH_PROJ_USERS_SUCCESS:
      return fetchProjUsersSucess(state, action);
    case actionTypes.FETCH_PROJ_USERS_FAILURE:
      return fetchProjUsersFailure(state, action);
    case actionTypes.UPDATE_USERS:
      return updateUsers(state, action);
    case actionTypes.UPDATE_PROJ_USERS: {
      return updateProjUsers(state, action);
    }
    case actionTypes.UPDATE_USER_ROLES: {
      return updateUserRoles(state, action);
    }
    case actionTypes.DELETE_PROJ_USERS: {
      return deleteProjUsers(state, action);
    }
    default:
      return state;
  }
};

export default userReducer;
