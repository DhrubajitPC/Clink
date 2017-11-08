import React, {Component} from 'react';
import {
	View,
	Text,
  Modal,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';

// native-base
import { Spinner } from 'native-base';

// facebook oauth
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';

//firebase
import config from '../config';
import * as firebase from 'firebase';
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const db = firebase.database();

class LoginPage extends Component {
	constructor(props){
		super(props);
    this.state = {
      loading: false,
    };
    this.afterLogin = this.afterLogin.bind(this);
	}

  afterLogin(token){
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        console.log('result ', result)
        const uid = result.uid;
        db.ref(`users/${uid}`).once('value', snapshot => {
          const val = snapshot.val();
          if(!!val) {
            const user = {
              firstName: val.firstName,
              lastName: val.lastName,
              email: val.email,
              qrCode: val.qrCode,
              photo_url: val.photo_url,
              companyName: val.companyName,
              companyPosition: val.companyPosition,
              contactNumber: val.contactNumber,
              uid: val.uid,
            }
            this.props.actions.updateUser(user);
            this.setState({
              loading: false,
            });
            Actions.home();
          } else {
            this.setState({
              loading: false,
            });
            Actions.profile({fbProfile: e.profile, firebase_uid: uid});
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
              textAlign: 'center',
              flex: 1,
              justifyContent: 'center',
              padding: 20,
            }}
            ref={(fbLogin) => { this.fbLogin = fbLogin }}
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            permissions={["email"]}
            onLogin={function(e){
              console.log('login ', e);
              _this.setState({
                loading: true,
              });
              afterLogin(e.credentials.token);
            }}
            onLoginFound={function(e){
              console.log('loginfound ', e);
              _this.setState({
                loading: true,
              });
              afterLogin(e.credentials.token);
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
