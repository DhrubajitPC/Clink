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
			permissions={["email"]}
			onLogin={function(e){
				console.log('login ', e);
				const credential = firebase.auth.FacebookAuthProvider.credential(e.credentials.token);
				firebase
					.auth()
					.signInWithCredential(credential)
					.then(result => {
						console.log('result ', result)
						const uid = result.uid;
						db.ref(`users/${uid}`).once('value', snapshot => {
							const val = snapshot.val();
							if(!!val){
								const user = {
									firstName: val.firstName,
									lastName: val.lastName,
									email: val.email,
									qrCode: val.qrCode,
									photo_url: val.picture.data.url,
									companyName: val.companyName,
									companyPosition: val.companyPosition,
								}
								this.props.actions.updateUser(user);
								Actions.home();
							}else{
								Actions.profile({fbProfile: e.profile, firebase_uid: uid});
							}
						})
					})
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
