import React, {Component} from 'react';
import {
	View,
	Text,
	Platform,
	StyleSheet,
	Button,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

class HomePage extends Component {
	render(){
		return <View style={styles.container}>
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
		</View>
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

export default connect((state) => ({
    'user': state.user,
}), (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
})
)(HomePage);
