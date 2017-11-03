import React, {Component} from 'react';
import {
	View,
	Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';


// facebook oauth
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import FBLoginView from '../components/fbLoginView';

//firebase
import config from '../config';
import * as firebase from 'firebase';
firebase.initializeApp(config);
const db = firebase.database();


// console.log(24, config);


class LoginPage extends Component {
	render(){
		return <FBLogin
			buttonView={<FBLoginView />}
			ref={(fbLogin) => { this.fbLogin = fbLogin }}
			loginBehavior={FBLoginManager.LoginBehaviors.Native}
			permissions={["email","user_friends"]}
			onLogin={function(e){
				console.log('login ', e);
				Actions.home();
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
	}
}

export default connect((state) => ({
    'state': state,
}), (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
})
)(LoginPage);
