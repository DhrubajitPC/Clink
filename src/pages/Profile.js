import React, {Component} from 'react';
import {
	View,
	Text,
	Platform,
	StyleSheet,
	Button,
	Image,
	ScrollView,
} from 'react-native';
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';

// forms
import t from 'tcomb-form-native';
const Form = t.form.Form;

// firebase
import * as firebase from 'firebase';
const db = firebase.database();

// qr code
import QRCode from 'react-native-qrcode';

const type = t.struct({
		firstName: t.String,
		lastName: t.String,
		email: t.String,
		contactNumber: t.Number,
		companyName: t.String,
		companyPosition: t.String,
		qrCode: t.maybe(t.String),
		uid: t.String
});

const options = {
	fields: {
		firstName: {
			label: 'First Name*',
			error: 'First Name cannot be blank',
		},
		lastName: {
			label: 'Last Name*',
			error: 'Last Name cannot be blank',
		},
		email: {
			label: 'Email Address*',
			error: 'Email Address cannot be blank',
		},
		contactNumber: {
			label: 'Contact Number*',
			error: 'Contact Number cannot be blank',
		},
		companyName: {
			label: 'Company Name*',
			error: 'Company Name cannot be blank',
		},
		companyPosition: {
			label: 'Company Position*',
			error: 'Company Position cannot be blank',
		},
		qrCode: {
			hidden: true,
			editable: false,
		},
		uid: {
			hidden: true,
			editable: false,
		}
	}
}

class ProfilePage extends Component {

	constructor(props){
		super(props);
		console.log('props ', props);
		const { fbProfile, user } = props;
		let initialValues = {};
		if(fbProfile){
			initialValues = {
				firstName: fbProfile.first_name,
				lastName: fbProfile.last_name,
				email: fbProfile.email,
				photo: fbProfile.picture.data.url,
				uid: props.firebase_uid,
			};
		} else {
			initialValues = {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				photo: user.photo,
				contactNumber: user.contactNumber,
				companyName: user.companyName,
				companyPosition: user.companyPosition,
				uid: user.uid,
			}
		}
		this.state = {
			value: initialValues,
		};
		this.onChange = this.onChange.bind(this);
		this.onSave = this.onSave.bind(this);
	}

	onChange(value){
		this.setState = {
			value: Object.assign(this.state.value, value)
		};
	}

	onSave(){
		const isValid = this._form.validate().isValid();
		if(isValid){
			this.props.actions.updateUser(this.state.value);
			db.ref(`users/${this.state.value.uid}`).update(this.state.value).then(res => {
				Actions.home();
			});
		}
	}

	render(){
		console.log('profile page render')
		console.log(this.state.value, this.props.fbProfile);
		return (<ScrollView style={styles.container}>
				<Image source={{ uri: this.state.value.photo }} style={{ width: 50, height: 50 }}/>
				<QRCode
					value={this.state.value.uid}
					size={200}
					bgColor='black'
					fgColor='white'
				/>
				<Form
					ref = { ref => this._form = ref}
					type = {type}
					options = {options}
					value = {this.state.value}
					onChange = {this.onChange}
				/>
				<Button
					onPress={this.onSave}
					title="Save"
				/>
			</ScrollView>);
	}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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

ProfilePage.PropTypes = {
	fbProfile: PropTypes.object,
	firebase_uid: PropTypes.string,
};

export default connect((state) => ({
    'user': state.user,
}), (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
})
)(ProfilePage);
