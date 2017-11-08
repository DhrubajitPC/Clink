import React, {Component} from 'react';
import {
	View,
	Text,
	Platform,
	StyleSheet,
	Button,
	Modal,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';

// Camera
import Camera from 'react-native-camera';

// other components
import BottomNavBar from '../components/bottomNavBar';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class HomePage extends Component {
	constructor(props){
		super(props);
		this.state={
			showCamera: false,
			camera: {
				aspect: Camera.constants.Aspect.fill,
				// captureTarget: Camera.constants.CaptureTarget.cameraRoll,
				type: Camera.constants.Type.back,
				// orientation: Camera.constants.Orientation.auto,
				// flashMode: Camera.constants.FlashMode.auto,
				barcodeFinderVisible: true,
			},
		}
		this.renderCamera = this.renderCamera.bind(this);
		this.onBarCodeRead = this.onBarCodeRead.bind(this);
	}

	onBarCodeRead(val){
		console.log('bar code read');
		console.log(val);
		console.log(40);
	}

	renderCamera() {
		console.log('rendering camera', this.state.showCamera);
		return <Camera
					ref={cam => {
						this.camera = cam;
					}}
					style={styles.preview}
					aspect={this.state.camera.aspect}
					// captureTarget={this.state.camera.captureTarget}
					type={this.state.camera.type}
					// flashMode={this.state.camera.flashMode}
					onFocusChanged={() => {}}
					onZoomChanged={() => {}}
					defaultTouchToFocus
					// mirrorImage={false}
					barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
					barcodeFinderWidth={280}
					barcodeFinderHeight={220}
					barcodeFinderBorderColor="red"
					barcodeFinderBorderWidth={2}
					onBarCodeRead={this.onBarCodeRead}
				/>
	};

	render(){
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
      			<Button
      				title="Profile"
      				onPress={Actions.profile} />
      			<Button
      				title="Scan"
      				onPress={() => this.setState({ showCamera: true })} />
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
            <BottomNavBar navbarStyle={{ position: 'absolute', bottom: 0 }}/>
          </View>
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
	preview: {
	flex: 1,
	justifyContent: 'flex-end',
	alignItems: 'center'
	},
	overlay: {
		position: 'absolute',
		padding: 16,
		right: 0,
		left: 0,
		alignItems: 'center'
	},
	topOverlay: {
		top: 0,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	bottomOverlay: {
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.4)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	enterBarcodeManualButton: {
		padding: 15,
		backgroundColor: 'white',
		borderRadius: 40
	},
	scanScreenMessage: {
		fontSize: 14,
		color: 'white',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default connect((state) => ({
    'user': state.user,
}), (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
})
)(HomePage);
