import * as actionTypes from "../actions/actionTypes";
const initialState = {
  tickets: [],
  userTickets: [],
  allProjTickets: {},
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
        tickets:[]
      };
    }
    case actionTypes.FETCH_PROJ_TICKETS_SUCCESS: {
      return {
        ...state,
        dispSpinner: false,
        allProjTickets: {
          ...state.allProjTickets,
          [action.id]: action.tickets,
        },
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
    case actionTypes.GET_TICKETS: {
      return {
        ...state,
        tickets: state.allProjTickets[action.id],
      };
    }
    case actionTypes.ADD_TICKET: {
      if (!state.allProjTickets[action.id]) return state;
      return {
        ...state,
        allProjTickets: {
          ...state.allProjTickets,
          [action.id]: state.allProjTickets[action.id].concat(action.ticket),
        },
        tickets:state.tickets.concat(action.ticket),
        userTickets: state.userTickets.concat(action.ticket),
      };
    }
    case actionTypes.UPDATE_TICKET: {
      const userIndex = state.userTickets.findIndex(
        (curr) => curr.key === action.key
      );
      const userTicketsCopy = [...state.userTickets];
      if (userIndex !== -1) userTicketsCopy[userIndex] = action.ticket;
      if (!state.allProjTickets[action.id])
        return { ...state, userTickets: userTicketsCopy };
      const projIndex = state.allProjTickets[action.id].findIndex(
        (curr) => curr.key === action.key
      );
      console.log(state.allProjTickets);
      console.log(action.id);
      console.log(projIndex);
      const projTicketsCopy = [...state.allProjTickets[action.id]];
      projTicketsCopy[projIndex] = action.ticket;
      return {
        ...state,
        allProjTickets: {
          ...state.allProjTickets,
          [action.id]: projTicketsCopy,
        },
        tickets: projTicketsCopy,
        userTickets: userTicketsCopy,
      };
    }
    case actionTypes.DELETE_TICKET: {
      return {
        state,
        tickets: state.tickets.filter((curr) => curr.key !== action.key),
        userTickets: state.userTickets.filter(
          (curr) => curr.key !== action.key
        ),
      };
    }
    default:
      return state;
  }
};

export default ticketsReducer;
