import React, { Component, Fragment } from "react";
import Dimensions from "react-dimensions";
import { withRouter } from "react-router-dom";
import { getToken } from "../../services/auth";
import { Container } from "./styles";
import NavBar from "../NavBar/navbar";

const token = getToken();
class HomePage extends Component {

  render() {
    return (
      <Fragment>
        <NavBar {...this.props} />
        <Container>
          <h4>Você está logado! Ao chegar nessa tela você já tem seu token</h4>
          <h1>{token}</h1>
        </Container>
      </Fragment>
    );
  }
}

const HomePageConst = withRouter(Dimensions()(HomePage));
const Home = () => (
  <Fragment>
    <HomePageConst />
  </Fragment>

);

export default Home;
