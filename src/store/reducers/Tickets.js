import * as actionTypes from "../actions/actionTypes";
const initialState = {
  userTickets: [],
  allProjTickets: {},
  dispSpinner: false,
  error: false,
};

const fetchUserTicketsInit = (state, action) => ({
  ...state,
  error: false,
  dispSpinner: true,
});
const fetchUserTicketsSuccess = (state, action) => ({
  ...state,
  dispSpinner: false,
  error: false,
  userTickets: action.tickets,
});
const fetchUserTicketsFailure = (state, action) => ({
  ...state,
  dispSpinner: false,
  error: true,
});
const fetchProjTicketsInit = (state, action) => ({
  ...state,
  dispSpinner: true,
  error: false,
  tickets: [],
});
const fetchProjTicketsSuccess = (state, action) => {
  return {
    ...state,
    dispSpinner: false,
    allProjTickets: {
      ...state.allProjTickets,
      [action.id]: action.tickets,
    },
    tickets: action.tickets,
  };
};
const fetchProjTicketsFailure = (state, action) => ({
  ...state,
  dispSpinner: false,
  error: true,
});
const addTicket = (state, action) =>
  !state.allProjTickets[action.id]
    ? state
    : {
        ...state,
        allProjTickets: {
          ...state.allProjTickets,
          [action.id]: state.allProjTickets[action.id].concat(action.ticket),
        },
        userTickets: state.userTickets.concat(action.ticket),
      };
const updateTicket = (state, action) => {
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
  const projTicketsCopy = [...state.allProjTickets[action.id]];
  projTicketsCopy[projIndex] = action.ticket;
  return {
    ...state,
    allProjTickets: {
      ...state.allProjTickets,
      [action.id]: projTicketsCopy,
    },
    userTickets: userTicketsCopy,
  };
};

const deleteTicket = (state, action) => {
  if (!state.allProjTickets[action.id])
    return {
      ...state,

      userTickets: state.userTickets.filter((curr) => curr.key !== action.key),
    };
  else
    return {
      ...state,
      userTickets: state.userTickets.filter((curr) => curr.key !== action.key),
      allProjTickets: {
        ...state.allProjTickets,
        [action.id]: state.allProjTickets[action.id].filter(
          (curr) => curr.key !== action.key
        ),
      },
    };
};

const ticketsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_TICKETS_INIT:
      return fetchUserTicketsInit(state, action);
    case actionTypes.FETCH_USER_TICKETS_SUCCESS:
      return fetchUserTicketsSuccess(state, action);
    case actionTypes.FETCH_USER_TICKETS_FAILURE:
      return fetchUserTicketsFailure(state, action);
    case actionTypes.FETCH_PROJ_TICKETS_INIT:
      return fetchProjTicketsInit(state, action);
    case actionTypes.FETCH_PROJ_TICKETS_SUCCESS:
      return fetchProjTicketsSuccess(state, action);
    case actionTypes.FETCH_PROJ_TICKETS_FAILURE:
      return fetchProjTicketsFailure(state, action);
    case actionTypes.ADD_TICKET:
      return addTicket(state, action);
    case actionTypes.UPDATE_TICKET:
      return updateTicket(state, action);
    case actionTypes.DELETE_TICKET:
      return deleteTicket(state, action);
    default:
      return state;
  }
};

export default ticketsReducer;
