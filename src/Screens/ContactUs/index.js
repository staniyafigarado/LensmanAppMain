import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import axios from 'axios';
import {BaseUrl, base64Auth} from '../../utils/constants';

import {
  CustomInput,
  CustomButton,
  CustomHeader,
  closeIcon,
  logoSmall,
  radioButton,
  radioButtonFill,
  CustomToaster,
} from '../../SharedComponents';

import {Container} from '../RegisterScreen/components';
import {CommonStyles} from '../../SharedComponents/CustomStyles';
import CustomStatusBar from '../../SharedComponents/CustomStatusBar/CustomStatusBar';

class ContactUsScreen extends Component {
  state = {
    form: {
      fullName: '',
      email: '',
      mobileNumber: '',
      Description: '',
      confirmPassword: '',
    },
    passwordConfirm: '',
    isSelected: false,
    isCustomToaster: '',
  };

  submitRegister = async () => {
    const {fullName, email, mobileNumber, Description} = this.state.form;
    let payload = {
      name: fullName,
      email: email,
      mobileNumber: mobileNumber,
      description: Description,
    };
    // console.warn(BaseUrl);

    await fetch(`http://15.185.152.100/api/email`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: base64Auth,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({isCustomToaster: res.result});
        // console.warn('Res 110', res);
      })
      .catch((err) => {
        this.setState({isCustomToaster: err});
        // console.log('Err in res', err);
      });
  };

  handleFormDatas = (data, type) => {
    let form = {...this.state.form};

    if (type === 'fullName') {
      form.fullName = data;
    } else if (type === 'email') {
      form.email = data;
    } else if (type === 'mobileNumber') {
      form.mobileNumber = data;
    } else if (type === 'Description') {
      form.Description = data;
    }
    // else if (type === 'confirmPassword') {
    //   form.confirmPassword = data;
    // }
    this.setState({form}, () => console.log('Result in form', this.state.form));
  };

  validatePasswordConfirm = () => {
    let form = {...this.state.form};
    console.log(form.password, form.confirmPassword);
    if (form.confirmPassword === '') {
      this.setState({passwordConfirm: ''});
    } else {
      if (form.password !== form.confirmPassword) {
        this.setState({passwordConfirm: true});
      } else {
        this.setState({passwordConfirm: false});
      }
    }
  };

  toggleSelect = () => {
    this.setState({isSelected: !this.state.isSelected});
  };

  showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Test Toaster',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  };

  render() {
    const {passwordConfirm, isSelected, isCustomToaster} = this.state;
    const {TTComM16} = CommonStyles;
    return (
      <>
        <CustomStatusBar />
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}

          {/* Header section  */}

          {/* Header section End */}

          {/* Form Section */}
          <View style={{height: 15}} />
          <View style={{flex: 10, paddingHorizontal: 20}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{marginTop: 130}}>
                <Container>
                  <CustomInput
                    placeholder="Full Name"
                    label="Full Name"
                    onchange={(data) => this.handleFormDatas(data, 'fullName')}
                  />
                </Container>
              </View>

              <Container>
                <CustomInput
                  placeholder="Email"
                  label="Email"
                  onchange={(data) => this.handleFormDatas(data, 'email')}
                  keyboardType="email-address"
                />
              </Container>

              <Container>
                <CustomInput
                  placeholder="Mobile Number"
                  label="Mobile Number"
                  onchange={(data) =>
                    this.handleFormDatas(data, 'mobileNumber')
                  }
                  type="phone"
                  keyboardType="phone-pad"
                />
              </Container>

              <Container>
                <CustomInput
                  placeholder="Enter Description"
                  onchange={(data) => this.handleFormDatas(data, 'Description')}
                  keyboardType="email-address"
                  height={200}
                />
              </Container>

              <Container>
                <CustomButton
                  buttonStyles="btn-primary"
                  textStyles="txt-primary"
                  text="Submit"
                  alignCenter
                  onAction={() => this.submitRegister()} //this.props.navigation.navigate('LoginScreen')} //
                  width="100%"
                />
              </Container>
            </ScrollView>
          </View>
          {isCustomToaster !== '' && (
            <CustomToaster
              position="flex-end"
              onend={() => this.setState({isCustomToaster: ''})}
              isCustomToaster={true}
              message={isCustomToaster}
            />
          )}
          <View
            style={{
              flex: 1,
              position: 'absolute',
              width: '100%',
            }}>
            <CustomHeader
              leftIcon={closeIcon}
              rightIcon={logoSmall}
              leftIconAction={() => this.props.navigation.goBack()}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default ContactUsScreen;
