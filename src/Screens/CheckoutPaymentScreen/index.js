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
    radioButton,
    radioButtonFill,
    appleBlackIcon
} from "../../SharedComponents/CommonIcons";

import {
    CommonStyles
} from "../../SharedComponents/CustomStyles";

class CheckoutPaymentScreen extends Component {    
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
            TTComDB16,
            TTComL16,
            TTComDB28,
            TTComM14,
            TTComM18,            
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
                        centerLabel     = "Checkout"
                    />
                </View>
                
                {
                    isLoading ?                        
                        <Loader />                        
                        :
                            <View style={{flex : 9, paddingHorizontal : 20,}}>
                            <ScrollView showsVerticalScrollIndicator = {false} >
                                <View style={{marginTop : 100, }} />

                                <CustomTracker stage = {2} />

                                <View style={{ borderRadius : 12, borderColor : '#E9E9E9', padding : 20,  width : '100%', marginVertical : 20, backgroundColor : '#F2F2F2'}}>

                                    <View style={{flexDirection : 'row', }}>
                                        <View style={{width : '50%'}}>
                                            <Text style={[TTComM14,{marginVertical : 5}]} >Subtotal</Text>
                                            <Text style={[TTComM14,{marginVertical : 5}]}>Shipping</Text>
                                            <Text style={[TTComM14,{marginVertical : 5}]}>VAT 5%</Text>
                                        </View>

                                        <View style={{width : '50%', alignItems : 'flex-end'}}>
                                            <Text style={[TTComM18,{marginVertical : 3}]}>210.25 AED</Text>
                                            <Text style={[TTComM18,{marginVertical : 3}]}>15.00 AED</Text>
                                            <Text style={[TTComM18,{marginVertical : 3}]}>5.25 AED</Text>
                                        </View>
                                    </View>    
                                
                                    <View style={{width : '100%', height : 1, backgroundColor : '#000', marginVertical : 5}} />

                                    <View style={{flexDirection : 'row', }}>
                                        <View style={{width : '50%'}}>
                                            <Text style={[TTComM18,{marginVertical : 5}]} >Total</Text>
                                        </View>

                                        <View style={{width : '50%', alignItems : 'flex-end'}}>
                                            <Text style={[TTComDB28,{marginVertical : 3}]}>230.50 AED</Text>
                                        </View>
                                    </View>    
                                </View>

                                

                                <View style={{marginBottom : 30}}>
                                    <CustomButton
                                        buttonStyles    = "btn-primary"
                                        textStyles      = "txt-primary"
                                        text            = "Pay by Credit Card"
                                        width           = "100%"    
                                        onAction        = {()=>this.props.navigation.navigate('CheckoutHistoryScreen')}  />
                                    
                                    <View style={{marginVertical  : 10}} />

                                    <TouchableOpacity                                        
                                        style={{backgroundColor : '#000',
                                        borderRadius    : 26,                                                                                
                                        paddingVertical : 10,
                                        justifyContent  : 'center',
                                        alignItems      : 'center'}}>
                                        <Image source={appleBlackIcon} />
                                    </TouchableOpacity>

                                    <View style={{marginVertical  : 10}} />

                                    <CustomButton
                                        buttonStyles    = "btn-secondary-black"
                                        textStyles      = "txt-secondary"
                                        text            = "Cash on delivery"
                                        width           = "100%"
                                        onAction        = {()=>this.props.navigation.navigate('CheckoutHistoryScreen')}  />
                                    
                                </View>

                            </ScrollView>

                    </View> 

                }
                      
            </SafeAreaView>            
        )
    }
}

export default CheckoutPaymentScreen;


const CustomSelector = (props) => {
    const {text, days, price, option, toggleOption} = props;
    const { TTComM16, TTComDB16 } = CommonStyles;
    return(
        <TouchableOpacity 
            onPress = {()=>toggleOption&&toggleOption()}
            style={{flexDirection : 'row', marginVertical : 10, marginHorizontal : 20,}}>
            <Image source={option? radioButtonFill : radioButton } style={{marginRight : 15}}/>
            <Text style={TTComM16}>{text&&text}</Text>
            <Text style={[TTComDB16, {color : '#7E82E6', marginHorizontal : 5}]}>{days&&days}</Text>
            <Text style={[TTComDB16, {color : '#7E82E6'}]}>{price&&price}</Text>
        </TouchableOpacity>
    )
}

const CustomInputDropdown = (props) => {
    const { label,value, onAction,placeholder } = props;
    console.log("value",value)
    return (
        <View>
            {label&&<Text style={CommonStyles.customInputLabel}>{label&&label}</Text>}
            <TouchableOpacity 
                onPress = {()=>onAction()} 
                style = {{          
                }}>
                <Text 
                    style={{
                        color               : placeholder ? '#8C8C8C':'#000',
                        fontSize            : 16,
                        borderRadius        : 12,
                        backgroundColor     :'#fff',                    
                        fontFamily          : 'TTCommons-Medium',
                        borderWidth         : 1.5,
                        borderColor         : '#E9E9E9',
                        paddingLeft         : 20,
                        height              : 50,
                        textAlignVertical   : 'center'
                        
                    }}>{value === ''&&placeholder? placeholder : value === ''? 'Country' : value }</Text>
                    <Image 
                        source={require('../../../assests/RegisterScreen/dropdownDownIcon/Polygon2.png')}
                        style = {{position : 'absolute', top : '40%', right : 20}} />
            </TouchableOpacity>
        </View>
    )    
}