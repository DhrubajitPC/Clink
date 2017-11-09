import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
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

import { Actions } from 'react-native-router-flux';

class LeadsPage extends Component {
  constructor(props){
    super(props);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
                      {/* <Text style={{
                        textAlign: 'center',
                        fontSize: 12,
                        color: '#ff5151',
                        padding: 10,
                        // backgroundColor: 'blue'
                      }} onPress={() => Actions.leadsDetails({ item: item })}>Delete</Text> */}
                    </Right>
                  </ListItem>
                }>
              </List> :
              <Text>You do not have any leads at the moment.</Text>
            }
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
