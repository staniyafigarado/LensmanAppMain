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
} from "react-native";

import axios from "axios";
import { 
    CustomHeaderPrim, 
    CustomButton,
    Loader,
    CustomTracker
} from "../../SharedComponents";

import { 
    LeftArrowIcon,
    yellowBoxIcon,
    circleWithQuestMarkIcon
} from "../../SharedComponents/CommonIcons";

import {
    CommonStyles
} from "../../SharedComponents/CustomStyles";

class CheckoutHistoryScreen extends Component {    
    constructor (props) {
        super(props)
        this.state = {
            isLoading       : false,           
        }
    }

    async componentDidMount () {    
    }

    showToaster = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
        );
    };

    

    render() {        

        const {
            TTComM18,
            TTComDB14,
            TTComDB28,
            TTComM14,
            TTComDB18,            
        } = CommonStyles;

        const { 
            isLoading,
            options,
            showStates
        } = this.state;

        return (
            <SafeAreaView style={{flex : 1, backgroundColor : '#fff',}}>
                
                <StatusBar backgroundColor = "#fff" barStyle = "dark-content" />

                <View style={{flex : 1, zIndex : 4, backgroundColor : 'transparent'}}>
                    <CustomHeaderPrim
                        leftIcon        = {LeftArrowIcon}
                        leftIconAction  = {()=>this.props.navigation.goBack()}
                        centerLabel     = "Confirmation"
                    />
                </View>
                
                {
                    isLoading ?                        
                        <Loader />                        
                        :
                            <View style={{flex : 9, paddingHorizontal : 20,}}>
                            <ScrollView showsVerticalScrollIndicator = {false} >
                                <View style={{marginTop : 100, }} />

                                <CustomTracker stage = {3} />

                                <View style={{height : 100, backgroundColor : '#FFC000', borderRadius : 12, justifyContent : 'flex-end', marginTop : 30}}>
                                    <Image source={yellowBoxIcon} style={{position : 'absolute', top : -20, left : 20}} />
                                    <Text style={[TTComDB28,{color : '#fff', padding : 20}]}>Arriving 2 Sep - 4 Sep</Text>
                                </View>

                                <View style={{borderWidth : 1.5, borderRadius : 12, borderColor : '#E9E9E9', padding : 20,marginVertical : 30, marginBottom : 50}}>
                                    <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                                        <View>
                                            <Text style={[TTComM14,{marginVertical : 5}]}>Order Ref.</Text>
                                            <Text style={[TTComDB18,{marginVertical : 5}]}>#230AE3700</Text>
                                        </View>

                                        <View>
                                            <Image source={circleWithQuestMarkIcon}/>
                                        </View>
                                    </View>

                                    <View style={{marginTop : 30}}>

                                        <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 15}}>
                                            <View>
                                                <Image source={require('../../../assests/Test/photo_mug_large-51.png')} style={{width : 60, height : 60}}/>
                                            </View>

                                            <View style={{flexDirection : 'row', alignItems : 'center', marginLeft : 25}}>
                                                <Text style={[TTComDB14,{marginRight : 10}]}>1x</Text>
                                                <Text style={TTComM18}>Coffee Mug</Text>
                                            </View>
                                        </View>

                                        <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 15}}>
                                            <View>
                                                <Image source={require('../../../assests/Test/photo_mug_large-51.png')} style={{width : 60, height : 60}}/>
                                            </View>

                                            <View style={{flexDirection : 'row', alignItems : 'center', marginLeft : 25}}>
                                                <Text style={[TTComDB14,{marginRight : 10}]}>1x</Text>
                                                <Text style={TTComM18}>Coffee Mug</Text>
                                            </View>
                                        </View>

                                        <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 15}}>
                                            <View>
                                                <Image source={require('../../../assests/Test/photo_mug_large-51.png')} style={{width : 60, height : 60}}/>
                                            </View>

                                            <View style={{flexDirection : 'row', alignItems : 'center', marginLeft : 25}}>
                                                <Text style={[TTComDB14,{marginRight : 10}]}>2x</Text>
                                                <Text style={TTComM18}>Coffee Mug</Text>
                                            </View>
                                        </View>

                                    </View>

                                </View>

                                <View style={{marginBottom : 30}}>
                                    <CustomButton
                                        buttonStyles    = "btn-primary"
                                        textStyles      = "txt-primary"
                                        text            = "Done"
                                        width           = "100%"    
                                        onAction        = {()=>this.props.navigation.navigate('ShoppingListScreen')}
                                        />
                                </View>

                            </ScrollView>

                    </View> 

                }
                      
            </SafeAreaView>            
        )
    }
}

export default CheckoutHistoryScreen;