import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  Modal,
  View,
  Dimensions,
} from 'react-native';

import {
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Body,
  Text,
  Left,
  Right,
} from 'native-base';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';

// firebase
import config from '../config';
import * as firebase from 'firebase';
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
const db = firebase.database();

import { Actions } from 'react-native-router-flux';

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

class LeadsPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      showPrompt: false,
      deleteUser: {},
    };
    this.deleteUser = this.deleteUser.bind(this);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  deleteUser() {
    const otherUser = this.state.deleteUser;
    console.log(this.props);
    db.ref(`users/${this.props.user.uid}/leads`).orderByValue().equalTo(otherUser.uid).once('value', snapshot => {
      const val = snapshot.val();
      if(val){
        const key = Object.keys(val)[0];
        db.ref(`users/${this.props.user.uid}/leads/${key}`).remove();
      }
    });
    this.props.actions.removeUserFromLeads(otherUser);
    this.setState({
      showPrompt: false,
      deleteUser: {},
    });
  }

  render() {
    var items = Object.values(this.props.leads);
    return (
      <Container>
        <Content>
          {
            items.length > 0 ?
              <List dataArray={items}
                renderRow={(item) =>
                  <ListItem avatar style={{ marginLeft: 0 }}>
                    <Left>
                      <Thumbnail source={{ uri: item.photo_url }} />
                    </Left>
                    <Body>
                      <Text>{this.capitalizeFirstLetter(item.firstName)} {this.capitalizeFirstLetter(item.lastName)}</Text>
                      <Text note>{item.companyPosition}, {item.companyName}</Text>
                      <Text note/>
                    </Body>
                    <Right justifyContent={'space-around'} flexDirection={'row'}>
                      <Text style={{
                        textAlign: 'center',
                        fontSize: 12,
                        color: '#00CE9F',
                        padding: 10,
                        // backgroundColor: 'blue'
                      }} onPress={() => Actions.leadsDetails({ item: item })}>View</Text>
                      <Text style={{
                        textAlign: 'center',
                        fontSize: 12,
                        color: '#ff5151',
                        padding: 10,
                        // backgroundColor: 'blue'
                      }} onPress={() => this.setState({ showPrompt: true, deleteUser: item })}>Delete</Text>
                    </Right>
                  </ListItem>
                }>
              </List> :
              <View style={{
                alignItems: 'center',
                paddingTop: 200,
              }}>
                <Text>You do not have any leads at the moment.</Text>
              </View>
            }

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
                    }}>Are you sure you wish to delete {this.state.deleteUser.firstName}?</Text>
                    <View style={{
                      flexDirection: 'row',
                      position: 'absolute',
                      bottom: 0,
                      backgroundColor: '#ccc',
                    }}>
                      <TouchableOpacity activeOpacity={0.5} onPress={this.deleteUser} style={{
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
        </Content>
      </Container>
    );
  }
}

export default connect((state) => ({
    'user': state.user,
    'leads': state.leads,
}), (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
})
)(LeadsPage);
