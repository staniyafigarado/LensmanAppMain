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
import {BaseUrlSchool, BaseUrl} from '../../utils/constants';
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
    this.getLoginDeatails();
  }

  getPhotosList = (id) => {
    console.warn(id);

    this.setState({isLoading: true}, async () => {
      await axios
        .get(`http://15.185.152.100/api/student/${id}/photos`)
        .then((res) => {
          const array = [];
          for (let index = 0; index < res.data.result.length; index++) {
            const element = res.data.result[index].photos.map((item) => {
              return BaseUrlSchool + item.path;
            });
            array.push(...element);
          }
          console.warn(
            'Res School List Photos',

            array,
          );
          this.setState({
            isLoading: false,
            photsList: array,
          });
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
      this.setState({id: datas.id}, () => this.getPhotosList(this.state.id));
    }
  };
  render() {
    const {isLoading, photsList, isCustomToaster, id} = this.state;
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
                {photsList && id && photsList.length ? (
                  photsList.map((images, index) => {
                    console.warn(images);

                    return (
                      <ImageCard
                        image={{
                          uri: images,
                        }}
                        key={index}
                      />
                    );
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
