import * as actionTypes from "../actions/actionTypes";
const initialState = {
  tickets: [],
  userTickets: [],
  dispSpinner: false,
  error: false,
};

const ticketsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_TICKETS_INIT: {
      return {
        ...state,
        error: false,
        dispSpinner: true,
      };
    }
    case actionTypes.FETCH_USER_TICKETS_SUCCESS: {
      return {
        ...state,
        dispSpinner: false,
        error: false,
        userTickets: action.tickets,
      };
    }
    case actionTypes.FETCH_USER_TICKETS_FAILURE: {
      return {
        ...state,
        dispSpinner: false,
        error: true,
      };
    }
    case actionTypes.FETCH_PROJ_TICKETS_INIT: {
      return {
        ...state,
        dispSpinner: true,
        error: false,
      };
    }
    case actionTypes.FETCH_PROJ_TICKETS_SUCCESS: {
      return {
        ...state,
        dispSpinner: false,
        tickets: action.tickets,
      };
    }
    case actionTypes.FETCH_PROJ_TICKETS_FAILURE: {
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

export default ticketsReducer;
