import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  View,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
// qr code
import QRCode from 'react-native-qrcode';

const _width = Dimensions.get('window').width;
const _height = Dimensions.get('window').height;

export default class QrModal extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return(
      <Modal
        onRequestClose={this.props.onClose}
        transparent={true}
        visible={this.props.visible}
        animationType={'fade'}>
        <TouchableWithoutFeedback onPress={this.props.onClose}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(238,238,238,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              width: _width * 0.6,
              height: _height * 0.35,
              borderRadius: 5,
              backgroundColor: '#fff2ec',
              padding: 5,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <QRCode
                value={this.props.qrValue}
                size={200}
                bgColor='black'
                fgColor='white'
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

QrModal.PropTypes = {
  qrValue: PropTypes.string,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
};
