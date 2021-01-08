import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';

import { BaseUrl, base64Auth } from '../../utils/constants';
import { setCartItem } from '../../store/actions';
import axios from 'axios';

import {
  CustomHeaderPrim,
  logoSmall,
  TabNavButton,
  filterIcon,
  ItemList,
  Loader,
} from '../../SharedComponents';

import { CommonStyles } from '../../SharedComponents';
import graphqlFetchHandler from '../../utils/graphqlFetchHandler';
import { CategoryList, CustomSelectList, FilterItem } from './components';
import CustomStatusBar from '../../SharedComponents/CustomStatusBar/CustomStatusBar';
import Shimmer from '../../SharedComponents/Shimmer';
class ShoppingListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFilter: false,
      productList: [],
      categoriesList: [],
      isLoading: false,
      image: '',
      whichCategory: '',
      isSearchData: false, selectedItem: null, selectedProduct: ''
    };
  }

  componentDidMount() {
    this.getCategoryList();
    this.getProductList('All');
  }

  getCategoryProductlList = (data) => {
    const Product = [
      { item: 'Cameras', id: '224918962341' },
      { item: 'Lenses', id: '235816943811' },
      { item: 'Audio', id: '220604661925' },
      { item: 'Lighting & Studio', id: '237427294403' },
      { item: 'Electronics', id: '224923615397' },
      { item: 'Editing', id: '224924500133' },
      { item: 'Camera Equipment', id: '224927219877' },
      { item: 'Camera Accessories', id: '218930675877' },
      { item: 'Express Deals', id: '216724308133' },
    ];
    const id = Product.filter((item) => {
      return item.item === data.title;
    });
    this.setState({ isLoading: true }, async () => {
      if (id.length && id !== null && id !== '') {
        await axios
          .get(
            BaseUrl +
            `/admin/api/2020-07/products.json?collection_id=${id[0].id}`,
            {
              headers: {
                Authorization: base64Auth,
              },
            },
          )
          .then((res) => {
            if (res.data.products && res.data.products.length) {
              this.setState({ productList: res.data.products, isLoading: false });
            }
          })
          .catch((err) => {
            this.setState({ isLoading: false });
            console.log('Err in get Product list in Dashboard', err);
          });
      }
    });
  };

  getProductList = (area) => {
    this.setState({ isLoading: true }, async () => {
      if (area == 'Print') {
        await axios
          .get(
            BaseUrl +
            '/admin/api/2020-07/products.json?collection_id=226213822629',
            {
              headers: {
                Authorization: base64Auth,
              },
            },
          )
          .then((res) => {
            console.warn('Print', res);
            if (res.data.products && res.data.products.length) {
              this.setState(
                {
                  productList: res.data.products,
                  isLoading: false
                },
                //   () => {
                //     console.log(
                //       'Res get Product list in Dashboard ',
                //       this.state.productList,
                //     );
                //   },
              );
            } else {
              this.setState({ isLoading: false, productList: [] });
            }
          })
          .catch((err) => {
            this.setState({ isLoading: false });
          });
      } else if (area == 'Buy') {
        await axios
          .get(
            BaseUrl +
            '/admin/api/2020-07/products.json?collection_id=235418124483',
            {
              headers: {
                Authorization: base64Auth,
              },
            },
          )
          .then((res) => {
            console.warn('Buy', res);
            if (res.data.products && res.data.products.length) {
              this.setState(
                { productList: res.data.products, isLoading: false, whichCategory: 'Buy' },
                //   () => {
                //     console.log(
                //       'Res get Product list in Dashboard ',
                //       this.state.productList,
                //     );
                //   },
              );
            } else {
              this.setState({ isLoading: false, productList: [] });
            }
          })
          .catch((err) => {
            this.setState({ isLoading: false });
          });
      } else if (area == 'Rent') {
        await axios
          .get(
            BaseUrl +
            '/admin/api/2020-07/products.json?collection_id=224574242981',
            {
              headers: {
                Authorization: base64Auth,
              },
            },
          )
          .then((res) => {
            console.warn('Rent', res);
            if (res.data.products && res.data.products.length) {
              this.setState(
                { productList: res.data.products, isLoading: false, whichCategory: 'Rent' },
                //   () => {
                //     console.log(
                //       'Res get Product list in Dashboard ',
                //       this.state.productList,
                //     );
                //   },
              );
            } else {
              this.setState({ isLoading: false, productList: [] });
            }
          })
          .catch((err) => {
            this.setState({ isLoading: false });
          });
      } else {
        await axios
          .get(
            BaseUrl +
            '/admin/api/2020-07/products.json?collection_id=235418124483',
            {
              headers: {
                Authorization: base64Auth,
              },
            },
          )
          .then((res) => {
            console.warn('All', res);
            if (res.data.products && res.data.products.length) {
              this.setState(
                {
                  productList: res.data.products,
                  isLoading: false,
                  whichCategory: 'All',
                },
                //   () => {
                //     console.log(
                //       'Res get Product list in Dashboard ',
                //       this.state.productList,
                //     );
                //   },
              );
            } else {
              this.setState({ isLoading: false, productList: [] });
            }
          })
          .catch((err) => {
            this.setState({ isLoading: false });
          });
      }
    });
  };

  handleFilter = () => {
    this.setState({ isFilter: !this.state.isFilter });
  };

  handleCategory = (data) => {
    console.log('handleCategory ', data);
  };

  filterData = (data) => {
    // console.warn(data.id);

    if (data) {
      let id = data.id;
      this.props.navigation.navigate('ItemDetailsScreen', { productId: id });
    }
  };

  getCategoryList = async () => {
    const categories = [
      'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIyNDkxODk2MjM0MQ==',
      'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIzNTgxNjk0MzgxMQ==',
      'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIyMDYwNDY2MTkyNQ==',
      'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIyNDkyNzIxOTg3Nw==',
      'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIxODkzMDY3NTg3Nw==',
      'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIyNDkyMzYxNTM5Nw==',
      'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIyNDkyNDUwMDEzMw==',
      'Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIzNzQyNzI5NDQwMw==',
    ];
    //   let index = 0;
    //   while (index < categories.length) {
    //     const query = `
    //     {
    //       node(id:"${categories[index]}") {
    //         ...on Collection {
    //             title
    //           image{
    //             originalSrc
    //           }
    //             }
    //         }
    //     }
    // `;
    //     graphqlFetchHandler(
    //       { query },
    //       (onSuccess) => {
    //         this.setState({ image: onSuccess.data.node.image });
    //         console.warn(onSuccess);
    //         this.setState({
    //           categoriesList: [...this.state.categoriesList, onSuccess.data.node],
    //         });
    //       },
    //       (error) => {
    //         this.setState({ isCustomToaster: 'Something wrong', isLoader: false });
    //         console.log(error);
    //       },
    //     );
    //     index++;
    //   }

    for (let index = 0; index < categories.length; index++) {
      const query = `
        {
          node(id:"${categories[index]}") {
            ...on Collection {
                title
              image{
                originalSrc
              }
                }
            }
        }
    `;
      graphqlFetchHandler(
        { query },
        (onSuccess) => {
          this.setState({ image: onSuccess.data.node.image });
          console.warn(onSuccess);
          this.setState({
            categoriesList: [...this.state.categoriesList, onSuccess.data.node],
          });
        },
        (error) => {
          this.setState({ isCustomToaster: 'Something wrong', isLoader: false });
          console.log(error);
        },
      );
    }
  };
  _choosen(selectedItem) {
    this.setState({ selectedItem });
    this.setState({ selectedProduct: selectedItem.title })
  }
  // actionOnRow(item) {
  //   alert(item.title);
  // }
  render() {
    const { TTComDB28, tabNavContainer, TTComDB16 } = CommonStyles;

    const {
      isFilter,
      categoriesList,
      productList,
      isLoading,
      whichCategory,
      isSearchData,
    } = this.state;

    const { cartList } = this.props;
    // console.warn('categlist', categoriesList);

    return (
      <>
        <CustomStatusBar />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flex: 9, paddingHorizontal: 20 }}>
            {isLoading ? (
              // <Loader />
              <View style={{ flex: 1, marginTop: 170 }}>
                <Shimmer autoRun={true} visible={false} duration={3000}>
                  <Text style={TTComDB28}>Shop by Category</Text>
                </Shimmer>

                <View style={{ flexDirection: 'row' }}>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{ alignItems: 'center', padding: 10 }}>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: 100, height: 100, borderRadius: 50 }}>
                        <View></View>
                      </Shimmer>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                        <Text style={[TTComDB16, { paddingVertical: 10 }]}>name</Text>
                      </Shimmer>
                    </View>
                    <View style={{ alignItems: 'center', padding: 10 }}>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: 100, height: 100, borderRadius: 50 }}>
                        <View></View>
                      </Shimmer>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                        <Text style={[TTComDB16, { paddingVertical: 10 }]}>name</Text>
                      </Shimmer>
                    </View>
                    <View style={{ alignItems: 'center', padding: 10 }}>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: 100, height: 100, borderRadius: 50 }}>
                        <View></View>
                      </Shimmer>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                        <Text style={[TTComDB16, { paddingVertical: 10 }]}>name</Text>
                      </Shimmer>
                    </View>
                    <View style={{ alignItems: 'center', padding: 10 }}>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: 100, height: 100, borderRadius: 50 }}>
                        <View></View>
                      </Shimmer>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                        <Text style={[TTComDB16, { paddingVertical: 10 }]}>name</Text>
                      </Shimmer>
                    </View>
                    <View style={{ alignItems: 'center', padding: 10 }}>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: 100, height: 100, borderRadius: 50 }}>
                        <View></View>
                      </Shimmer>
                      <Shimmer autoRun={true} visible={false} duration={3000} style={{ marginTop: 10 }}>
                        <Text style={[TTComDB16, { paddingVertical: 10 }]}>name</Text>
                      </Shimmer>
                    </View>
                  </ScrollView>
                </View>

                <Shimmer autoRun={true} visible={false} duration={3000}>
                  <Text style={[TTComDB16, { paddingVertical: 10 }]}>name</Text>
                </Shimmer>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: '10%' }}>
                    <Text>All</Text>
                  </Shimmer>
                  <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: '10%', marginHorizontal: 5 }}>
                    <Text>Buy</Text>
                  </Shimmer>
                  <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: '10%' }}>
                    <Text>Rent</Text>
                  </Shimmer>
                  <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: '10%', marginHorizontal: 5 }}>
                    <Text>Print</Text>
                  </Shimmer>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: '45%', height: 160 }}>
                    <View
                      style={{
                        borderRadius: 27
                      }}>

                    </View>
                  </Shimmer>
                  <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: '45%', height: 160, marginLeft: '10%' }}>
                    <View
                      style={{
                        borderRadius: 27
                      }}>

                    </View>
                  </Shimmer>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: '45%', height: 160, marginTop: 20 }}>
                    <View
                      style={{
                        borderRadius: 27
                      }}>

                    </View>
                  </Shimmer>
                  <Shimmer autoRun={true} visible={false} duration={3000} style={{ width: '45%', height: 160, marginLeft: '10%', marginTop: 20 }}>
                    <View
                      style={{
                        borderRadius: 27
                      }}>

                    </View>
                  </Shimmer>
                </View>
              </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ flex: 1, marginTop: 170 }}>
                    <Text style={TTComDB28}>Shop by Category</Text>
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={
                        categoriesList && categoriesList.length > 0
                          ? categoriesList
                          : []
                      }
                      renderItem={(item, index) => {
                        // console.warn('1122', item.item);
                        const isSelected = (this.state.selectedItem === item.item);
                        const borderColor = isSelected ? "#6d74fc" : "#ffffff";
                        return (
                          // <CategoryList
                          //   label={
                          //     item.item.title && item.item.title.length > 15
                          //       ? item.item.title.slice(0, 15) + '...'
                          //       : item.item.title
                          //   }
                          //   image={
                          //     item.item &&
                          //       item.item.image !== null &&
                          //       item.item.image !== undefined &&
                          //       item.item.image.originalSrc !== null &&
                          //       item.item.image.originalSrc !== ''
                          //       ? { uri: item.item.image.originalSrc }
                          //       : require('../../../assests/Common/imagePlaceholder/placeholder.jpg')
                          //   }
                          //   selectCategory={() =>
                          //     this.getCategoryProductlList(item.item)
                          //   }
                          // />
                          <TouchableOpacity
                            onPress={() => { this.getCategoryProductlList(item.item); this._choosen(item.item) }}
                            style={{ alignItems: 'center', padding: 10 }}>
                            <View style={{ width: 105, height: 105, borderRadius: 70, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor }}>
                              <Image
                                // defaultSource={require('../../../assests/Common/imagePlaceholder/placeholder.jpg')}
                                source={item.item &&
                                  item.item.image !== null &&
                                  item.item.image !== undefined &&
                                  item.item.image.originalSrc !== null &&
                                  item.item.image.originalSrc !== ''
                                  ? { uri: item.item.image.originalSrc }
                                  : require('../../../assests/Common/imagePlaceholder/placeholder.jpg')}
                                style={{ width: 90, height: 90, borderRadius: 50 }}
                              />
                            </View>
                            <Text style={[TTComDB16, { paddingVertical: 10 }]}>{item.item.title && item.item.title.length > 15
                              ? item.item.title.slice(0, 15) + '...'
                              : item.item.title}</Text>
                          </TouchableOpacity>
                        );
                      }}
                      style={{ flexDirection: 'row' }}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                  {
                    this.state.selectedItem ? <Text style={TTComDB28}>{this.state.selectedProduct}</Text> : <Text style={TTComDB28}>Products for you</Text>
                  }
                  {/* <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={TTComDB28}>Products for you</Text>
                    {/* <TouchableOpacity onPress={() => this.handleFilter()}>
                    <Image source={filterIcon} />
                  </TouchableOpacity> */}
                  {/* </View>  */}

                  <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <CustomSelectList
                      label="All"
                      isActive={whichCategory == 'All' ? true : false}
                      onPress={() => {
                        this.setState({ whichCategory: 'All' });
                        this.getProductList('All');
                      }}
                    />
                    <CustomSelectList
                      label="Buy"
                      isActive={whichCategory == 'Buy' ? true : false}
                      onPress={() => {
                        this.setState({ whichCategory: 'Buy' });
                        this.getProductList('Buy');
                      }}
                    />
                    <CustomSelectList
                      label="Rent"
                      isActive={whichCategory == 'Rent' ? true : false}
                      onPress={() => {
                        this.setState({ whichCategory: 'Rent' });
                        this.getProductList('Rent');
                      }}
                    />
                    <CustomSelectList
                      label="Print"
                      isActive={whichCategory == 'Print' ? true : false}
                      onPress={() => {
                        this.setState({ whichCategory: 'Print' });
                        this.getProductList('Print');
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      marginBottom: 90,
                    }}>
                    {productList && productList.length ? (
                      productList.map((item, index) => {
                        return (
                          <ItemList
                            discount={
                              item.variants &&
                                item.variants[0] &&
                                item.variants[0].price &&
                                item.variants[0].compare_at_price
                                // ? '-' +
                                // Math.floor(
                                //   100 -
                                //   (item.variants[0].price /
                                //     item.variants[0].compare_at_price) *
                                //   100,
                                // )
                                // : '0'
                                ?
                                'AED ' + (item.variants[0].price -
                                  item.variants[0].compare_at_price)
                                : '0'
                            }
                            key={index}
                            onAction={() =>
                              this.props.navigation.navigate(
                                'ItemDetailsScreen',
                                {
                                  productId: item.id,
                                },
                              )
                            }
                            image={
                              item.image &&
                              item.image.src !== '' &&
                              item.image.src !== null && { uri: item.image.src }
                            }
                            itemName={item.title}
                            price={
                              item.variants &&
                                item.variants[0] &&
                                item.variants[0].price
                                ? 'AED  ' + Math.floor(item.variants[0].price)
                                : '12 AED'
                            }
                          />
                        );
                      })
                    ) : (
                        <View
                          style={{
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                          }}>
                          <Text style={{ fontFamily: 'TTCommons-Medium' }}>
                            No Products Available
                      </Text>
                        </View>
                      )}
                  </View>
                </ScrollView>
              )}
          </View>
          {!isSearchData && (
            <SafeAreaView>
              <View style={[tabNavContainer, { width: '90%' }]}>
                <TabNavButton
                  nav={this.props}
                  active="2"
                  cartNotification={cartList}
                />
              </View>
            </SafeAreaView>
          )}

          {isFilter && (
            <Modal animationType="slide" transparent={false} visible={isFilter}>
              <View style={{ flex: 1 }}>
                <CustomHeaderPrim
                  placeholder="What are you looking for?"
                  searchBox
                  handleSearchBox={() => console.log('search box')}
                  searchBoxClearButton
                  searchBoxClear={() => console.log('search box clear')}
                />

                <View style={{ flex: 9 }}>
                  <FilterItem
                    name="Sony Aplha X 1 32.mm"
                    onAction={() => this.handleFilter()}
                  />
                  <FilterItem
                    name="Sony Aplha X 1 32.mm"
                    onAction={() => this.handleFilter()}
                  />
                  <FilterItem
                    name="Sony Aplha X 1 32.mm"
                    onAction={() => this.handleFilter()}
                  />
                  <FilterItem
                    name="Sony Aplha X 1 32.mm"
                    onAction={() => this.handleFilter()}
                  />
                  <FilterItem
                    name="Sony Aplha X 1 32.mm"
                    onAction={() => this.handleFilter()}
                  />
                  <FilterItem
                    name="Sony Aplha X 1 32.mm"
                    onAction={() => this.handleFilter()}
                  />
                </View>
              </View>
            </Modal>
          )}
          <View
            style={[
              {
                zIndex: 1,
                position: 'absolute',
                backgroundColor: 'transparent',
                width: '100%',
              },
              isSearchData && { height: '100%' },
            ]}>
            <CustomHeaderPrim
              leftIcon={logoSmall}
              leftIconAction={() =>
                this.props.navigation.navigate('DashboardScreen')
              }
              placeholder="What are you looking for?"
              searchBox
              handleSearchBox={() => console.log('search box')}
              data={productList}
              filterData={this.filterData}
              onSearchEvent={(isShow) => {
                this.setState({ isSearchData: isShow });
              }}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

// export default ShoppingListScreen;

const mapStateToProps = (state) => {
  console.log('PROP in REDUX', state.Layout.cartList);
  return {
    cartList: state.Layout.cartList,
  };
};
const mapDispatchToProps = {
  setCartItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListScreen);
