import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actionCreators';

import { Actions } from 'react-native-router-flux';

class BottomNavBar extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={[styles.bottomNavBar, this.props.navbarStyle]}>
                <TouchableOpacity style={{ width: Dimensions.get('window').width * 0.5, alignItems: 'center' }} onPress={() => Actions.home() } activeOpacity={0.5}>
                    <Text>
                        Home
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: Dimensions.get('window').width * 0.5, alignItems: 'center' }} onPress={() => Actions.profile({ uid: this.props.user.uid }) } activeOpacity={0.5}>
                    <Text>
                        Profile
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    bottomNavBar: {
        paddingVertical: 10,
        flexDirection: 'row',
        backgroundColor: '#cccccc',
        justifyContent: 'space-around',
        width: Dimensions.get('window').width,
    }
})
BottomNavBar.PropTypes = {
    user: PropTypes.object,
    navbarStyle: PropTypes.object,
}

BottomNavBar.defaultProps = {
    navbarStyle: {},
}

export default connect((state) => ({
    user: state.user,
}), (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
})
)(BottomNavBar);
