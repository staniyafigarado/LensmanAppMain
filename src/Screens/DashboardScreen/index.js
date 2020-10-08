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
  Modal,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {
  CustomHeaderPrim,
  CustomButton,
  Loader,
  TabNavButton,
} from '../../SharedComponents';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';

import {
  logoSmall,
  SchoolBg,
  signature,
} from '../../SharedComponents/CommonIcons';

import {
  ItemList,
  PopupItemList,
  ForStudentSection,
  DemoSection,
} from './components';

import Styles from './DashboardStyles';
import {CommonStyles} from '../../SharedComponents/CustomStyles';
import {BaseUrl, base64Auth} from '../../utils/constants';

import {Demo1, Demo2, Demo3} from '../../Screens';

import Swiper from 'react-native-swiper';
import AuthScreen from '../AuthScreen';

import {setCartItem} from '../../store/actions';

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    sectionId: '',
    isSection: false,
    isDemoShow: true,
    demoScreenNum: 0,
    SchoolImage: '',
    productList: [],
    index: 0,
    isLoading: false,
  };

  componentDidMount() {
    this.getDataFromStore('loginDetails');
    if (
      this.props.route.params &&
      this.props.route.params.fromScreen &&
      this.props.route.params.fromScreen !== ''
    ) {
      // console.log('pling in DID mount Value', this.props.route.params);
      this.setState(
        {
          sectionId: this.props.route.params.fromScreen,
          isSection: true,
          isDemoShow: false,
          SchoolImage: this.props.route.params.data,
        },
        () => console.log('1122', this.state.isSection),
      );
    }

    if (this.props.route.params && this.props.route.params.fromLogin) {
      this.setState({isDemoShow: false});
    }

    this.getProductList();
  }

  componentDidUpdate(prevProps) {
    const {params} = this.props.route;

    if (params && params.fromScreen && params.fromScreen !== '') {
      console.log('In dashboard Screen Before ', this.props.route.params);
      console.log(
        'In dashboard Screen Before 111 ',
        this.props.route.params,
        prevProps.route.params,
      );
      if (this.props.route.params.fromScreen) {
        if (this.props.route.params !== prevProps.route.params) {
          this.setState(
            {
              sectionId: params.fromScreen,
              isSection: true,
              SchoolImage: this.props.route.params.SchoolImage,
            },
            () => console.log('1122', this.state.isSection),
          );
        }
      }
    }
    if (prevProps.isFocused !== this.props.isFocused) {
      // this.getDataFromStore('loginDetails');
      if (!this.state.isDemoShow) this.getProductList();
    }
  }

  componentWillUnmount() {
    console.log('Will unmounted on Dashboard');
  }

  filterData = (data) => {
    if (data) {
      this.getProductList(data.id);
    }
  };

  getProductList = (id) => {
    this.setState({isLoading: true}, () => {
      if (id) {
        axios
          // .get(BaseUrl + '/admin/api/2020-07/products/' + id + '.json', {
          .get(
            BaseUrl +
              '/admin/api/2020-07/products.json?collection_id=224252428453',
            {
              headers: {
                Authorization: base64Auth,
              },
            },
          )
          .then((res) => {
            // if (res.data.product && res.data.products.length) {
            this.setState(
              {productList: [res.data.product], isLoading: false},
              () => {
                console.warn(
                  'Res get Product list in Dashboard with Id ',
                  res.data,
                );
              },
            );
          })
          .catch((err) => {
            this.setState({isLoading: false});
            console.log('Err in get Product list in Dashboard', err);
          });
      } else {
        axios
          // .get(BaseUrl + '/admin/api/2020-07/products.json', {
          .get(
            BaseUrl +
              '/admin/api/2020-07/products.json?collection_id=224252428453',
            {
              headers: {
                Authorization: base64Auth,
              },
            },
          )
          .then((res) => {
            if (res.data.products && res.data.products.length) {
              this.setState(
                {productList: res.data.products, isLoading: false},
                () => {
                  // console.log("Res get Product list in Dashboard ",this.state.productList);
                },
              );
            }
          })
          .catch((err) => {
            this.setState({isLoading: false});
            console.log('Err in get Product list in Dashboard', err);
          });
      }
    });
  };

  handleDemoScreen = (status) => {
    this.setState({demoScreenNum: this.state.demoScreenNum + 1}, () => {
      // console.log('this.state.demoScreenNum', this.state.demoScreenNum);
      if (this.state.demoScreenNum === 4) {
        this.setState({isDemoShow: false});
      }
    });

    if (status) this.setState({isDemoShow: false});
  };

  getDataFromStore = async (value) => {
    try {
      let loggedData = await AsyncStorage.getItem(value);
      console.log('Is Logged', loggedData);

      if (loggedData !== null) {
        this.setState({isDemoShow: false});
      } else {
        this.setState({isDemoShow: true});
      }
    } catch (err) {
      console.log('Is Logged', err);
    }
  };

  storeData = async (data, value) => {
    try {
      await AsyncStorage.setItem(data, value);
      // console.log('Seted vValues', loggedData);
    } catch (err) {
      console.log('Seted Values ', err);
    }
  };

  handleSection = () => {
    this.setState({isSection: !this.state.isSection});
  };

  render() {
    const {tabNavContainer} = Styles;
    const {
      isSection,
      isDemoShow,
      SchoolImage,
      productList,
      isLoading,
    } = this.state;
    const {TTComDB28, TTComDB16} = CommonStyles;

    const {cartList} = this.props;
    // console.warn(productList);

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={{flex: 1, zIndex: 4, backgroundColor: 'transparent'}}>
          <CustomHeaderPrim
            leftIcon={logoSmall}
            placeholder="What are you looking for?"
            searchBox
            handleSearchBox={() => console.log('search box')}
            data={productList}
            filterData={this.filterData}
          />
        </View>

        {isLoading ? (
          <Loader />
        ) : (
          <View style={{flex: 11, paddingHorizontal: 20}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{flex: 1, marginTop: 100}}>
                <ImageBackground
                  source={SchoolBg}
                  style={{width: '100%', height: 450}}
                  // imageStyle={{borderRadius: 25, borderWidth: 1.5}}
                >
                  <LinearGradient
                    colors={['#ffffff00', '#00000091']}
                    locations={[0.1, 0.9]}
                    style={{flex: 1, zIndex: 10, borderRadius: 25}}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        padding: 10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                          marginBottom: 5,
                        }}>
                        <Text style={[TTComDB16, {color: '#fff'}]}>
                          Powered by
                        </Text>
                        <Image source={signature} />
                      </View>
                      <View>
                        <Text style={[TTComDB28, {color: '#fff'}]}>
                          Take your at-home
                        </Text>
                        <Text style={[TTComDB28, {color: '#fff'}]}>
                          School Photo!
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: 5,
                        }}>
                        <CustomButton
                          buttonStyles="btn-primary"
                          textStyles="txt-primary"
                          text="Take Picture"
                          width="49%"
                          onAction={() =>
                            this.props.navigation.navigate(
                              'SchoolSubmitPhotoScreen',
                            )
                          }
                          // onAction        = {()=>this.props.navigation.navigate('DemoOverlay1')}
                        />
                        <CustomButton
                          buttonStyles="btn-secondary"
                          textStyles="txt-primary"
                          text="Upload"
                          width="50%"
                          onAction={() =>
                            this.props.navigation.navigate(
                              'CustomGalleryScreen',
                            )
                          }
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
              <View style={{marginVertical: 5}}>
                <Image
                  source={require('../../../assests/Common/newDashboardDesign/LensmanLogo.png')}
                />
              </View>

              <View style={{marginTop: 30, paddingBottom: 100}}>
                <Text style={TTComDB28}>Featured Products</Text>
                <View
                  style={{
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}>
                  {productList && productList.length
                    ? productList.map((item, index) => {
                        return (
                          <ItemList
                            key={index}
                            label={item.title}
                            price={
                              item.variants &&
                              item.variants[0] &&
                              item.variants[0].price
                                ? item.variants[0].price + ' AED'
                                : '12 AED'
                            }
                            itemImage={
                              item.image &&
                              item.image.src !== '' &&
                              item.image.src !== null &&
                              item.image.src
                            }
                            onAction={() =>
                              this.props.navigation.navigate(
                                'ItemDetailsScreen',
                                {productId: productList[index].id},
                              )
                            }
                          />
                        );
                      })
                    : null}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
        <SafeAreaView>
          <View style={tabNavContainer}>
            <TabNavButton
              nav={this.props}
              active="1"
              cartNotification={cartList}
            />
          </View>
        </SafeAreaView>
        {(isSection || isDemoShow) && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isSection || isDemoShow}>
            {isSection && (
              <ForStudentSection
                schoolImage={SchoolImage}
                handleSection={this.handleSection}
              />
            )}
            {isDemoShow && (
              <Swiper
                style={{}}
                showsButtons={false}
                showsPagination={false}
                loop={false}
                index={this.state.index}
                onIndexChanged={(i) =>
                  this.setState({index: i}, () => {
                    if (this.state.index < 0) {
                      this.setState({index: 0}, () =>
                        this.swiper.scrollBy(this.state.index + 1, true),
                      );
                    }
                    console.log('index', this.state.index);
                  })
                }
                ref={(ref) => {
                  this.swiper = ref;
                }}>
                <Demo1
                  {...this.props}
                  changeScreen={() =>
                    this.swiper.scrollBy(this.state.index + 1, true)
                  }
                  closeModal={() => this.setState({isDemoShow: false})}
                />

                <Demo2
                  {...this.props}
                  changeScreen={() =>
                    this.swiper.scrollBy(this.state.index + 1, true)
                  }
                  closeModal={() => this.setState({isDemoShow: false})}
                />

                <Demo3
                  {...this.props}
                  changeScreen={() =>
                    this.swiper.scrollBy(this.state.index + 1, true)
                  }
                  closeModal={(cb) => this.setState({isDemoShow: false})}
                />
                <AuthScreen
                  {...this.props}
                  changeScreen={() =>
                    this.swiper.scrollBy(this.state.index + 1, true)
                  }
                  handleCloseModal={(cb) => this.setState({isDemoShow: false})}
                />
              </Swiper>
            )}
          </Modal>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('PROP in REDUX', state.Layout.cartList);
  return {
    cartList: state.Layout.cartList,
  };
};
const mapDispatchToProps = {
  setCartItem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(function (props) {
  const isFocused = useIsFocused();

  return <DashboardScreen {...props} isFocused={isFocused} />;
});
