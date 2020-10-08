import React, {Component} from 'react';
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
} from 'react-native';
import {connect} from 'react-redux';

import {BaseUrl, base64Auth} from '../../utils/constants';
import {setCartItem} from '../../store/actions';
import axios from 'axios';

import {
  CustomHeaderPrim,
  logoSmall,
  TabNavButton,
  filterIcon,
  ItemList,
  Loader,
} from '../../SharedComponents';

import {CommonStyles} from '../../SharedComponents';

import {CategoryList, CustomSelectList, FilterItem} from './components';

class ShoppingListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFilter: false,
      productList: [],
      categoriesList: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.getCategoryList();
    this.getProductList();
  }

  getCategoryProductlList = (data) => {
    // console.log('data in shope list', data);
    this.setState({isLoading: true}, () => {
      axios
        .get(
          BaseUrl +
            '/admin/api/2020-07/collections/' +
            data.id +
            '/products.json',
          {
            headers: {
              Authorization: base64Auth,
            },
          },
        )
        .then((res) => {
          //   console.log('Res get Custom Product from  Categories ', res.data);
          if (res.data.products && res.data.products.length) {
            this.setState({productList: res.data.products, isLoading: false});
          }
        })
        .catch((err) => {
          this.setState({isLoading: false});
          console.log('Err in get Product list in Dashboard', err);
        });
    });
  };

  getCategoryList = () => {
    this.setState({isLoading: true}, () => {
      axios
        .get(BaseUrl + '/admin/api/2020-07/custom_collections.json', {
          headers: {
            Authorization: base64Auth,
          },
        })
        .then((res) => {
          //   console.log('Res get Custom Product Categories ', res.data);
          if (
            res.data.custom_collections &&
            res.data.custom_collections.length
          ) {
            this.setState({
              categoriesList: res.data.custom_collections,
              isLoading: false,
            });
          }
        })
        .catch((err) => {
          this.setState({isLoading: false});
          console.warn(err);
        });
    });
  };

  getProductList = (id) => {
    this.setState({isLoading: true}, () => {
      if (id) {
        axios
          .get(BaseUrl + '/admin/api/2020-07/products/' + id + '.json', {
            headers: {
              Authorization: base64Auth,
            },
          })
          .then((res) => {
            // if (res.data.product && res.data.products.length) {
            this.setState(
              {productList: [res.data.product], isLoading: false},
              () => {
                // console.log(
                //   'Res get Product list in Dashboard with Id ',
                //   this.state.product,
                // );
              },
            );
          })
          .catch((err) => {
            this.setState({isLoading: false});
            console.log('Err in get Product list in Dashboard', err);
          });
      } else {
        axios
          .get(BaseUrl + '/admin/api/2020-07/products.json', {
            headers: {
              Authorization: base64Auth,
            },
          })
          .then((res) => {
            if (res.data.products && res.data.products.length) {
              this.setState(
                {productList: res.data.products, isLoading: false},
                //   () => {
                //     console.log(
                //       'Res get Product list in Dashboard ',
                //       this.state.productList,
                //     );
                //   },
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

  handleFilter = () => {
    this.setState({isFilter: !this.state.isFilter});
  };

  handleCategory = (data) => {
    console.log('handleCategory ', data);
  };

  filterData = (data) => {
    if (data) {
      this.getProductList(data.id);
    }
  };

  render() {
    const {TTComDB28, tabNavContainer} = CommonStyles;

    const {isFilter, categoriesList, productList, isLoading} = this.state;

    const {cartList} = this.props;

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
        <View style={{flex: 9, paddingHorizontal: 20}}>
          {isLoading ? (
            <Loader />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{flex: 1, marginTop: 100}}>
                <Text style={TTComDB28}>Shop by Category.</Text>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={
                    categoriesList && categoriesList.length > 0
                      ? categoriesList
                      : []
                  }
                  renderItem={(item, index) => {
                    console.log('1122', item.item);
                    return (
                      <CategoryList
                        label={
                          item.item.title && item.item.title.length > 15
                            ? item.item.title.slice(0, 15) + '...'
                            : item.item.title
                        }
                        image={
                          item.item &&
                          item.item.image !== null &&
                          item.item.image !== undefined &&
                          item.item.image.src !== null &&
                          item.item.image.src !== ''
                            ? {uri: item.item.image.src}
                            : require('../../../assests/Common/imagePlaceholder/placeholder.jpg')
                        }
                        selectCategory={() =>
                          this.getCategoryProductlList(item.item)
                        }
                      />
                    );
                  }}
                  style={{flexDirection: 'row'}}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={TTComDB28}>Products for you.</Text>
                <TouchableOpacity onPress={() => this.handleFilter()}>
                  <Image source={filterIcon} />
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <CustomSelectList label="All" isActive />
                <CustomSelectList label="Buy" />
                <CustomSelectList label="Rent" />
                <CustomSelectList label="Print" />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  marginBottom: 90,
                }}>
                {productList && productList.length
                  ? productList.map((item, index) => {
                      return (
                        <ItemList
                          key={index}
                          onAction={() =>
                            this.props.navigation.navigate(
                              'ItemDetailsScreen',
                              {productId: item.id},
                            )
                          }
                          image={
                            item.image &&
                            item.image.src !== '' &&
                            item.image.src !== null && {uri: item.image.src}
                          }
                          itemName={item.title}
                          price={
                            item.variants &&
                            item.variants[0] &&
                            item.variants[0].price
                          }
                        />
                      );
                    })
                  : null}
              </View>
            </ScrollView>
          )}
        </View>
        <SafeAreaView>
          <View style={[tabNavContainer, {width: '90%'}]}>
            <TabNavButton
              nav={this.props}
              active="2"
              cartNotification={cartList}
            />
          </View>
        </SafeAreaView>
        {isFilter && (
          <Modal animationType="slide" transparent={false} visible={isFilter}>
            <View style={{flex: 1}}>
              <CustomHeaderPrim
                placeholder="What are you looking for?"
                searchBox
                handleSearchBox={() => console.log('search box')}
                searchBoxClearButton
                searchBoxClear={() => console.log('search box clear')}
              />

              <View style={{flex: 9}}>
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
      </SafeAreaView>
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
