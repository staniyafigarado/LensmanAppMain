import React from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {headerImage, closeIcon, rightArrowIcon} from '../CommonIcons';

import {CommonStyles} from '../CustomStyles';

class CustomHeaderPrimary extends React.Component {
  state = {
    serachData: [],
    isSearchView: false,
    serachText: '',
  };
  visibleSearch = (text) => {
    let data = this.props.data;
    if (data) {
      let titlesAndIds = data
        .filter((text1) => {
          if (text1.title.includes(text)) {
            return text1;
          }
        })
        .map((item) => {
          return {title: item.title, id: item.id};
        });

      console.log('text', titlesAndIds);
      this.setState({
        serachText: text,
        serachData: titlesAndIds,
        isSearchView: text && text.length ? true : false,
      });
      console.log('Search Titles and Ids', titlesAndIds);
    }
  };

  handleFilterData = (data) => {
    this.setState({isSearchView: false, serachText: ''}, () => {
      this.props.filterData && this.props.filterData(data);
    });
  };

  render() {
    const {
      leftIcon,
      leftIconAction,
      searchBox,
      placeholder,
      searchBoxClearButton,
      centerLabel,
    } = this.props;

    const {serachData, isSearchView, serachText} = this.state;

    const {TTComDB28, TTComDB18} = CommonStyles;

    return (
      <View style={{}}>
        <ImageBackground
          source={headerImage}
          style={{
            height: 140,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            zIndex: 2,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {leftIcon && !centerLabel && (
              <TouchableOpacity
                onPress={() => leftIconAction && leftIconAction()}>
                <Image source={leftIcon} />
              </TouchableOpacity>
            )}
            {searchBox && (
              <TextInput
                value={serachText}
                onChangeText={(text) => this.visibleSearch(text)}
                placeholder={placeholder}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 50,
                  borderColor: '#FFFFFF',
                  borderWidth: 1,
                  width: leftIcon ? '85%' : '100%',
                  paddingHorizontal: 20,
                  fontSize: 18,
                  paddingVertical: 3,
                  color: '#000',
                  zIndex: 3,
                  fontFamily: 'TTCommons-Medium',
                }}
                placeholderTextColor={'#656565'}
              />
            )}
            {searchBoxClearButton && (
              <Image
                source={closeIcon}
                style={{tintColor: '#000', position: 'absolute', right: 10}}
              />
            )}

            {centerLabel && leftIcon && (
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    padding: 10,
                  }}
                  onPress={() => leftIconAction && leftIconAction()}>
                  <Image source={leftIcon} />
                </TouchableOpacity>
                <Text style={[TTComDB28, {color: '#fff'}]}>{centerLabel}</Text>
              </View>
            )}
          </View>
        </ImageBackground>
        {isSearchView ? (
          <View
            style={{
              zIndex: 100,
              backgroundColor: '#fff',
              width: '100%',
              height: Dimensions.get('screen').height * 0.9,
              paddingHorizontal: 40,
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{maxHeight: 350, paddingBottom: 25}}>
              {serachData.map((data, index) => {
                return (
                  <View style={{marginVertical: 20}} key={index}>
                    <TouchableOpacity
                      onPress={() => this.handleFilterData(data)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={TTComDB18}>{data.title}</Text>
                      <Image source={rightArrowIcon} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </View>
    );
  }
}

export default CustomHeaderPrimary;
