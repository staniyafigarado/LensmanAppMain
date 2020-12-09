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
  Dimensions,
  BackHandler,
} from 'react-native';

import axios from 'axios';
import {
  CustomHeaderPrim,
  CustomButton,
  Loader,
  CustomTracker,
} from '../../SharedComponents';

import {
  LeftArrowIcon,
  radioButton,
  radioButtonFill,
  appleBlackIcon,
} from '../../SharedComponents/CommonIcons';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import {
  setCartItem,
  removeFromCart,
  updateCart,
  removeAllItems,
} from '../../store/actions';
import { CommonStyles } from '../../SharedComponents/CustomStyles';
import CustomStatusBar from '../../SharedComponents/CustomStatusBar/CustomStatusBar';
import AsyncStorage from '@react-native-community/async-storage';
import { BaseUrl, base64Auth } from '../../utils/constants';
import base64 from 'react-native-base64';
const { height, width } = Dimensions.get('window');

function IdGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}

class CheckoutPaymentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      iswebView: false,
      webUrl: '',
      paymentdata: [],
      UserData: '',
      GrandTotal: '',
      loggedData: null,
      productDetail: this.props.route.params.itemdata,
      productQty: this.props.route.params.productQty,
    };
    this.createShopifyOrder = this.createShopifyOrder.bind(this);
    this.getAsyncData = this.getAsyncData.bind(this);
  }

  componentDidMount() {
    this.getAsyncData();
    const { route } = this.props;
    const { itemdata, productQty, apiparams = null } = route.params;
    this.BackHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.state.paymentdata.length > 0 &&
        this.props.navigation.navigate('DashboardScreen');
    });
    if (apiparams) {
      console.log(apiparams);
      this.setState({ GrandTotal: apiparams.items.GrandTotal });
    } else {
      if (itemdata && itemdata.variants && itemdata.variants.length > 0) {
        const price = parseFloat(itemdata.variants[0].price) * productQty;
        this.setState({
          GrandTotal: price,
        });
      }
    }
  }

  componentWillUnmount() {
    this.BackHandler.remove();
  }
  showToaster = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  };

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

  handleProductDetailApi = async () => {
    const { UserData } = this.state;
    const { itemdata, productQty, type } = this.props.route.params;
    console.warn(itemdata);

    if (type == 'Buy') {
      let products = [];
      products.push({
        id: itemdata.id,
        total: itemdata.variants[0].price * itemdata.count,
        quantity: productQty,
      });
      this.setState({ GrandTotal: itemdata.variants[0].price * productQty });
    } else {
      let products = [];
      let GrandTotal = 0;
      console.warn(this.props.cartList);

      this.props.cartList.map((item) => {
        products.push({
          id: item.data.id,
          total: item.data.variants[0].price * item.count,
          quantity: item.count,
        });
      }),
        products.map((price) => {
          GrandTotal = GrandTotal + Number(price.total);
        });
      this.setState({ GrandTotal: GrandTotal });
    }
  };
  handlepayment = async () => {
    const { GrandTotal } = this.state;
    const cartId = IdGenerator();
    const { apiparams = null } = this.props.route.params;
    const { uaddress } = apiparams;
    // const Total = GrandTotal + GrandTotal * 0.05 + 9.99;
    const amount = Number(GrandTotal + GrandTotal * 0.05 + 9.99).toFixed(2);
    let payload = {
      profile_id: 47606,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_id: cartId,
      cart_description: 'Dummy Cart Description',
      cart_currency: 'AED',
      cart_amount: parseFloat(amount),
      hide_shipping: true,
      hide_billing: true,
      shipping_details: {
        name: uaddress.first_name + ' ' + uaddress.last_name,
        email: 'customer-email@example.com',
        street1: uaddress.address1,
        city: uaddress.city,
        state: uaddress.state,
        country: 'AE',
      },
      customer_details: {
        name: uaddress.first_name + ' ' + uaddress.last_name,
        email: 'customer-email@example.com',
        street1: uaddress.address1,
        city: uaddress.city,
        state: uaddress.state,
        country: 'AE',
      },
      return: 'none',
    };
    axios(`https://secure.paytabs.com/payment/request`, {
      method: 'POST',
      data: payload,
      headers: {
        authorization: 'SDJNLL26JN-HZHWDR6DJN-BWHWGWRMMZ',
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      // this.props.navigation.navigate('CheckoutHistoryScreen', {
      //   orderRef: res.data.tran_ref,
      // });
      this.setState({
        iswebView: true,
        webUrl: res.data.redirect_url,
        paymentdata: res.data,
      });

      console.warn(res.data);
    });
  };

  handleBackApi = async (list) => {
    const { UserData } = this.state;
    const { itemdata, productQty, type } = this.props.route.params;
    let products = [];
    let GrandTotal = 0;
    if (type == 'Buy') {
      products.push({
        id: itemdata.id,
        total: itemdata.variants[0].price * productQty,
        quantity: productQty,
      });
    } else {
      this.props.cartList.map((item) => {
        products.push({
          id: item.data.id,
          total: item.data.variants[0].price * item.count,
          quantity: item.count,
        });
      }),
        products.map((price) => {
          GrandTotal = GrandTotal + Number(price.total);
        });
      console.warn(products, GrandTotal);
    }
    let payload = {
      tran_ref: list.tran_ref,
      uid: UserData.id,
      items: { products: products, GrandTotal: GrandTotal },
      uname: UserData.firstName,
      uaddress: list.customer_details,
    };
    await axios(`https://www.lensmanacademy.com/api/index.php`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      data: payload,
    }).then((res) => {
      this.setState({ iswebView: false });
      // this.createShopifyOrder();
      console.warn(res);
    });
  };

  handlePaymentResponse = () => {
    axios(`https://secure.paytabs.com/payment/query`, {
      headers: {
        authorization: 'SDJNLL26JN-HZHWDR6DJN-BWHWGWRMMZ',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      data: {
        profile_id: 47606,
        tran_ref: JSON.stringify(this.state.paymentdata.tran_ref),
      },
    }).then((res) => {
      const { itemdata, productQty, type } = this.props.route.params;
      if (res && res.data.payment_result.response_message == 'Authorised') {
        this.setState({ paymentdata: res.data });
        // this.handleBackApi(res.data);
        // this.saveData();
        this.createShopifyOrder();
        this.props.navigation.navigate('CheckoutHistoryScreen', {
          orderRef: res.data.tran_ref,
          itemdata: itemdata,
          productQty: productQty,
          type: type,
        });
      } else {
        this.props.navigation.navigate('DashboardScreen');
      }
    });
  };
  createShopifyOrder = async () => {
    try {
      const { UserData } = this.state;
      const { apiparams = null } = this.props.route.params;
      let products = [];
      const { uaddress } = apiparams;
      const { id } = UserData;
      const customerData = base64.decode(
        id === '1wf23gv3erty3jt1234he'
          ? 'Z2lkOi8vc2hvcGlmeS9DdXN0b21lci80NDQ2NTE2NzczMDU5'
          : id,
      );
      let customer_id = customerData.split('/').pop();
      if (id == '1wf23gv3erty3jt1234he') {
        const ExistingUser = await this.checkUserExistOrNot(uaddress.email);
        if (ExistingUser) {
          customer_id = ExistingUser.id;
        } else {
          customer_id = await this.createUserWithEmail(uaddress);
        }
      }

      const shipping_address = {
        address1: uaddress.address1,
        address2: uaddress.address2 || uaddress.address2,
        city: uaddress.state,
        company: null,
        country: uaddress.country,
        first_name: uaddress.first_name,
        last_name: uaddress.last_name,
        phone: uaddress.phone,
        province: uaddress.city,
        zip: uaddress.pincode,
        name: uaddress.first_name,
        country_code: uaddress.countryISO,
        province_code: '',
      };
      products = apiparams.items.products.map((item) => ({
        variant_id: item.id,
        quantity: item.quantity,
      }));
      console.log('products', products);
      const { GrandTotal } = this.state;
      const tax = Number(GrandTotal * 0.05).toFixed(2);
      if (customer_id) {
        let order = {
          order: {
            line_items: products,
            taxable: true,
            tax_lines: [
              {
                price: tax,
                rate: 0.05,
                title: 'VAT',
              },
            ],
            shipping_address,
            shipping_lines: [
              {
                code: 'INT.TP',
                price: 4.99,
                currency_code: 'AED',
                title: 'Standard',
              },
            ],

            customer: {
              id: customer_id,
            },
            transactions: [
              {
                kind: 'sale',
                status: 'success',
                amount: Number(GrandTotal + GrandTotal * 0.05 + 4.99).toFixed(
                  2,
                ),
              },
            ],
            financial_status: 'paid',
            taxes_included: true,
            total_price: Number(GrandTotal + GrandTotal * 0.05 + 4.99).toFixed(
              2,
            ),
          },
        };

        axios
          .post(
            `${BaseUrl}/admin/api/2020-10/orders.json`,
            JSON.stringify({
              order: {
                line_items: products,
                shipping_address,
                customer: {
                  id: customer_id,
                },
                tax_lines: [
                  {
                    price: (GrandTotal * 0.05).toFixed(2).toString(),
                    rate: 0.05,
                    title: 'VAT',
                  },
                ],
                shipping_lines: [
                  {
                    custom: true,
                    // price: parseInt(GrandTotal) >= 200 ? '0.00' : '4.99',
                    // title: parseInt(GrandTotal) >= 200 ? 'Free' : 'Standard',
                    price: 4.99,
                    currency_code: "AED",
                    title: "Standard",
                  },
                ],
                transactions: [
                  {
                    amount: (GrandTotal * 0.05 + 4.99 + GrandTotal)
                      .toFixed(2)
                      .toString(),
                    kind: 'capture',
                    status: 'success',
                    currency: 'AED',
                    gateway: 'manual',
                    user_id: customer_id,
                  },
                ],
                total_tax: (GrandTotal * 0.05).toFixed(2).toString(),
                financial_status: 'paid',
              },
            }),
            {
              headers: {
                Authorization: base64Auth,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            },
          )
          .then((resp) => {
            const { data } = resp;
            console.log(data);
            this.props.removeFromCart([]);
            this.props.navigation.navigate('CheckoutHistoryScreen', {
              orderRef: data.order.id,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (e) {
      alert(e);
    }
  };

  createUserWithEmail = async (userInfo) => {
    try {
      const user = await axios.post(
        `${BaseUrl}/admin/api/2020-10/customers.json`,
        JSON.stringify({
          customer: {
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            email: userInfo.email,
            // phone: uaddress.phone,
            verified_email: true,
            addresses: [
              {
                address1: userInfo.address1,
                city: userInfo.city,
                province: userInfo.city,
                phone: userInfo.phone,
                zip: '',
                last_name: userInfo.last_name,
                first_name: userInfo.first_name,
                country: userInfo.countryISO,
              },
            ],
            send_email_invite: true,
          },
        }),
        {
          headers: {
            Authorization: base64Auth,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      const { data } = user;
      return data.customer.id;
    } catch (e) {
      console.log(e.response);
      return false;
    }
  };

  checkUserExistOrNot = async (email) => {
    const customersData = await axios.get(
      `${BaseUrl}/admin/api/2020-10/customers/search.json?query=${email}`,
      {
        headers: {
          Authorization: base64Auth,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    const { data } = customersData;
    const user = data.customers.find(
      (customer) => customer.email.toLowerCase() == email.toLowerCase(),
    );
    return user;
  };
  render() {
    const { TTComDB16, TTComL16, TTComDB28, TTComM14, TTComM18 } = CommonStyles;

    const {
      isLoading,
      options,
      showStates,
      iswebView,
      paymentdata,
      GrandTotal,
    } = this.state;
    const total = Number(GrandTotal + GrandTotal * 0.05 + 4.99).toFixed(2);
    if (iswebView) {
      return (
        <View style={{ flex: 1 }}>
          <WebView
            ref={(ref) => {
              this.webview = ref;
            }}
            onNavigationStateChange={(event) => {
              event.canGoBack
                ? !paymentdata.length > 0 && this.createShopifyOrder()
                : null;
            }}
            source={{ uri: this.state.webUrl, method: 'GET' }}
            containerStyle={{
              backfaceVisibility: 'hidden',
              height: height,
              width: width,
            }}
          />
        </View>
      );
    } else
      return (
        <>
          <CustomStatusBar />
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: iswebView ? 'transparent' : 'white',
            }}>
            {/* <StatusBar backgroundColor = "#fff" barStyle = "dark-content" /> */}

            {isLoading ? (
              <Loader />
            ) : (
                <View
                  style={{
                    flex: 9,
                    paddingHorizontal: iswebView ? 0 : 20,
                    marginTop: 60,
                  }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginTop: 100 }} />

                    {!iswebView && (
                      <View>
                        <CustomTracker stage={2} />

                        <View
                          style={{
                            borderRadius: 12,
                            borderColor: '#E9E9E9',
                            padding: 20,
                            width: '100%',
                            marginVertical: 20,
                            backgroundColor: '#F2F2F2',
                          }}>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                              <Text style={[TTComM14, { marginVertical: 5 }]}>
                                Subtotal
                            </Text>
                              <Text style={[TTComM14, { marginVertical: 5 }]}>
                                Shipping
                            </Text>
                              <Text style={[TTComM14, { marginVertical: 5 }]}>
                                VAT 5%
                            </Text>
                            </View>

                            <View style={{ width: '50%', alignItems: 'flex-end' }}>
                              <Text style={[TTComM18, { marginVertical: 3 }]}>
                                {Number(GrandTotal).toFixed(2)} AED
                            </Text>
                              <Text style={[TTComM18, { marginVertical: 3 }]}>
                                4.99 AED
                            </Text>
                              <Text style={[TTComM18, { marginVertical: 3 }]}>
                                {Number(GrandTotal * 0.05).toFixed(2)} AED
                            </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              width: '100%',
                              height: 1,
                              backgroundColor: '#000',
                              marginVertical: 5,
                            }}
                          />

                          <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                              <Text style={[TTComM18, { marginVertical: 5 }]}>
                                Total
                            </Text>
                            </View>

                            <View style={{ width: '50%', alignItems: 'flex-end' }}>
                              <Text style={[TTComDB28, { marginVertical: 3 }]}>
                                {total} AED
                            </Text>
                            </View>
                          </View>
                        </View>
                        <View style={{ marginVertical: 20 }} />
                        <View style={{ marginBottom: 30 }}>
                          <CustomButton
                            buttonStyles="btn-primary"
                            textStyles="txt-primary"
                            text="Pay by Credit Card"
                            width="100%"
                            onAction={
                              () => {
                                this.handlepayment();
                              }
                              // this.props.navigation.navigate(
                              //   'CheckoutPaymentScreen1',
                              // )
                            }
                          />

                          <View style={{ marginVertical: 30 }} />
                          {/* 
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#000',
                            borderRadius: 26,
                            paddingVertical: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image source={appleBlackIcon} />
                        </TouchableOpacity> */}

                          {/* <View style={{marginVertical: 10}} />
                        <CustomButton
                          buttonStyles="btn-secondary-black"
                          textStyles="txt-secondary"
                          text="Cash on delivery"
                          width="100%"
                          onAction={() =>
                            this.props.navigation.navigate(
                              'CheckoutHistoryScreen',
                            )
                          }
                        /> */}
                        </View>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                position: 'absolute',
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
  removeAllItems,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckoutPaymentScreen);

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
        <Text
          style={{
            color: placeholder ? '#8C8C8C' : '#000',
            fontSize: 16,
            borderRadius: 12,
            backgroundColor: '#fff',
            fontFamily: 'TTCommons-Medium',
            borderWidth: 1.5,
            borderColor: '#E9E9E9',
            paddingLeft: 20,
            height: 50,
            textAlignVertical: 'center',
          }}>
          {value === '' && placeholder
            ? placeholder
            : value === ''
              ? 'Country'
              : value}
        </Text>
        <Image
          source={require('../../../assests/RegisterScreen/dropdownDownIcon/Polygon2.png')}
          style={{ position: 'absolute', top: '40%', right: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
};
