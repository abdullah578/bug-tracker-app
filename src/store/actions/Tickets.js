import * as actionTypes from "./actionTypes";
import { parseTicketResponse as parseResponse } from "../Utils/Utils";
import axios from "../../axiosInstance/AxiosInstance";

const fetchProjTicketsInit = () => ({
  type: actionTypes.FETCH_PROJ_TICKETS_INIT,
});

const fetchTicketCreator = (url, id) => (dispatch, getState) => {
  axios.get(url).then((resp) => {
    let ticketsArr = parseResponse(resp);
    const state = getState();
    const projObj = { ...state.ticket.allProjTickets };
    if (!ticketsArr.length && !state.ticket.allProjTickets[id])
      projObj[id] = [];
    else {
      ticketsArr = ticketsArr.filter(
        (curr) =>
          !state.ticket.userTickets.find((tick) => tick.key === curr.key)
      );
      ticketsArr.forEach((ticket) => {
        if (!projObj[ticket.projid]) projObj[ticket.projid] = [];
        projObj[ticket.projid] = projObj[ticket.projid].concat(ticket);
      });
    }
    dispatch(fetchProjTicketsSuccess(ticketsArr, id, projObj));
  });
};
const fetchProjTicketsSuccess = (tickets, projID, projObj) => ({
  type: actionTypes.FETCH_PROJ_TICKETS_SUCCESS,
  tickets,
  id: projID,
  proj: projObj,
});
const fetchProjTicketsFailure = (err) => ({
  type: actionTypes.FETCH_PROJ_TICKETS_FAILURE,
  error: err,
});
const fetchUserTicketsInit = () => ({
  type: actionTypes.FETCH_USER_TICKETS_INIT,
});
const fetchUserTicketsSuccess = (tickets) => ({
  type: actionTypes.FETCH_USER_TICKETS_SUCCESS,
  tickets,
});
const fetchUserTicketsFailure = (err) => ({
  type: actionTypes.FETCH_USER_TICKETS_FAILURE,
  error: err,
});
const addNewTicket = (tick, projectID, ticketKey) => ({
  type: actionTypes.ADD_TICKET,
  id: projectID,
  key: "new",
  ticket: { ...tick, key: ticketKey },
});
const updateTicket = (tick, projID, ticketKey) => ({
  type: actionTypes.UPDATE_TICKET,
  id: projID,
  key: ticketKey,
  ticket: { ...tick, key: ticketKey },
});

export const fetchProjTicketsCreator = (id, email, role) => (dispatch) => {
  dispatch(fetchProjTicketsInit());
  if (role === "Admin") {
    axios
      .get(`/tickets.json?orderBy="projid"&equalTo="${id}"`)
      .then((resp) => {
        const ticketsArr = parseResponse(resp);
        dispatch(fetchProjTicketsSuccess(ticketsArr, id));
      })
      .catch((err) => dispatch(fetchProjTicketsFailure(err)));
  } else {
    dispatch(
      fetchTicketCreator(
        `/tickets.json?orderBy="assignedEmail"&equalTo="${email}"`,
        id
      )
    );
    dispatch(
      fetchTicketCreator(
        `/tickets.json?orderBy="submitterEmail"&equalTo="${email}"`,
        id
      )
    );
  }
};

export const getTicketsCreator = (id) => {
  return {
    type: actionTypes.GET_TICKETS,
    id,
  };
};
export const fetchUserTicketsCreator = (email, role) => (dispatch) => {
  dispatch(fetchUserTicketsInit());
  if (role === "Admin")
    axios
      .get(`/tickets.json`)
      .then((resp) => {
        const ticketsArr = parseResponse(resp);
        dispatch(fetchUserTicketsSuccess(ticketsArr));
      })
      .catch((err) => dispatch(fetchUserTicketsFailure(err)));
  else {
    dispatch(
      fetchTicketCreator(
        `/tickets.json?orderBy="assignedEmail"&equalTo="${email}"`
      )
    );
    dispatch(
      fetchTicketCreator(
        `/tickets.json?orderBy="submitterEmail"&equalTo="${email}"`
      )
    );
  }
};
export const submitProjTicketsCreator = (id, tick, key) => (dispatch) => {
  if (key === "new")
    axios
      .post("/tickets.json", tick)
      .then((resp) => {
        dispatch(addNewTicket(tick, id, resp.data.name));
      })
      .catch((err) => console.log(err));
  else
    axios
      .put(`/tickets/${key}.json`, { ...tick })
      .then((resp) => {
        dispatch(updateTicket(tick, id, key));
      })
      .catch((err) => console.log(err));
};

export const deleteTicketCreator = (projectID, ticketKey) => (dispatch) => {
  axios
    .delete(`/tickets/${ticketKey}.json`)
    .then((resp) =>
      dispatch({
        type: actionTypes.DELETE_TICKET,
        key: ticketKey,
        id: projectID,
      })
    )
    .catch((err) => console.log(err));
};
