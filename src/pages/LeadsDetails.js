import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Card, CardItem, Body, Text, Left } from 'native-base';
import QrModal from '../components/QrModal';

export default class LeadsDetailsPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      qrVisible: false,
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    const item = this.props.item;
    return (
      <Container>
        <Content>
          <Card>
            <CardItem header>
              <Text>{this.capitalizeFirstLetter(item.firstName)} {this.capitalizeFirstLetter(item.lastName)}</Text>
            </CardItem>
            <CardItem>
              <Body>
                 <Image source={{ uri: item.photo_url }}
                   style={{
                     height: 200,
                     width: 200,
                     flex: 1,
                     borderRadius: 5,
                   }}/>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                 <Text>{item.companyName}</Text>
                 <Text>{item.companyPosition}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                 <Text>{item.contactNumber}</Text>
                 <Text>{item.email}</Text>
              </Body>
            </CardItem>
            <CardItem footer>
                <Text style={{
                  textAlign: 'center',
                  fontSize: 12,
                  color: '#00CE9F',
                  padding: 10,
                }} onPress={() => this.setState({ qrVisible: true })}>Show QR Code</Text>
            </CardItem>
          </Card>
          <QrModal
            visible={this.state.qrVisible}
            qrValue={this.props.item.uid}
            onClose={() => this.setState({ qrVisible: false })}
          />
        </Content>
      </Container>
    );
  }
}

LeadsDetailsPage.PropTypes = {
  item: PropTypes.object,
};
