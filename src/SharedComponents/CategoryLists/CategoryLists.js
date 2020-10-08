import React from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity
} from "react-native";

import { 
    CommonStyles
 } from "../CustomStyles";

 const CategoryList = (props) => {
    const {image, label, price} = props;
    const {        
        TTComDB18,
        TTComM16,        
    } = CommonStyles;
    return(
        <TouchableOpacity style={{justifyContent : 'center', padding : 5, marginRight : 10 }}>
            <Image source = {image} style={{borderRadius : 27, width : 150,height : 150}}/>
            <Text style={[TTComDB18, {marginTop : 10, paddingLeft : 10}]}>{label}</Text>
            <Text style={[TTComM16, {paddingLeft : 10}]}>{price}</Text>
        </TouchableOpacity>
    )
}

export default CategoryList;