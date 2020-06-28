import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

export const fetchProjTicketsCreator = (id) => (dispatch) => {
  dispatch({ type: actionTypes.FETCH_PROJ_TICKETS_INIT });
  axios
    .get(`/tickets.json?orderBy="projid"&equalTo="${id}"`)
    .then((resp) => {
      const ticketsArr = resp.data
        ? Object.keys(resp.data).map((key) => ({ ...resp.data[key], key }))
        : [];
      dispatch({
        type: actionTypes.FETCH_PROJ_TICKETS_SUCCESS,
        tickets: ticketsArr,
        id,
      });
    })
    .catch((err) =>
      dispatch({
        type: actionTypes.FETCH_PROJ_TICKETS_FAILURE,
        error: err,
      })
    );
};

export const getTicketsCreator = (id) => {
  return {
    type: actionTypes.GET_TICKETS,
    id,
  };
};
export const fetchUserTicketsCreator = () => (dispatch) => {
  dispatch({ type: actionTypes.FETCH_USER_TICKETS_INIT });
  axios
    .get(`/tickets.json`)
    .then((resp) => {
      const ticketsArr = resp.data
        ? Object.keys(resp.data).map((key) => ({ ...resp.data[key], key }))
        : [];
      dispatch({
        type: actionTypes.FETCH_USER_TICKETS_SUCCESS,
        tickets: ticketsArr,
      });
    })
    .catch((err) =>
      dispatch({
        type: actionTypes.FETCH_USER_TICKETS_FAILURE,
        error: err,
      })
    );
};
export const submitProjTicketsCreator = (id, tick, key) => (dispatch) => {
  if (key === "new")
    axios
      .post("/tickets.json", tick)
      .then((resp) => {
        console.log(resp);
        dispatch({
          type: actionTypes.ADD_TICKET,
          id,
          key,
          ticket: { ...tick, key: resp.data.name },
        });
      })
      .catch((err) => console.log(err));
  else
    axios
      .put(`/tickets/${key}.json`, tick)
      .then((resp) => {
        dispatch({
          type: actionTypes.UPDATE_TICKET,
          id,
          key,
          ticket: { ...tick, key },
        });
      })
      .catch((err) => console.log(err));
};

export const deleteTicketCreator = (projectID, ticketKey) => (dispatch) => {
  console.log("hellooo");
  axios
    .delete(`/tickets/${ticketKey}.json`)
    .then((resp) => dispatch(fetchProjTicketsCreator(projectID)))
    .catch((err) => console.log(err));
};

export const deleteUserTicketCreator = (projectID, userEmail) => (dispatch) => {
  axios
    .get(`/tickets.json?orderBy="projid"&equalTo="${projectID}"`)
    .then((resp) => {
      const filterKeys = Object.keys(resp.data).filter(
        (key) =>
          resp.data[key].assignedEmail === userEmail ||
          resp.data[key].submitterEmail === userEmail
      );
      filterKeys.forEach((key) => {
        axios
          .delete(`/tickets/${key}.json`)
          .then((resp) => dispatch({ type: actionTypes.DELETE_TICKET, key }))
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
};
