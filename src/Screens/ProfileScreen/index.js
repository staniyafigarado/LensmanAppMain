import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  CustomButton,
  CustomHeaderPrim,
  logoSmall,
  TabNavButton,
} from '../../SharedComponents';

import {CommonStyles} from '../../SharedComponents/CustomStyles';
import {
  ordersIcon,
  pictresIcon,
  settingsIcon,
  contactUsIcon,
  background,
} from '../../SharedComponents/CommonIcons';

class ProfileScreen extends Component {
  state = {
    loginData: null,
  };

  componentDidMount() {
    this.getDataFromStore('loginDetails');
  }

  getDataFromStore = async (value) => {
    try {
      let loggedData = await AsyncStorage.getItem(value);
      console.log('Is Logged data in profile ', loggedData);

      if (loggedData && loggedData !== null) {
        this.setState({loginData: JSON.parse(loggedData)});
      }
    } catch (err) {
      console.log('Is Logged data in profile Err', err);
    }
  };

  handleLogout = () => {
    AsyncStorage.clear();
    this.props.navigation.navigate('AuthScreen');
  };

  render() {
    const {TTComDB28, tabNavContainer} = CommonStyles;

    const {loginData} = this.state;
    if (loginData !== null) console.log('In Profile ', loginData.first_name);

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={{flex: 2, zIndex: 4, backgroundColor: 'transparent'}}>
          <CustomHeaderPrim
            leftIcon={logoSmall}
            placeholder="What are you looking for?"
            searchBox
            handleSearchBox={() => console.log('search box')}
          />
        </View>

        <View style={{flex: 9, paddingHorizontal: 20}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 40,
                paddingRight: 10,
              }}>
              <View style={{paddingLeft: 15}}>
                <Text style={TTComDB28}>Hello,</Text>
                <Text style={TTComDB28}>
                  {loginData && loginData !== null && loginData.first_name}
                </Text>
              </View>

              <Image
                source={require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')}
                style={{width: 52, height: 52, borderRadius: 25}}
              />
            </View>

            <View style={{marginBottom: 90}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginVertical: 5,
                }}>
                <ContainerBox
                  image={ordersIcon}
                  label="Your Orders"
                  onAction={() =>
                    this.props.navigation.navigate('OrderHistoryScreen')
                  }
                />
                <View style={{marginLeft: 10}} />
                <ContainerBox
                  image={pictresIcon}
                  label="Your Pictures"
                  onAction={() =>
                    this.props.navigation.navigate('CustomGalleryScreen')
                  }
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginVertical: 5,
                }}>
                <ContainerBox
                  image={settingsIcon}
                  label="Account Settings"
                  onAction={() =>
                    this.props.navigation.navigate('AccountSettingScreen')
                  }
                />
                <View style={{marginLeft: 10}} />
                <ContainerBox
                  image={contactUsIcon}
                  label="Contact us"
                  onAction={() => this.props.navigation.navigate('Contact Us')}
                />
              </View>
              <View style={{marginVertical: 7}} />
              <CustomButton
                buttonStyles="btn-primary"
                textStyles="txt-primary"
                text="Logout"
                onAction={() => this.handleLogout()}
                width="100%"
              />
            </View>
          </ScrollView>

          <View style={[tabNavContainer, {width: '100%'}]}>
            <TabNavButton nav={this.props} active="4" cartNotification={10} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default ProfileScreen;

const ContainerBox = (props) => {
  const {image, label, onAction} = props;
  const {TTComDB17} = CommonStyles;
  return (
    <TouchableOpacity
      onPress={() => onAction && onAction()}
      style={{width: '50%'}}>
      <Text style={[TTComDB17, {paddingLeft: 30, paddingVertical: 10}]}>
        {label}
      </Text>
      <View
        style={{
          backgroundColor: '#FFDF7F',
          width: '95%',
          height: 180,
          borderRadius: 27,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={image} />
      </View>
    </TouchableOpacity>
  );
};
