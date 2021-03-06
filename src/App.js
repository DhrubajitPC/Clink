/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

// router
import {
  Stack,
  Actions,
  ActionConst,
  Scene,
  Router
} from 'react-native-router-flux';

// native base
import { Root } from "native-base";

// Redux
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// https://github.com/aksonov/react-native-router-flux/blob/master/docs/REDUX_FLUX.md
const RouterWithRedux = connect()(Router);
import reducers from './reducers';
const middleware = [thunk];
const store = compose(
    applyMiddleware(...middleware)
)(createStore)(reducers);

// pages
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Leads from './pages/Leads';
import LeadsDetails from './pages/LeadsDetails';

// require('./config');

export default class App extends Component<{}> {
  render() {
    return (
      <Root>
        <Provider store={store}>
          <RouterWithRedux
            backAndroidHandler={() => {}}
            >
            <Stack key='root'>
              <Scene
                key='login'
                component={Login}
                title='Login'
                initial />
              <Scene
                key='home'
                title='Clink'
                component={Home}
              />
              <Scene
                title='Profile'
                key='profile'
                component={Profile}
              />
              <Scene
                key='leads'
                title='Leads'
                component={Leads}
              />
              <Scene
                key='leadsDetails'
                title='Lead Details'
                component={LeadsDetails}
              />
            </Stack>
          </RouterWithRedux>
        </Provider>
      </Root>
    );
  }
}
