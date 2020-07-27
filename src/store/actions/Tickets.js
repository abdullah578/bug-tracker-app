import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

const fetchProjTicketsInit = () => ({
  type: actionTypes.FETCH_PROJ_TICKETS_INIT,
});
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

  axios
    .get(`/tickets/${id}`)
    .then((resp) => {
      const ticketsArr = resp.data;
      dispatch(fetchProjTicketsSuccess(ticketsArr, id));
    })
    .catch((err) => dispatch(fetchProjTicketsFailure(err)));
};

export const fetchUserTicketsCreator = (email, role, token, key) => (
  dispatch
) => {
  dispatch(fetchUserTicketsInit());
  axios
    .get("/tickets")
    .then((resp) => {
      const ticketsArr = resp.data;
      dispatch(fetchUserTicketsSuccess(ticketsArr));
    })
    .catch((err) => dispatch(fetchUserTicketsFailure(err)));
};
//save ticket to API
export const submitProjTicketsCreator = (id, tick, key, token) => (
  dispatch
) => {
  if (key === "new")
    axios
      .post("/tickets", tick)
      .then((resp) => {
        dispatch(addNewTicket(tick, id, resp.data.name));
      })
      .catch((err) => console.log(err));
  else
    axios
      .put(`/tickets/${key}`, { ...tick })
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
    .delete(`/tickets/${ticketKey}`)
    .then((resp) =>
      dispatch({
        type: actionTypes.DELETE_TICKET,
        key: ticketKey,
        id: projectID,
      })
    )
    .catch((err) => console.log(err));
};
