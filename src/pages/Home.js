import React, { Component } from 'react';
import {
	View,
	Text,
	Platform,
	StyleSheet,
	Button,
	Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  BackHandler,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import RNExitApp from 'react-native-exit-app';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';

// Camera
import Camera from 'react-native-camera';

// native base
import { Container, Header, Content, Toast, Card, CardItem, Body } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// other components
import BottomNavBar from '../components/bottomNavBar';

// facebook oauth
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

// firebase
import config from '../config';
import * as firebase from 'firebase';
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const db = firebase.database();

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class HomePage extends Component {
	constructor(props){
		super(props);
		this.state={
			showCamera: false,
      otherUser: {},
      showPrompt: false,
      backPressedOnce: false,
      showSuccessClinkModal: false,
			camera: {
				aspect: Camera.constants.Aspect.fill,
				type: Camera.constants.Type.back,
				barcodeFinderVisible: true,
			},
		}
		this.renderCamera = this.renderCamera.bind(this);
		this.onBarCodeRead = this.onBarCodeRead.bind(this);
    this.addUser = this.addUser.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
	}

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  handleBackButton(){
    if(Actions.state.index === 0) {
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
    } else {
      Actions.pop();
    }
    return true;
  }

	onBarCodeRead(val){
    const uid = this.props.user.uid;
    const otherUid = val.data;
    this.setState({
      showCamera: false,
    });
    if (uid == otherUid) {
      Toast.show({
        text: 'You can\'t add yourself as a lead!',
        position: 'bottom',
        buttonText: 'Okay'
      });
    } else {
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

        this.setState({
          showSuccessClinkModal: true,
        });
        const otherUser = {};
        otherUser[this.state.otherUser.uid] = this.state.otherUser;
        this.props.actions.addUserToLeads(otherUser);
      } else {
        Toast.show({
          text: `${this.state.otherUser.firstName} is already clinked!`,
          position: 'bottom',
          buttonText: 'Okay',
        });
      }
      this.setState({
        showPrompt: false,
      });
    });
  }

	render(){
		return (
      <Container>
        <Content>
          <Grid>
            <Col style={{ justifyContent: 'space-around', padding: 20 }}>
              <TouchableOpacity
                onPress={() => this.setState({ showCamera: true })}
                style={{
                  backgroundColor: '#00CE9F',
                  width: _width * 0.7,
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
                  width: _width * 0.7,
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
                      width: _width * 0.7,
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
                permissions={["email", "public_profile"]}
                onLogin={function(e){console.log(e)}}
                onLoginFound={function(e){console.log(e)}}
                onLoginNotFound={function(e){console.log(e)}}
                onLogout={function(e){
                  Actions.reset('login');
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

        {/* succesfully clinked modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showSuccessClinkModal}
          onRequestClose={() => { this.setState({ showSuccessClinkModal: false, otherUser: {} }); }}
          >
          <TouchableWithoutFeedback onPress={() => { this.setState({ showSuccessClinkModal: false, otherUser: {} }); }}>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(238,238,238,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {console.log('otherUser ', this.state.otherUser)}
              {this.state.otherUser.firstName ?
                <TouchableOpacity activeOpacity={0.5} onPress={() => { this.setState({ showSuccessClinkModal: false, otherUser: {} }); Actions.leadsDetails({ item: this.state.otherUser }) }}>
                  <View style={{
                    width: _width * 0.8,
                    height: _height * 0.3,
                    borderRadius: 5,
                    backgroundColor: '#fff2ec',
                    position: 'relative',
                    justifyContent: 'space-around'
                  }}>
                    <Image source={{ uri: this.state.otherUser.photo_url }}
                      style={{
                        alignSelf: 'center',
                        justifyContent:'center',
                        height: 120,
                        width: 120,
                        borderRadius: 5,
                        padding: 10,
                      }}/>
                    <Text style={{textAlign: 'center', fontSize: 15}}>
                      You have succesfully clinked with {capitalizeFirstLetter(this.state.otherUser.firstName)} {capitalizeFirstLetter(this.state.otherUser.lastName)}
                    </Text>
                </View>
              </TouchableOpacity> : null }
            </View>
          </TouchableWithoutFeedback>
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
                width: _width * 0.8,
                height: _height * 0.3,
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
                    width: _width * 0.4,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: '#F5FCFF',
                      paddingVertical: 20,
                      textAlign: 'center',
                    }}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => this.setState({ showPrompt: false })} style={{
                    width: _width * 0.4,
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
