import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import * as actions from './store/actions/index';
import Nav from './components/Nav/Nav';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout';
import Home from './containers/Home/Home';
import Entries from './containers/Entries/Entries';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.checkLogin();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/login" component={Auth} />
        <Redirect to="/login" />
      </Switch>
    )

    if (this.props.isAuth) {
      routes = (
        <Switch>
          <Route path="/logout" component={Logout}></Route>
          <Route path="/entries/:name" component={Entries} />
          <Route path="/home" component={Home} />
          <Redirect to="/home" />
        </Switch>
      )
    }

    return (
      <BrowserRouter>
        <Nav />
        {routes}
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkLogin: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


