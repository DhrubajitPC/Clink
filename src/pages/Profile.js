import React, {Component} from 'react';
import {
	View,
	Text,
	Platform,
	StyleSheet,
	Button,
	Image,
	ScrollView,
  Dimensions,
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

// other components
import BottomNavBar from '../components/bottomNavBar';
import QrModal from '../components/QrModal';

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
		const { fbProfile, user } = props;
		let initialValues = {};
		if(fbProfile){
			initialValues = {
				firstName: fbProfile.first_name,
				lastName: fbProfile.last_name,
				email: fbProfile.email,
				photo_url: fbProfile.picture.data.url,
				uid: props.firebase_uid,
			};
		} else {
			initialValues = {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				photo_url: user.photo_url,
				contactNumber: user.contactNumber,
				companyName: user.companyName,
				companyPosition: user.companyPosition,
				uid: user.uid,
			}
		}
		this.state = {
			value: initialValues,
      disableBottomNavbar: !!this.props.firebase_uid,
      qrVisible: false,
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
    const margin = this.state.disableBottomNavbar ? {} : {marginBottom: 40};
		return (
      <View style={{ position: 'relative', flex: 1 }}>
        <ScrollView style={[styles.container, margin]}>
          <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
            <Image source={{ uri: this.state.value.photo_url }} style={{ borderRadius: 100, width: 100, height: 100 }}/>
            <View style={{ justifyContent: 'space-around', paddingLeft: 20 }}>
              <Text style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#00CE9F'
              }} onPress={() => this.setState({ qrVisible: true })}>View Qr Code</Text>
            </View>
          </View>
          <Form
            ref = { ref => this._form = ref}
            type = {type}
            options = {options}
            value = {this.state.value}
            onChange = {this.onChange}
          />
          <View style={{ paddingBottom: 10 }}>
            <Button
              onPress={this.onSave}
              title="Save"
            />
          </View>
        </ScrollView>
        {!this.state.disableBottomNavbar ? <BottomNavBar navbarStyle={{ bottom: 0, position: 'absolute' }}/> : null}
        <QrModal
          onClose={() => this.setState({ qrVisible: false })}
          visible={this.state.qrVisible}
          qrValue={this.state.value.uid}
        />
      </View>
    );
	}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 10,
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
