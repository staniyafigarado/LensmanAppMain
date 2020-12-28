import React, { Component } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native';

import { RFPercentage } from 'react-native-responsive-fontsize';
import { setLoginData } from '../../store/actions';

import { connect } from 'react-redux';

// custom components
import { CustomButton } from '../../SharedComponents';

import { CommonStyles } from '../../SharedComponents/CustomStyles';
// import CustomFonts from "../../utils/CommonUtils";
import {
  closeIcon,
  googleWhiteIcon,
  fbWhiteIcon,
} from '../../SharedComponents/CommonIcons';
import AsyncStorage from '@react-native-community/async-storage';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes
} from '@react-native-community/google-signin';
import { BaseUrl, base64Auth } from '../../utils/constants';
import base64 from 'react-native-base64';
import graphqlFetchHandler from '../../utils/graphqlFetchHandler';
import axios from 'axios';
const _getCurrentUserInfo = async () => {
  try {
    let info = await GoogleSignin.signInSilently();
    // console.log('User Info --> ', info);
    this.state.userInfoG(info);
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_REQUIRED) {
      // alert('User has not signed in yet');
      console.log('User has not signed in yet');
    } else {
      // alert("Unable to get user's info");
      console.log("Unable to get user's info");
    }
  }
};
class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {}, userInfoG: {}, profile: '', username: '', email: '', password: '', user: '', setGettingLoginStatus: true,
      form: {
        fullName: '',
        email: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
      },
      passwordConfirm: '',
      isSelected: false,
      isCustomToaster: true,
      apiStatus: {
        message: '',
        status: false,
      },
      isLoading: false,
    };
  }
  // saveDataLocal = async () => {
  //   const guestLogin = {
  //     email: 'guestlogin@gmail.com',
  //     firstName: 'Guest User',
  //     id: '1wf23gv3erty3jt1234he',
  //     lastName: null,
  //     orders: { edges: [] },
  //     phone: null,
  //   };
  //   try {
  //     await AsyncStorage.setItem('loginDetails', JSON.stringify(guestLogin));
  //     this.props.setLoginData(guestLogin);
  //   } catch (err) {
  //     alert('some error occurs');
  //     console.log('Err in set Login Dat to Local', err);
  //   }
  // };
  saveDataLocal = async (data) => {
    if (data) {
      console.warn('jhgfvhbj', data);

      try {
        await AsyncStorage.setItem('loginDetails', JSON.stringify(data));
        this.props.setLoginData(data);
      } catch (err) {
        console.log('Err in set Login Dat to Local', err);
      }
    } else {
      this.setState({
        isCustomToaster: "Login data Didn't get propertly",
        isLoader: false,
      });
    }
  };

  async componentDidMount() {
    this._configureGoogleSignIn();
  }

  _configureGoogleSignIn() {
    GoogleSignin.configure({
      scopes: ['openid', 'email', 'profile'],
      webClientId: '607392749221-b9418slbfpqbko1ddo5h0u553gu6s5li.apps.googleusercontent.com'
    });
    // this._isSignedIn();
  }

  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      // alert('User is already signed in');
      // this.props.navigation.navigate('Home');
      // Set User Info if user is already signed in
      _getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
    // this.setState({ setGettingLoginStatus: false })
    // setGettingLoginStatus(false);
  };

  // _getCurrentUserInfo = async () => {
  //   try {
  //     let info = await GoogleSignin.signInSilently();
  //     // console.log('User Info --> ', info);
  //     this.state.userInfoG(info);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_REQUIRED) {
  //       // alert('User has not signed in yet');
  //       console.log('User has not signed in yet');
  //     } else {
  //       // alert("Unable to get user's info");
  //       console.log("Unable to get user's info");
  //     }
  //   }
  // };

  async GoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo + JSON.stringify(userInfo))
      // this.setState({ userInfo, error: null });
      // Alert.alert("success:" + JSON.stringify(userInfo));
      this.setState({
        profile: userInfo.user.photo,
        username: userInfo.user.name,
        email: userInfo.user.email,
        password: userInfo.user.id
      });
      AsyncStorage.setItem('profile', this.state.profile);
      // AsyncStorage.setItem('username', this.state.username);
      AsyncStorage.setItem('email', this.state.email);
      // this.handlSubmit();
      this.submitRegister();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        // Alert.alert('cancelled');
        console.log('cancelled')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("in progress")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not available or outdated')
      } else {
        console.log(error)
        // Alert.alert('Something went wrong', error.toString());
        console.log('Something went wrong', error.toString())
        this.setState({
          error,
        });
      }
    }
  }

  logoutWithFacebook = () => {
    LoginManager.logOut();
    this.setState({ userInfo: {} });
  };

  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'email,name,id,picture.type(large)',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      { token, parameters: PROFILE_REQUEST_PARAMS },
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          this.setState({
            userInfo: user,
            profile: user.picture.data.url,
            username: user.name,
            email: user.email,
            password: user.id
          });
          // AsyncStorage.setItem('user_id', this.state.userInfo.email);

          AsyncStorage.setItem('profile', this.state.profile);
          // AsyncStorage.setItem('username', this.state.username);
          AsyncStorage.setItem('email', this.state.email);
          console.log('result:', user);
          this.submitRegister();
          console.log(this.state.email);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  // loginWithFacebook = () => {
  //   if (Platform.OS === "android") {
  //     LoginManager.setLoginBehavior("web_only")
  //   }
  //   // Attempt a login using the Facebook login dialog asking for default permissions.
  //   LoginManager.logInWithPermissions(['email']).then(
  //     login => {
  //       if (login.isCancelled) {
  //         console.log('Login cancelled');
  //       } else {
  //         // alert('Login was successful with permissions: ' + login.grantedPermissions.toString());
  //         console.log('Login was successful with permissions: ' + login.grantedPermissions.toString())
  //         AccessToken.getCurrentAccessToken().then(data => {
  //           const accessToken = data.accessToken.toString();
  //           this.getInfoFromToken(accessToken);

  //         });
  //       }
  //     },
  //     error => {
  //       console.log('Login fail with error: ' + error);
  //     },
  //   );
  // };

  loginWithFacebook = () => {
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
    }
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result) => {
        if (result.isCancelled) {
          console.log('Login cancelled')
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              const accessToken = data.accessToken;
              console.log(accessToken);
              // this._fbHome();// Navigatin to next screen
              const infoRequest = new GraphRequest(
                `/me?fields=name,email,picture.type(large)&access_token=${accessToken}`,
                null,
                this._responseInfoCallback
              );
              new GraphRequestManager().addRequest(infoRequest).start();
            }
          )
        }
      },
      (error) => {
        console.log('Login fail with error: ' + error)
      }
    )
  };

  _responseInfoCallback = (error, user) => {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      this.setState({
        userInfo: user,
        profile: user.picture.data.url,
        username: user.name,
        email: user.email,
        password: user.id
      });
      // AsyncStorage.setItem('user_id', this.state.userInfo.email);

      AsyncStorage.setItem('profile', this.state.profile);
      // AsyncStorage.setItem('username', this.state.username);
      AsyncStorage.setItem('email', this.state.email);
      console.log('result:', user);
      this.submitRegister();
      alert("Picture" + this.state.profile + "Name" + this.state.username + "Email" + this.state.email);
    }
  }

  //  Passing data to api
  submitRegister = () => {
    const apiStatus = { ...this.state.apiStatus };
    let input = {
      firstName: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
    this.setState({ isLoading: true }, () => {
      /*axios
        .post(BaseUrl + '/admin/api/2020-07/customers.json', payload, {
          headers: {Authorization: base64Auth},
        })
        .then((res) => {
          console.log('1100 Registeration page', res.data);
          apiStatus.message = 'Successfully Registered ..!';
          apiStatus.status = true;
          this.setState(
            {
              isCustomToaster: true,
              isLoading: false,
              apiStatus,
            },
            () => {
              setTimeout(() => {
                this.props.navigation.navigate('LoginScreen');
              });
            },
            2005,
          );
        })
        .catch((err) => {
          console.warn('Err in Register API', err.response.data);
          if (err.response.data.errors && err.response.data.errors.base) {
            apiStatus.message = err.response.data.errors.base;
            apiStatus.status = false;
            this.setState({
              isCustomToaster: true,
              apiStatus,
            });
          }
          this.setState({isLoading: false});
        });*/
    });
    const query = `
        mutation customerCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customerUserErrors {
              code
              field
              message
            }
            customer {
              id
            }
          }
        }`;
    const onSuccess = (res) => {
      console.warn(res);
      this.setState({ isLoading: false });
      console.log('Registeration page', JSON.stringify(res.data.customerCreate.customerUserErrors));
      // console.log("status:",res.status)
      console.log(res)
      if (
        res &&
        res.data.customerCreate &&
        res.data.customerCreate.customer
      ) {
        apiStatus.message = 'Successfully Registered ..!';
        apiStatus.status = true;
        this.setState(
          {
            isCustomToaster: true,
            apiStatus,
          },
          // () => {
          //   setTimeout(() => {
          //     // this.props.navigation.navigate('LoginScreen');
          //     this.checkLoginData();
          //   });
          // },
          // 100,

        ); this.checkLoginData();

      }
      else {
        apiStatus.message = 'Some error occured';
        if (
          res.data.customerCreate &&
          res.data.customerCreate.customerUserErrors &&
          res.data.customerCreate.customerUserErrors.length > 0
        ) {
          apiStatus.message =
            res.data.customerCreate.customerUserErrors[0].message;
          alert(apiStatus.message)
          // ToastAndroid.show(apiStatus.message, ToastAndroid.SHORT)
          this.checkLoginData();
        }
        // else
        console.log("message", apiStatus.message);
        apiStatus.status = false;
        this.setState({
          isCustomToaster: true,
          apiStatus,
        });
      }
    };
    const onFail = (err) => {
      console.warn('Err in Register API', err);
      // if (err.response.data.errors && err.response.data.errors.base) {
      //   apiStatus.message = 'Some error occured';
      //   apiStatus.status = false;
      //   this.setState({
      //     isCustomToaster: true,
      //     apiStatus,
      //   });
      // }
      this.setState({ isLoading: false });
    };

    graphqlFetchHandler({ query, variables: { input } }, onSuccess, onFail);

    // const {fullName, email, password, phone} = this.state.form;

    // let payload = {
    //   firstName: fullName,
    //   email,
    //   phone,
    //   password,
    // };
  };

  checkLoginData = () => {
    const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerUserErrors {
          code
          field
          message
        }
        customerAccessToken {
          accessToken
          expiresAt
        }
      }
    }
