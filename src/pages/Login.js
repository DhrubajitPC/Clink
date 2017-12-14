import React, { Component } from 'react';
import {
	View,
	Text,
  Modal,
  BackHandler,
  Dimensions,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import RNExitApp from 'react-native-exit-app';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';

// native-base
import { Spinner, Toast } from 'native-base';

// facebook oauth
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

//firebase
import config from '../config';
import * as firebase from 'firebase';
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const db = firebase.database();
const _width = Dimensions.get('window').width;

class LoginPage extends Component {
	constructor(props){
		super(props);
    this.state = {
      loading: false,
      backPressedOnce: false,
    };
    this.afterLogin = this.afterLogin.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
	}

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  handleBackButton(){
    if(this.state.backPressedOnce) {
      RNExitApp.exitApp();
    }
    Toast.show({
      text: 'Press back again to exit',
      position: 'bottom',
      buttonText: 'Okay'
    });
    this.setState({ backPressedOnce: true });
    setTimeout(() => {
      this.setState({ backPressedOnce: false });
    }, 2000);
    return true;
  }

  afterLogin(loginData){
    const token = loginData.credentials.token;
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        const uid = result.uid;
        db.ref(`users/${uid}`).once('value', snapshot => {
          const val = snapshot.val();
          if(!!val) {
            const user = val;
            this.props.actions.updateUser(user);
            this.setState({
              loading: false,
            });
            const leadsList = user.leads ? Object.values(user.leads) : [];
            leadsList.forEach(uid => {
              db.ref(`users/${uid}`).once('value', snapshot => {
                const val = snapshot.val();
                if (val) {
                  const otherUser = {};
                  otherUser[uid] = val;
                  this.props.actions.addUserToLeads(otherUser);
                }
              });
            });
            Actions.replace('home');
          } else {
            this.setState({
              loading: false,
            });
            Actions.profile({fbProfile: loginData.profile, firebase_uid: uid, type: ActionConst.REPLACE});
          }
        })
      })
      .catch((error) => {
        alert('Account disabled')
        this.setState({
          loading: false,
        });
      });
  }

	render(){
		const actions = this.props.actions;
    const afterLogin = this.afterLogin;
    const _this = this;
		return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
      }}>
        {this.state.loading ?
          <Modal
            onRequestClose={() => console.log('modal closed')}
            visible={true}
            transparent={true}
            animationType='fade'
            >
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(238,238,238,0.4)',
                justifyContent: 'center',
              }}>
                <Spinner color='blue' />
              </View>
          </Modal>
          : null
        }
        <FBLogin
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: 40,
              alignSelf: 'center',
              width: _width * 0.7,
              borderRadius: 5,
            }}
            onClickColor={'transparent'}
            ref={(fbLogin) => { this.fbLogin = fbLogin }}
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            permissions={["email", "public_profile"]}
            onLogin={function(e){
              console.log('login ', e);
              _this.setState({
                loading: true,
              });
              afterLogin(e);
            }}
            onLoginFound={function(e){
              console.log('loginfound ', e);
              _this.setState({
                loading: true,
              });
              afterLogin(e);
            }}
            onLoginNotFound={function(e){console.log('loginnotfound ', e)}}
            onLogout={function(e){console.log('logout ', e)}}
            onCancel={function(e){console.log('cancel ', e)}}
            onPermissionsMissing={function(e){console.log('permissionmissing ', e)}}
          />
      </View>
    );
  }
}

export default connect((state) => ({
    'state': state,
}), (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
})
)(LoginPage);
