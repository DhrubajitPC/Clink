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
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import FBLoginView from './components/fbLoginView';
import * as firebase from 'firebase';
require('./config');

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        <FBLogin
          buttonView={<FBLoginView />}
          ref={(fbLogin) => { this.fbLogin = fbLogin }}
          loginBehavior={FBLoginManager.LoginBehaviors.Native}
          permissions={["email","user_friends"]}
          onLogin={function(e){
            console.log('login ', e);
            const credential = firebase.auth.FacebookAuthProvider.credential(e.credentials.token);
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(() => alert('Account accepted'))
              .catch((error) => alert('Account disabled'));
            console.log('login end');
          }}
          onLoginFound={function(e){console.log('loginfound ', e)}}
          onLoginNotFound={function(e){console.log('loginnotfound ', e)}}
          onLogout={function(e){console.log('logout ', e)}}
          onCancel={function(e){console.log('cancel ', e)}}
          onPermissionsMissing={function(e){console.log('permissionmissing ', e)}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
