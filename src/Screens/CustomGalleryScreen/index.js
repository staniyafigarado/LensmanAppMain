import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import {LeftArrowIcon} from '../../SharedComponents/CommonIcons';
import {
  CustomHeaderPrim,
  Loader,
  CustomToaster,
  CommonStyles,
} from '../../SharedComponents';
import {BaseUrlSchool} from '../../utils/constants';
import AsyncStorage from '@react-native-community/async-storage';

class CustomGalleryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      photsList: [],
      isCustomToaster: '',
      id: '',
    };
  }

  componentDidMount() {
    this.getPhotosList();
  }

  getPhotosList = () => {
    this.setState({isLoading: true}, () => {
      axios
        .get(BaseUrlSchool + `/api/student/50/photos`)
        .then((res) => {
          console.log('Res School List Photos', res.data.result);
          res.data.result.forEach((data) => {
            data.path = BaseUrlSchool + data.path;
            console.log('Data 110', data);
          });
          this.setState({isLoading: false, photsList: res.data.result});
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            isCustomToaster: 'Something went wrong',
          });
          console.log('Errr in get School List Photos', err);
        });
    });
  };

  showToaster = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
  };
  getLoginDeatails = async () => {
    let data = await AsyncStorage.getItem('loginDetails');
    if (data !== null) {
      let datas = JSON.parse(data);
      this.setState({id: datas.id});
    }
  };
  render() {
    const {isLoading, photsList, isCustomToaster} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={{flex: 1, zIndex: 4, backgroundColor: 'transparent'}}>
          <CustomHeaderPrim
            leftIcon={LeftArrowIcon}
            leftIconAction={() => this.props.navigation.goBack()}
            centerLabel="Select"
          />
        </View>

        {isLoading ? (
          <Loader />
        ) : (
          <View style={{flex: 9, paddingHorizontal: 10}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{maxHeight: Dimensions.get('screen').height * 0.9}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: 70,
                  marginBottom: 10,
                }}>
                {photsList && photsList.length ? (
                  photsList.map((images, index) => {
                    return <ImageCard image={{uri: images.path}} key={index} />;
                  })
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: Dimensions.get('screen').height * 0.5,
                    }}>
                    <Text style={CommonStyles.TTComDB14}>
                      No Photos Avaliable
                    </Text>
                  </View>
                )}
                {/* <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} />
                                        <ImageCard image = {require('../../../assests/Test/martin-pechy-veoAiHnM3AI-unsplash.png')} /> */}
              </View>
            </ScrollView>
          </View>
        )}
        {isCustomToaster !== '' && (
          <CustomToaster
            position="flex-end"
            onend={() => this.setState({isCustomToaster: ''})}
            isCustomToaster={true}
            message={isCustomToaster}
          />
        )}
      </View>
    );
  }
}

export default CustomGalleryScreen;

const ImageCard = (props) => {
  const {image} = props;
  return (
    <TouchableOpacity style={{padding: 5}}>
      <Image
        defaultSource={require('../../../assests/Common/imagePlaceholder/placeholder.jpg')}
        source={image}
        style={{
          width: Dimensions.get('screen').width * 0.29,
          height: Dimensions.get('screen').width * 0.29,
        }}
      />
    </TouchableOpacity>
  );
};
