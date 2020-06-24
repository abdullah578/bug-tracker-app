import React, { Component } from "react";
import BackDrop from "../components/UI/BackDrop/BackDrop";
import Content from "../components/UI/Content/Content";
const WithErrorHandle = (Wrapped, axios) => {
  return class extends Component {
    state = {
      error: null,
    };
    componentWillMount() {
      this.reqInterceptor = axios.interceptors.request.use(
        (req) => {
          this.setState({ error: null });
          return req;
        },
        (err) => {
          this.setState({ error: err });
          return Promise.reject(err);
        }
      );
      this.respInterceptor = axios.interceptors.response.use(
        (resp) => {
          this.setState({ error: null });
          return resp;
        },
        (err) => {
          this.setState({ error: err.message });
          return Promise.reject(err);
        }
      );
    }
    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.respInterceptor);
    }
    removeError = () => this.setState({ error: null });
    render() {
      return (
        <React.Fragment>
          <BackDrop
            show={this.state.error !== null}
            clicked={this.removeError}
          />
          <Content open={this.state.error !== null}>
            <p>{this.state.error}</p>
          </Content>
          <Wrapped {...this.props} />
        </React.Fragment>
      );
    }
  };
};
export default WithErrorHandle;
