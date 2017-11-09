import React, {Component} from 'react';
import {
	View,
	Text,
	Platform,
	StyleSheet,
	Button,
	Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';

// Camera
import Camera from 'react-native-camera';

// native base
import { Container, Header, Content, Toast } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// other components
import BottomNavBar from '../components/bottomNavBar';

// facebook oauth
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';

// firebase
import config from '../config';
import * as firebase from 'firebase';
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const db = firebase.database();

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class HomePage extends Component {
	constructor(props){
		super(props);
		this.state={
			showCamera: false,
      otherUser: {},
      showPrompt: false,
			camera: {
				aspect: Camera.constants.Aspect.fill,
				type: Camera.constants.Type.back,
				barcodeFinderVisible: true,
			},
		}
		this.renderCamera = this.renderCamera.bind(this);
		this.onBarCodeRead = this.onBarCodeRead.bind(this);
    this.addUser = this.addUser.bind(this);
	}

	onBarCodeRead(val){
		console.log('bar code read');
		console.log(val);
    const uid = this.props.user.uid;
    const otherUid = val.data;
    this.setState({
      showCamera: false,
    });
    if (uid == otherUid) {
      console.log('supposed to show toast now')
      Toast.show({
        text: 'You can\'t add yourself as a lead!',
        position: 'bottom',
        buttonText: 'Okay'
      });
    } else {
      console.log('supposed to show prompt');
      db.ref(`users/${otherUid}`).once('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          this.setState({
            showPrompt: true, // prompt to add to user and update redux
            otherUser: data,
          });
        } else {
          Toast.show({
            text: 'User not found',
            position: 'bottom',
            buttonText: 'Okay'
          });
        }
      });
    }
	}

	renderCamera() {
		console.log('rendering camera', this.state.showCamera);
		return <Camera
					ref={cam => {
						this.camera = cam;
					}}
					style={styles.preview}
					aspect={this.state.camera.aspect}
					type={this.state.camera.type}
					onFocusChanged={() => {}}
					onZoomChanged={() => {}}
					defaultTouchToFocus
					onBarCodeRead={this.onBarCodeRead}
				>
          <Text style={{ fontSize: 20, color: '#e6e6fa', top: 30, position: 'absolute' }}>Point at a QR code</Text>
        </Camera>
	};

  addUser() {
    const uid = this.props.user.uid;
    db.ref(`users/${this.props.user.uid}/leads/`).orderByValue().equalTo(this.state.otherUser.uid).once('value', snapshot => {
      if (!snapshot.val()) {
        const key = db.ref(`users/${uid}/leads`).push(this.state.otherUser.uid).key;
        const lead = {};
        lead[key] = this.state.otherUser.uid;
        this.props.actions.updateLeads(lead);


        Toast.show({
          text: `Successfully clinked with ${this.state.otherUser.firstName}!`,
          position: 'bottom',
          buttonText: 'Okay',
        });
        const otherUser = {};
        otherUser[this.state.otherUser.uid] = this.state.otherUser;
        console.log(otherUser);
        this.props.actions.addUserToLeads(otherUser);
      } else {
        Toast.show({
          text: `${this.state.otherUser.firstName} is already clinked!`,
          position: 'bottom',
          buttonText: 'Okay',
        });
      }
      this.setState({
        otherUser: {},
        showPrompt: false,
      });
    });
  }

	render(){
    console.log(this.props.user);
    console.log(this.props.leads);
		return (
      <Container>
        <Content>
          <Grid>
            <Col style={{ justifyContent: 'space-around', padding: 20 }}>
              <TouchableOpacity
                onPress={() => this.setState({ showCamera: true })}
                style={{
                  backgroundColor: '#00CE9F',
                  width: width * 0.7,
                  alignSelf: 'center',
                  padding: 40,
                  borderRadius: 5,
               }}
               activeOpacity={0.5}
              >
                  <Text style={{ textAlign: 'center', fontSize: 20, color: '#e6e6fa' }}>Scan</Text>
              </TouchableOpacity>
            </Col>
          </Grid>
          <Grid>
            <Col style={{ justifyContent: 'space-around', padding: 20 }}>
              <TouchableOpacity
                onPress={Actions.leads}
                style={{
                  backgroundColor: '#635DB7',
                  width: width * 0.7,
                  alignSelf: 'center',
                  padding: 40,
                  borderRadius: 5,
               }}
               activeOpacity={0.5}
              >
                  <Text style={{ textAlign: 'center', fontSize: 20, color: '#eee' }}>Leads</Text>
              </TouchableOpacity>
            </Col>
          </Grid>
          <Grid>
            <Col style={{ justifyContent: 'space-around', padding: 20 }}>
              <FBLogin
                buttonView={
                  <TouchableOpacity
                    onPress={() => {
                      this.fbLogin.logout();
                    }}
                    style={{
                      backgroundColor: '#003366',
                      width: width * 0.7,
                      alignSelf: 'center',
                      padding: 40,
                      borderRadius: 5,
                   }}
                   activeOpacity={0.5}
                  >
                      <Text style={{ textAlign: 'center', fontSize: 20, color: '#fff' }}>Log Out</Text>
                  </TouchableOpacity>
                }
                ref={(fbLogin) => { this.fbLogin = fbLogin }}
                loginBehavior={FBLoginManager.LoginBehaviors.Native}
                permissions={["email"]}
                onLogin={function(e){console.log(e)}}
                onLoginFound={function(e){console.log(e)}}
                onLoginNotFound={function(e){console.log(e)}}
                onLogout={function(e){
                  Actions.reset('login');
                  // Actions.replace('login');
                }}
                onCancel={function(e){console.log(e)}}
                onPermissionsMissing={function(e){console.log(e)}}
              />
            </Col>
          </Grid>
        </Content>

        {/* Camera */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showCamera}
          onRequestClose={() => {this.setState({showCamera: false})}}
          >
            <View style={{flex: 1}}>
              {this.renderCamera()}
            </View>
        </Modal>

        {/* prompt modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showPrompt}
          onRequestClose={() => { this.setState({ showPrompt: false }); }}
          >
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(238,238,238,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                width: width * 0.8,
                height: height * 0.3,
                borderRadius: 5,
                backgroundColor: '#333',
                position: 'relative',
              }}>
                <Text style={{
                  color: '#F5FCFF',
                  textAlign: 'center',
                  paddingTop: 40,
                  fontSize: 15
                }}>Would you like to clink with {this.state.otherUser.firstName}?</Text>
                <View style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  bottom: 0,
                  backgroundColor: '#ccc',
                }}>
                  <TouchableOpacity activeOpacity={0.5} onPress={this.addUser} style={{
                    width: width * 0.4,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: '#F5FCFF',
                      paddingVertical: 20,
                      textAlign: 'center',
                    }}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => this.setState({ showPrompt: false })} style={{
                    width: width * 0.4,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: '#F5FCFF',
                      paddingVertical: 20,
                      textAlign: 'center',
                    }}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        <BottomNavBar navbarStyle={{ position: 'absolute', bottom: 0 }}/>
      </Container>
        )

	}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    position: 'relative'
  },
	preview: {
  	flex: 1,
  	justifyContent: 'flex-end',
  	alignItems: 'center'
	},
});

export default connect((state) => ({
    'user': state.user,
    'leads': state.leads,
}), (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
})
)(HomePage);
