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
} from '../../SharedComponents';

import {Container} from '../RegisterScreen/components';
import {CommonStyles} from '../../SharedComponents/CustomStyles';

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
  };

  submitRegister = () => {
    const {fullName, email, phone, Description} = this.state.form;

    let payload = {
      customer: {
        first_name: fullName,
        // last_name: 'fullName 2',
        email: email,
        phone: phone,
        verified_email: false,
        description: Description,
      },
    };

    fetch(BaseUrl + '/admin/api/2020-07/customers.json', {
      method: 'post',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: base64Auth,
      }),
      body: payload,
    })
      // .then((res) => res.json())
      .then((res) => {
        console.warn('Res 110', res);
      })
      .catch((err) => {
        console.log('Err in res', err);
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
    const {passwordConfirm, isSelected} = this.state;
    const {TTComM16} = CommonStyles;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header section  */}
        <View style={{flex: 0.5}}>
          <CustomHeader
            leftIcon={closeIcon}
            rightIcon={logoSmall}
            leftIconAction={() => this.props.navigation.goBack()}
          />
        </View>
        {/* Header section End */}

        {/* Form Section */}
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
                onchange={(data) => this.handleFormDatas(data, 'mobileNumber')}
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
      </SafeAreaView>
    );
  }
}

export default ContactUsScreen;