`;
    const {
      form: { userName: email, password },
    } = this.state;
    const onSuccess = (response) => {
      this.setState({ isLoader: false });

      if (
        response &&
        response.data.customerAccessTokenCreate.customerAccessToken
      ) {
        this.getUserDetails(
          response.data.customerAccessTokenCreate.customerAccessToken
            .accessToken,
        );
      } else {
        this.setState({
          isCustomToaster: 'Email id or Password is Incorrect',
        }),
          console.log('response creataaccess', JSON.stringify(response));
      }
    };
    const input = {
      email: this.state.email,
      password: this.state.password
    };
    this.setState({ isLoader: true });
    graphqlFetchHandler({ query, variables: { input } }, onSuccess, (error) => {
      this.setState({ isCustomToaster: 'Something wrong', isLoader: false });
      console.log(error);
    });
    /* axios
      .get(BaseUrl + '/admin/api/2020-07/customers.json', {
        headers: {
          Authorization: base64Auth,
        },
      })
      .then((res) => {
        if (res.data.customers) {
          let customerMailIds = res.data.customers.map((item) => item.email);

          if (customerMailIds.indexOf(this.state.form.userName) !== -1) {
            // console.log("customerMailIds.indexOf(this.state.form.userName) ", res.data.customers[customerMailIds.indexOf(this.state.form.userName)])
            'Successfully Logined');

            this.saveDataLocal(
              res.data.customers[
                customerMailIds.indexOf(this.state.form.userName)
              ],
            );
            this.props.navigation.navigate('DashboardScreen', {
              fromLogin: true,
            });
          } else {
            'Mail id is not matched');
          }
        }
      })
      .catch((err) => {
        console.log('Err in get Product list in Dashboard', err);
      });
      */
  };

  getUserDetails = (token) => {
    const query = `
    {
      customer(customerAccessToken: "${token}") {
        id
        firstName
        lastName
        email
        phone
        orders(first: 5) {
          edges {
            node {
              lineItems(first: 5) {
                edges {
                  node {
                    quantity
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
    `;
    const onSuccess = (response) => {
      if (response) {
        this.setState({ isLoader: false });
        this.saveDataLocal(response.data.customer);
        console.log('hiii')
        this.props.handleCloseModal && this.props.handleCloseModal();
        this.props.navigation.navigate('DashboardScreen', {
          fromLogin: true,
        });
      } else {
        this.setState({
          isCustomToaster: 'Not registred user',
          isLoader: false,
        });
      }
    };
    this.setState({ isLoader: true });
    graphqlFetchHandler({ query }, onSuccess, (error) => {
      this.setState({ isCustomToaster: 'Something wrong', isLoader: false });
      console.log(error);
    });
  };


  render() {
    const isLogin = this.state.userInfo.name;
    const buttonText = isLogin ? 'Logout With Facebook' : 'Login From Facebook';
    const onPressButton = isLogin
      ? this.logoutWithFacebook
      : this.loginWithFacebook;
    const { TTComDB16, TTComL16 } = CommonStyles;
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
              // console.warn('kk');

              this.props.handleCloseModal && this.props.handleCloseModal();
              this.props.navigation.navigate('DashboardScreen', {
                fromLogin: true,
              });
            }}
            style={{
              // backgroundColor: 'red',
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              top: 10,
              left: 10,
              // position: 'absolute',
              // backgroundColor: 'red',
            }}>
            <Image source={closeIcon} />
          </TouchableOpacity>
          <View
            style={{ flex: 5, justifyContent: 'flex-end', alignItems: 'center' }}>
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
            style={{ flex: 7, justifyContent: 'center', alignItems: 'center' }}>
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

              <View style={{ marginVertical: 5 }} />

              <CustomButton
                text="Continue with Google"
                buttonStyles="btn-secondary"
                textStyles="txt-primary"
                icon={googleWhiteIcon}
                onAction={() => this.GoogleSignin()}
              />
              <View style={{ marginVertical: 5 }} />

              <CustomButton
                text="Continue with Facebook"
                buttonStyles="btn-secondary"
                textStyles="txt-primary"
                icon={fbWhiteIcon}
                onAction={() => { this.loginWithFacebook(); }}
              />

              <View style={{ marginVertical: 5 }} />

              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={[TTComL16, { color: '#fff' }]}>
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
                      { color: '#fff', fontFamily: 'TTCommons-Bold' },
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

const mapStateToProps = (state) => {
  console.log('PROP in REDUX in LOGIN ', state.Login);
  return {};
};
const mapDispatchToProps = {
  setLoginData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
