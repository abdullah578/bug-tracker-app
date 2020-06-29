import * as actionTypes from "../actions/actionTypes";
const initialState = {
  users: [],
  allUsers: [],
  projUsers: [],
  allProjUsers: {},
  dispSpinner: false,
  error: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERS_INIT: {
      return {
        ...state,
        dispSpinner: true,
        error: false,
        allUsers: [],
        users: [],
      };
    }
    case actionTypes.FETCH_PROJ_USERS_INIT: {
      return {
        ...state,
        dispSpinner: true,
        error: false,
        projUsers: [],
      };
    }
    case actionTypes.FETCH_USERS_SUCCESS: {
      return {
        ...state,
        users: action.users,
        dispSpinner: false,
        error: false,
        allUsers: action.allUsers,
      };
    }
    case actionTypes.FETCH_USERS_FAILURE: {
      return {
        ...state,
        dispSpinner: false,
        error: true,
      };
    }
    case actionTypes.UPDATE_USERS: {
      const index = state.allUsers.findIndex((curr) => curr.key === action.key);
      const allUsersCopy = [...state.allUsers];
      allUsersCopy[index] = action.obj;
      return {
        ...state,
        allUsers: allUsersCopy,
        users: allUsersCopy.filter((curr) => curr.role !== "N/A"),
      };
    }
    case actionTypes.FETCH_PROJ_USERS_SUCCESS: {
      return {
        ...state,
        allProjUsers: { ...state.allProjUsers, [action.projid]: action.users },
        projUsers: action.users,
        dispSpinner: false,
        error: false,
      };
    }
    case actionTypes.FETCH_PROJ_USERS_FAILURE: {
      return {
        ...state,
        dispSpinner: false,
        error: true,
      };
    }
    case actionTypes.GET_PROJ_USERS: {
      return {
        ...state,
        projUsers: state.allProjUsers[action.id],
      };
    }
    case actionTypes.UPDATE_PROJ_USERS: {
      return {
        ...state,
        projUsers: state.projUsers.concat(action.obj),
        allProjUsers: {
          ...state.allProjUsers,
          [action.id]: state.allProjUsers[action.id].concat(action.obj),
        },
      };
    }
    case actionTypes.DELETE_PROJ_USERS: {
      return {
        ...state,
        projUsers: state.projUsers.filter((curr) => curr.key !== action.key),
        allProjUsers: {
          ...state.allProjUsers,
          [action.id]: state.allProjUsers[action.id].filter(
            (curr) => curr.key !== action.key
          ),
        },
      };
    }
    default:
      return state;
  }
};

export default userReducer;
