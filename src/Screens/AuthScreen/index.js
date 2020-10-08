import React, {Component} from 'react';
import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';

import {RFPercentage} from 'react-native-responsive-fontsize';

// custom components
import {CustomButton} from '../../SharedComponents';

import {CommonStyles} from '../../SharedComponents/CustomStyles';
// import CustomFonts from "../../utils/CommonUtils";

import {
  closeIcon,
  googleWhiteIcon,
  fbWhiteIcon,
} from '../../SharedComponents/CommonIcons';

class AuthScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {TTComDB16, TTComL16} = CommonStyles;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#000000d9',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#323AE4',
            width: '90%',
            height: '75%',
            borderRadius: 27,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.handleCloseModal && this.props.handleCloseModal();
              this.props.navigation.navigate('LoginScreen');
            }}
            style={{top: 20, left: 20}}>
            <Image source={closeIcon} />
          </TouchableOpacity>
          <View
            style={{flex: 5, justifyContent: 'flex-end', alignItems: 'center'}}>
            <Image
              source={require('../../../assests/Common/logo/icon[-20.png')}
            />
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: RFPercentage(32) / 6, //32+3,
                fontFamily: 'TTCommons-Bold',
                textAlign: 'center',
                paddingHorizontal: 20,
                marginTop: 30,
              }}>
              Welcome to the express way.
            </Text>
          </View>

          <View
            style={{flex: 7, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: '',
                paddingVertical: 10,
              }}>
              <CustomButton
                text="Sign up for free"
                buttonStyles="btn-primary"
                textStyles="txt-primary"
                onAction={() => {
                  this.props.handleCloseModal && this.props.handleCloseModal();
                  this.props.navigation.navigate('RegisterScreen');
                }}
              />

              <View style={{marginVertical: 5}} />

              {/* <CustomButton
                                text            = "Continue with Google"
                                buttonStyles    = "btn-secondary"
                                textStyles      = "txt-primary"
                                icon            = {googleWhiteIcon}
                            /> */}
              {/* <View style={{marginVertical : 5}}/> */}

              {/* <CustomButton
                                text            = "Continue with Facebook"
                                buttonStyles    = "btn-secondary"
                                textStyles      = "txt-primary"
                                icon            = {fbWhiteIcon}
                            />
                                 */}
              <View style={{marginVertical: 5}} />

              <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                <Text style={[TTComL16, {color: '#fff'}]}>
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.handleCloseModal &&
                      this.props.handleCloseModal();
                    this.props.navigation.navigate('LoginScreen');
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      TTComL16,
                      {color: '#fff', fontFamily: 'TTCommons-Bold'},
                    ]}>
                    {''} Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default AuthScreen;
