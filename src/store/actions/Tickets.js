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
    ticketsArr = ticketsArr.filter(
      (curr) => !state.ticket.userTickets.find((tick) => tick.key === curr.key)
    );
    ticketsArr.forEach((ticket) => {
      if (!projObj[ticket.projid]) projObj[ticket.projid] = [];
      projObj[ticket.projid] = projObj[ticket.projid].concat(ticket);
    });
    if (!projObj[id]) projObj[id] = [];
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

//fetch project tickets from API

export const fetchProjTicketsCreator = (id, email, role, token) => (
  dispatch
) => {
  dispatch(fetchProjTicketsInit());
  if (role === "Admin" || role === "Project Manager") {
    axios
      .get(`/tickets.json?auth=${token}&orderBy="projid"&equalTo="${id}"`)
      .then((resp) => {
        const ticketsArr = parseResponse(resp);
        dispatch(fetchProjTicketsSuccess(ticketsArr, id));
      })
      .catch((err) => dispatch(fetchProjTicketsFailure(err)));
  } else {
    dispatch(
      fetchTicketCreator(
        `/tickets.json?auth=${token}&orderBy="assignedEmail"&equalTo="${email}"`,
        id
      )
    );
    dispatch(
      fetchTicketCreator(
        `/tickets.json?auth=${token}&orderBy="submitterEmail"&equalTo="${email}"`,
        id
      )
    );
  }
};

export const fetchUserTicketsCreator = (email, role, token, key) => (
  dispatch
) => {
  dispatch(fetchUserTicketsInit());
  if (role === "Admin")
    axios
      .get(`/tickets.json?auth=${token}`)
      .then((resp) => {
        const ticketsArr = parseResponse(resp);
        dispatch(fetchUserTicketsSuccess(ticketsArr));
      })
      .catch((err) => dispatch(fetchUserTicketsFailure(err)));
  else if (role === "Project Manager") {
    axios
      .get(`/users.json?auth=${token}`)
      .then((users) => {
        const projKeys = [];
        Object.keys(users.data).forEach((id) => {
          if (key in users.data[id]) projKeys.push(id);
        });
        axios.get(`/tickets.json?auth=${token}`).then((tickets) => {
          const ticketsArr = parseResponse(tickets).filter((curr) =>
            projKeys.includes(curr.projid)
          );
          dispatch(fetchUserTicketsSuccess(ticketsArr));
        });
      })
      .catch((err) => dispatch(fetchUserTicketsFailure(err)));
  } else {
    dispatch(
      fetchTicketCreator(
        `/tickets.json?auth=${token}&orderBy="assignedEmail"&equalTo="${email}"`
      )
    );
    dispatch(
      fetchTicketCreator(
        `/tickets.json?auth=${token}&orderBy="submitterEmail"&equalTo="${email}"`
      )
    );
  }
};
//save ticket to API
export const submitProjTicketsCreator = (id, tick, key, token) => (
  dispatch
) => {
  if (key === "new")
    axios
      .post(`/tickets.json?auth=${token}`, tick)
      .then((resp) => {
        dispatch(addNewTicket(tick, id, resp.data.name));
      })
      .catch((err) => console.log(err));
  else
    axios
      .put(`/tickets/${key}.json?auth=${token}`, { ...tick })
      .then((resp) => {
        dispatch(updateTicket(tick, id, key));
      })
      .catch((err) => console.log(err));
};

//delete ticket from API
export const deleteTicketCreator = (projectID, ticketKey, token) => (
  dispatch
) => {
  axios
    .delete(`/tickets/${ticketKey}.json?auth=${token}`)
    .then((resp) =>
      dispatch({
        type: actionTypes.DELETE_TICKET,
        key: ticketKey,
        id: projectID,
      })
    )
    .catch((err) => console.log(err));
};
