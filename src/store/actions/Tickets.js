import * as actionTypes from "./actionTypes";
import axios from "../../axiosInstance/AxiosInstance";

export const fetchProjTicketsCreator = (id) => (dispatch) => {
  dispatch({ type: actionTypes.FETCH_PROJ_TICKETS_INIT });
  axios.get(`/tickets.json?orderBy="projid"&equalTo="${id}"`).then((resp) => {
    const ticketsArr = resp.data
      ? Object.keys(resp.data).map((key) => ({ ...resp.data[key], key }))
      : [];
    dispatch({
      type: actionTypes.FETCH_PROJ_TICKETS_SUCCESS,
      tickets: ticketsArr,
    });
  });
};

export const submitProjTicketsCreator = (id, ticket) => (dispatch) => {
  axios
    .post("/tickets.json", ticket)
    .then((resp) => dispatch(fetchProjTicketsCreator(id)));
};
