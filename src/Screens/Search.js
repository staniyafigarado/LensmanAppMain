import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    Platform,
    SafeAreaView,
    Dimensions, ImageBackground, Image, TextInput, ScrollView
} from 'react-native';
import { headerImage, closeIcon, rightArrowIcon, logoSmall } from '../SharedComponents/CommonIcons';
import { CommonStyles } from '../SharedComponents/CustomStyles';
const { height, width } = Dimensions.get('screen');

class SearchScreen extends Component {
    StatusBar = () => {
        if (Platform.OS === 'android')
            return (
                <StatusBar
                    backgroundColor="#2B32C4"
                    translucent={true}
                    barStyle="dark-content"
                />
            );
        else if (Platform.OS === 'ios') {
            return (
                <View
                    style={{
                        height: height < 690 ? '3%' : '5%',
                        backgroundColor: '#2B32C4',
                    }}
                />
            );
        } else return null;
    }

    render() {
        const { TTComDB28, TTComDB16 } = CommonStyles;
        return (
            <View>
                {
                    this.StatusBar()
                }
                <View>
                    <ImageBackground
                        source={headerImage}
                        style={{
                            height: 160,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                            // zIndex: 2,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Image source={logoSmall} />
                            <TextInput
                                // value={serachText}
                                // onChangeText={(text) => this.fetchSearchData(text)}
                                placeholder={"What are you looking for?"}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 50,
                                    borderColor: '#FFFFFF',
                                    borderWidth: 1,
                                    width: logoSmall ? '85%' : '100%',
                                    paddingHorizontal: 20,
                                    fontSize: 18,
                                    paddingVertical: 3,
                                    color: '#000',

                                    fontFamily: 'TTCommons-Medium',
                                    height: 40,
                                }}
                                placeholderTextColor={'#656565'}
                            />
                        </View>
                    </ImageBackground>
                    <ScrollView>
                        <View style={{ marginTop: 30, paddingBottom: 100, paddingHorizontal: 15 }}>
                            <Text style={[CommonStyles.TTComDB28, { color: 'black' }]}>
                                Products for you
                  </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
};

export default SearchScreen;