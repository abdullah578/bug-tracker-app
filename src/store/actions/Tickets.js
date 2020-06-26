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
      });
    })
    .catch((err) =>
      dispatch({
        type: actionTypes.FETCH_PROJ_TICKETS_FAILURE,
        error: err,
      })
    );
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

export const submitProjTicketsCreator = (id, ticket) => (dispatch) => {
  axios
    .post("/tickets.json", ticket)
    .then((resp) => dispatch(fetchProjTicketsCreator(id)))
    .catch((err) => console.log(err));
};

export const deleteTicketCreator = (projectID, ticketKey) => (dispatch) => {
console.log("hellooo")
  axios
    .delete(`/tickets/${ticketKey}.json`)
    .then((resp) => dispatch(fetchProjTicketsCreator(projectID)))
    .catch((err) => console.log(err));
};
