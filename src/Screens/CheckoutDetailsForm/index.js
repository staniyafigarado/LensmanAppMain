import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ToastAndroid,
  Image,
  Platform,
  Linking,
} from 'react-native';

import axios from 'axios';
import {
  CustomHeaderPrim,
  CustomButton,
  CustomInput,
  Loader,
  CustomTracker,
} from '../../SharedComponents';
import AsyncStorage from '@react-native-community/async-storage';
import {
  LeftArrowIcon,
  radioButton,
  radioButtonFill,
  greyCircleWithBlueIcon,
  greyCircleWithYellowIcon,
  greyCircleWithGreyIcon,
} from '../../SharedComponents/CommonIcons';

import { connect } from 'react-redux';
import { setCartItem, removeFromCart, updateCart } from '../../store/actions';
import Shimmer from '../../SharedComponents/Shimmer';
import { CommonStyles } from '../../SharedComponents/CustomStyles';
import CustomStatusBar from '../../SharedComponents/CustomStatusBar/CustomStatusBar';

class CheckoutDetailsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      UserData: [],
      options: {
        option1: false,
        option2: true,
      },
      showStates: false,
      showCountries: false,
      statesList: [
        { name: 'Abu Dhabi', isSelected: false },
        { name: 'Ajman', isSelected: false },
        { name: 'Dubai', isSelected: false },
        { name: 'Fujairah', isSelected: false },
        { name: 'Ras al-khaimah', isSelected: false },
        { name: 'Sharjah', isSelected: false },
        { name: 'Umm al-Quwain', isSelected: false },
      ],
      selectedState: '',
      countriesList: [
        { name: 'United Arab Emirates', isSelected: false, iso: 'AE' },
      ],
      selectedCountry: '',
      Address: {
        first_name: '',
        last_name: '',
        address1: '',
        address2: '',
        pincode: '',
        country: '',
        state: '',
      },
    };
  }

  async componentDidMount() {
    this.getAsyncData();
  }

  getAsyncData = async () => {
    try {
      let loggedData = await AsyncStorage.getItem('loginDetails');
      console.warn('Is Logged', loggedData);

      if (loggedData !== null) {
        this.setState({ UserData: JSON.parse(loggedData) });
      } else {
        this.setState({ UserData: '' });
      }
    } catch (err) {
      console.log('Is Logged', err);
    }
  };

  showToaster = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  };

  toggleOption = (type) => {
    console.log('OPtions clicked', type);
    let options = this.state.options;

    if (type === 'option1') {
      if (options.option1) {
        options.option1 = false;
        options.option2 = true;
      } else {
        options.option1 = true;
        options.option2 = false;
      }
    } else if (type === 'option2') {
      if (options.option2) {
        options.option2 = false;
        options.option1 = true;
      } else {
        options.option2 = true;
        options.option1 = false;
      }
    }
    this.setState({ options });
  };

  toggleStatesList = () => this.setState({ showStates: !this.state.showStates });

  toggleCountrieList = () =>
    this.setState({ showCountries: !this.state.showCountries });

  handleChooseState = (index) => {
    let statesList = [...this.state.statesList];
    statesList[index].isSelected = true;
    statesList.forEach((item, indx) => {
      if (index !== indx) {
        item.isSelected = false;
      }
      return item;
    });

    this.setState({
      statesList,
      selectedState: statesList[index].name,
      showStates: false,
    });
    this.state.Address.state = statesList[index].name;
  };

  handleChooseCountry = (index) => {
    let countriesList = [...this.state.countriesList];
    countriesList[index].isSelected = true;
    countriesList.forEach((item, indx) => {
      if (index !== indx) {
        item.isSelected = false;
      }
      return item;
    });

    this.setState({
      countriesList,
      selectedCountry: countriesList[index].name,
      showCountries: false,
      Address: {
        ...this.state.Address,
        country: countriesList[index].name,
        countryISO: countriesList[index].iso,
      },
    });
    this.state.Address.country = countriesList[index].name;
  };

  handleDropdownClose = () => {
    if (this.state.showCountries) {
      this.setState({ showCountries: false });
    }
    if (this.state.showStates) {
      this.setState({ showStates: false });
    }
  };
  handleProductDetailApi = async () => {
    const { UserData, Address } = this.state;
    let products = [];
    let GrandTotal = 0;
    const { productQty, itemdata } = this.props.route.params || {};
    if (productQty) {
      products.push({
        id: itemdata.variants[0].id,
        total: itemdata.variants[0].price * productQty,
        quantity: productQty,
      });
    } else {
      this.props.cartList.map((item) => {
        products.push({
          id: item.data.variants[0].id,
          total: item.data.variants[0].price * item.count,
          quantity: item.count,
        });
      });
    }
    products.map((price) => {
      GrandTotal = GrandTotal + Number(price.total);
    });
    const payload = {
      uid: UserData.id,
      items: { products: products, GrandTotal: GrandTotal },
      uname: UserData.firstName,
      uaddress: Address,
    };
    if (
      Address.address1 &&
      Address.country &&
      Address.first_name &&
      Address.last_name &&
      Address.phone &&
      Address.country &&
      Address.city &&
      (UserData.id !== '1wf23gv3erty3jt1234he' || Address.email)
    ) {
      this.props.navigation.navigate('CheckoutPaymentScreen', {
        apiparams: payload,
      });
    } else {
      alert('Please fill the required fields');
    }
  };

  handleTextInput = (text, type) => {
    const { Address } = this.state;
    if (type == 'first_name') Address.first_name = text;
    else if (type == 'phone') Address.phone = text;
    else if (type == 'email') Address.email = text;
    else if (type == 'city') Address.city = text;
    else if (type == 'last_name') Address.last_name = text;
    else if (type == 'address1') Address.address1 = text;
    else if (type == 'address2') Address.address2 = text;
    else if (type == 'pincode') Address.pincode = text;
  };
  onload = (loadweb) => {
    console.warn(loadweb);
  };
  render() {
    const { TTComM16, TTComDB16, TTComL16, TTComDB28 } = CommonStyles;

    const {
      isLoading,
      options,
      showStates,
      statesList,
      selectedState,
      countriesList,
      selectedCountry,
      showCountries,
      UserData,
    } = this.state;
    console.log('user', UserData);

    return (
      <>
        <CustomStatusBar />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* <StatusBar backgroundColor="#fff" barStyle="dark-content" /> */}

          {isLoading ? (
            // <Loader />
            <View style={{ flex: 9, paddingHorizontal: 20, marginTop: 80 }}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingTop: 100,
                  paddingBottom: Platform.OS == 'ios' ? 100 : 0,
                }}>
                <Shimmer autoRun={true} visible={false} duration={3000}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 5 }}>
                  <Text>Name</Text>
                </Shimmer>
                <Shimmer autoRun={true} visible={false} duration={3000} style={{ height: 50, width: '100%', marginTop: 10 }}>
                  <Text>Name</Text>
                </Shimmer>
              </ScrollView>
            </View>
          ) : (
              <TouchableOpacity
                onPress={() => this.handleDropdownClose()}
                activeOpacity={1}
                style={{ flex: 9, paddingHorizontal: 20 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ marginTop: 160 }} />

                  <CustomTracker stage={1} />

                  <View style={{ marginVertical: 20 }}>
                    {UserData.id == '1wf23gv3erty3jt1234he' && (
                      <CustomInput
                        placeholder="Email Address"
                        keyboardType="email-address"
                        onchange={(data) => this.handleTextInput(data, 'email')}
                        onFocus={() => this.handleDropdownClose()}
                      />
                    )}

                    <View style={{ marginVertical: 10 }} />
                    <CustomInput
                      placeholder="First Name"
                      keyboardType="email-address"
                      onchange={(data) =>
                        this.handleTextInput(data, 'first_name')
                      }
                      onFocus={() => this.handleDropdownClose()}
                    />

                    <View style={{ marginVertical: 10 }} />

                    <CustomInput
                      placeholder="Last Name"
                      keyboardType="email-address"
                      onchange={(data) => this.handleTextInput(data, 'last_name')}
                      onFocus={() => this.handleDropdownClose()}
                    />

                    <View style={{ marginVertical: 10 }} />

                    <CustomInput
                      placeholder="Phone Number"
                      keyboardType="number-pad"
                      onchange={(data) => this.handleTextInput(data, 'phone')}
                      onFocus={() => this.handleDropdownClose()}
                    />

                    <View style={{ marginVertical: 10 }} />

                    <CustomInput
                      placeholder="Address "
                      keyboardType="email-address"
                      onchange={(data) => this.handleTextInput(data, 'address1')}
                      onFocus={() => this.handleDropdownClose()}
                    />

                    <View style={{ marginVertical: 10 }} />

                    <CustomInput
                      placeholder="Apartment, Suits etc (optional)"
                      onchange={(data) => this.handleTextInput(data, 'address2')}
                      onFocus={() => this.handleDropdownClose()}
                    />

                    <View style={{ marginVertical: 10 }} />
                    <CustomInput
                      placeholder="City"
                      onchange={(data) => this.handleTextInput(data, 'city')}
                      onFocus={() => this.handleDropdownClose()}
                    />

                    <View style={{ marginVertical: 10 }} />

                    <CustomInputDropdown
                      value={selectedCountry}
                      placeholder="Country"
                      onAction={() => this.toggleCountrieList()}
                    />

                    {showCountries && (
                      <View
                        style={{
                          maxHeight: 200,
                          borderColor: '#E9E9E9',
                          borderWidth: 1.5,
                          borderRadius: 12,
                        }}>
                        <ScrollView nestedScrollEnabled={true}>
                          {countriesList &&
                            countriesList.length &&
                            countriesList.map((list, index) => {
                              return (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => this.handleChooseCountry(index)}
                                  style={{
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={
                                      list.isSelected
                                        ? {
                                          paddingVertical: 15,
                                          width: 5,
                                          backgroundColor: '#FFC000',
                                        }
                                        : {}
                                    }
                                  />
                                  <Text
                                    style={[
                                      list.isSelected ? TTComM16 : TTComL16,
                                      { paddingLeft: 15 },
                                    ]}>
                                    {list.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                        </ScrollView>
                      </View>
                    )}

                    <View style={{ marginVertical: 10 }} />
                    <CustomInputDropdown
                      value={selectedState}
                      placeholder="States"
                      onAction={() => this.toggleStatesList()}
                    />

                    {showStates && (
                      <View
                        style={{
                          maxHeight: 200,
                          borderColor: '#E9E9E9',
                          borderWidth: 1.5,
                          borderRadius: 12,
                        }}>
                        <ScrollView nestedScrollEnabled={true}>
                          {statesList &&
                            statesList.length &&
                            statesList.map((list, index) => {
                              return (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => this.handleChooseState(index)}
                                  style={{
                                    paddingVertical: 15,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={
                                      list.isSelected
                                        ? {
                                          paddingVertical: 15,
                                          width: 5,
                                          backgroundColor: '#FFC000',
                                        }
                                        : {}
                                    }
                                  />
                                  <Text
                                    style={[
                                      list.isSelected ? TTComM16 : TTComL16,
                                      { paddingLeft: 15 },
                                    ]}>
                                    {list.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/* <View
                  style={{
                    borderWidth: 1.5,
                    borderColor: '#E9E9E9',
                    borderRadius: 12,
                    marginBottom: 30,
                    paddingVertical: 20,
                  }}>
                  <CustomSelector
                    option={options.option1}
                    text="Express shipping"
                    days="1-2 days"
                    price="(15AED)"
                    toggleOption={() => this.toggleOption('option1')}
                  />

                  <CustomSelector
                    option={options.option2}
                    text="Standard shipping"
                    days="3-5 days"
                    price="(FREE)"
                    toggleOption={() => this.toggleOption('option2')}
                  />
                </View> */}

                  <View style={{ marginBottom: 30 }}>
                    <CustomButton
                      buttonStyles="btn-primary"
                      textStyles="txt-primary"
                      text="Next"
                      width="100%"
                      onAction={() => {
                        this.handleProductDetailApi();
                      }}
                    />
                  </View>
                </ScrollView>
              </TouchableOpacity>
            )}
          <View
            style={{
              flex: 1,
              position: 'absolute',
              backgroundColor: 'transparent',
              width: '100%',
            }}>
            <CustomHeaderPrim
              leftIcon={LeftArrowIcon}
              leftIconAction={() => this.props.navigation.goBack()}
              centerLabel="Checkout"
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartList: state.Layout.cartList,
  };
};
const mapDispatchToProps = {
  setCartItem,
  removeFromCart,
  updateCart,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckoutDetailsForm);

const CustomSelector = (props) => {
  const { text, days, price, option, toggleOption } = props;
  const { TTComM16, TTComDB16 } = CommonStyles;
  return (
    <TouchableOpacity
      onPress={() => toggleOption && toggleOption()}
      style={{ flexDirection: 'row', marginVertical: 10, marginHorizontal: 20 }}>
      <Image
        source={option ? radioButtonFill : radioButton}
        style={{ marginRight: 15 }}
      />
      <Text style={TTComM16}>{text && text}</Text>
      <Text style={[TTComDB16, { color: '#7E82E6', marginHorizontal: 5 }]}>
        {days && days}
      </Text>
      <Text style={[TTComDB16, { color: '#7E82E6' }]}>{price && price}</Text>
    </TouchableOpacity>
  );
};

const CustomInputDropdown = (props) => {
  const { label, value, onAction, placeholder } = props;
  console.log('value', value);
  return (
    <View>
      {label && (
        <Text style={CommonStyles.customInputLabel}>{label && label}</Text>
      )}
      <TouchableOpacity onPress={() => onAction()} style={{}}>
        <View
          style={{
            borderRadius: 12,
            backgroundColor: '#fff',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: '#E9E9E9',
            paddingLeft: 20,
            height: 50,
          }}>
          <Text
            style={{
              color: placeholder ? '#8C8C8C' : '#000',
              fontSize: 16,
              fontFamily: 'TTCommons-Medium',
              textAlignVertical: 'center',
            }}>
            {value === '' && placeholder
              ? placeholder
              : value === ''
                ? 'Country'
                : value}
          </Text>
        </View>
        <Image
          source={require('../../../assests/RegisterScreen/dropdownDownIcon/Polygon2.png')}
          style={{ position: 'absolute', top: '40%', right: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
};
