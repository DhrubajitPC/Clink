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
                <Right justifyContent={'space-around'}>
                  <Text style={{
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#00CE9F'
                  }} onPress={() => Actions.leadsDetails({ item: item })}>View</Text>
                </Right>
              </ListItem>
            }>
          </List>
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
