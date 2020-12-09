import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, StatusBar } from 'react-native';

import { CustomHeaderPrim } from '../../SharedComponents';
import { logoSmall, LeftArrowIcon } from '../../SharedComponents/CommonIcons';

import { CommonStyles } from '../../SharedComponents/CustomStyles';
import {
  ordersIcon,
  pictresIcon,
  settingsIcon,
  contactUsIcon,
} from '../../SharedComponents/CommonIcons';
import CustomStatusBar from '../../SharedComponents/CustomStatusBar/CustomStatusBar';

class OrderHistory extends Component {
  state = {
    isLoading: false,
    orderHistoryyData: [],
  };

  render() {
    const { } = CommonStyles;

    const { isLoading, orderHistoryyData } = this.state;

    return (
      <>
        <CustomStatusBar />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          {/* <StatusBar backgroundColor="#fff" barStyle="dark-content" /> */}
          <View style={{ marginTop: 125, }} />
          <View style={{ flex: 2, zIndex: 4, backgroundColor: 'transparent' }}>

          </View>

          <View style={{ flex: 9, paddingHorizontal: 20 }}>
            {orderHistoryyData && orderHistoryyData.length ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View></View>
              </ScrollView>
            ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={CommonStyles.TTComDB14}>No Data Available</Text>
                </View>
              )}
          </View>
          <View style={{ flex: 1, position: 'absolute', backgroundColor: 'Transparent', width: '100%' }}>
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

export default OrderHistory;
