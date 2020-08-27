import React, { Component } from 'react';
import './App.css';

import Homepage from './HomePage'
import Result from './Result'

import {
  Route,
  Switch,
  Redirect,
  withRouter
} from "react-router-dom"

function App(props) {
  const { history } = props
  return (
    <div className="App">
      <Switch>
        <Route history={history} exact path='/' component={Homepage} />
        <Route history={history} path='/result/:link' component={Result} />
      </Switch>
    </div>
  );
}

export default withRouter(App)
