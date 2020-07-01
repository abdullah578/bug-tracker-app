import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

const parseResponse = (resp) => {
  return resp.data
    ? Object.keys(resp.data).map((key) => {
        const ticket = resp.data[key];
        let history = [];
        let comments = [];
        if (ticket.history)
          history = Object.keys(ticket.history).map(
            (index) => ticket.history[index]
          );
        if (ticket.comments)
          comments = Object.keys(ticket.comments).map(
            (index) => ticket.comments[index]
          );
        return { ...resp.data[key], key, history, comments };
      })
    : [];
};
const fetchProjTicketsInit = () => ({
  type: actionTypes.FETCH_PROJ_TICKETS_INIT,
});
const fetchProjTicketsSuccess = (tickets, projID) => ({
  type: actionTypes.FETCH_PROJ_TICKETS_SUCCESS,
  tickets,
  id: projID,
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

export const fetchProjTicketsCreator = (id) => (dispatch) => {
  dispatch(fetchProjTicketsInit());
  axios
    .get(`/tickets.json?orderBy="projid"&equalTo="${id}"`)
    .then((resp) => {
      const ticketsArr = parseResponse(resp);
      dispatch(fetchProjTicketsSuccess(ticketsArr, id));
    })
    .catch((err) => dispatch(fetchProjTicketsFailure(err)));
};

export const getTicketsCreator = (id) => {
  return {
    type: actionTypes.GET_TICKETS,
    id,
  };
};
export const fetchUserTicketsCreator = () => (dispatch) => {
  dispatch(fetchUserTicketsInit());
  axios
    .get(`/tickets.json`)
    .then((resp) => {
      const ticketsArr = parseResponse(resp);
      dispatch(fetchUserTicketsSuccess(ticketsArr));
    })
    .catch((err) => dispatch(fetchUserTicketsFailure(err)));
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
    .then((resp) => dispatch({
      type: actionTypes.DELETE_TICKET,
      key:ticketKey,
      id: projectID,
    }))
    .catch((err) => console.log(err));
};
