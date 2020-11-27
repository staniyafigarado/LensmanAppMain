import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import axios from 'axios';

import {CustomHeaderPrim, CustomButton, Loader} from '../../SharedComponents';
import {BaseUrlSchool} from '../../utils/constants';

import {
  LeftArrowIcon,
  newSignatureIcon,
  boyPose1Icon,
  boyPose2Icon,
  boyPose3Icon,
  boyPortraitePose1Icon,
  boyPortraitePose2Icon,
  boyPortraitePose3Icon,
  girlPose1Icon,
  girlPose2Icon,
  girlPose3Icon,
  girlPortraitePose1Icon,
  girlPortraitePose2Icon,
  girlPortraitePose3Icon,
} from '../../SharedComponents/CommonIcons';
import {CommonStyles} from '../../SharedComponents/CustomStyles';

class SchoolPhotoInitialScreen extends Component {
  state = {
    formData: '',
    takenImage: '',
    fromScreen: '',
    isLoading: false,
  };

  componentDidMount() {
    console.log(
      'formData from submit form in GUIDE PAGE 001',
      this.props.route.params.base64Data,
    );

    if (this.props.route.params && this.props.route.params.formData) {
      this.setState({formData: this.props.route.params.formData});
    }

    if (
      this.props.route.params &&
      this.props.route.params.data &&
      this.props.route.params.data !== ''
    ) {
      this.setState({takenImage: this.props.route.params.data});
    }

    if (this.props.route.params && this.props.route.params.fromScreen) {
      this.setState({fromScreen: this.props.route.params.fromScreen});
    }
  }

  uploadTakenPhoto = (id, image) => {
    const {fromScreen, base64Data} = this.props.route.params;
    const {formData} = this.state;
    let payload = {
      photo: '',
    };
    console.log('20000002', id);
    this.setState({isLoading: true}, () => {
      if (image && image !== '') {
        let data = 'data:image/jpg;base64,' + image;
        payload.photo = data;
        console.log('Base 64', payload.photo);

        axios
          .post(BaseUrlSchool + '/api/student/' + id + '/photo', payload)
          .then((res) => {
            console.log('res image upload ', res.data);
            this.setState({isLoading: false}, () => {
              this.props.navigation.navigate(
                fromScreen === 'SchoolGuideScreen'
                  ? 'SchoolAfterTakePhotScreen1'
                  : fromScreen === 'SchoolAfterTakePhotScreen1'
                  ? 'SchoolAfterTakePhotScreen2'
                  : fromScreen === 'SchoolAfterTakePhotScreen2'
                  ? 'SchoolAfterTakePhotScreen3'
                  : fromScreen === 'SchoolAfterTakePhotScreen3'
                  ? 'SchoolAfterTakePhotScreen4'
                  : fromScreen === 'SchoolAfterTakePhotScreen4'
                  ? 'SchoolAfterTakePhotScreen5'
                  : fromScreen === 'SchoolAfterTakePhotScreen5'
                  ? 'DashboardScreen'
                  : 'DashboardScreen',
                fromScreen === 'SchoolAfterTakePhotScreen5'
                  ? {
                      fromScreen: 'SchoolAfterTakePhotScreen5',
                      SchoolImage: this.state.takenImage,
                      formData: formData,
                    }
                  : {
                      data: this.state.takenImage,
                      formData: formData,
                    },
              );
            });
          })
          .catch((err) => {
            this.setState({isLoading: false});
            console.log('Err in upload photos', err.response);
          });
      } else {
        console.log('No Images');
      }
    });
  };

  handleUploadImages = () => {
    const {fromScreen, base64Data} = this.props.route.params;
    const {formData} = this.state;
    this.uploadTakenPhoto(formData.schoolId, base64Data, fromScreen);
    // this.props.navigation.navigate(
    //   fromScreen === 'SchoolGuideScreen'
    //     ? 'SchoolAfterTakePhotScreen1'
    //     : fromScreen === 'SchoolAfterTakePhotScreen1'
    //     ? 'SchoolAfterTakePhotScreen2'
    //     : fromScreen === 'SchoolAfterTakePhotScreen2'
    //     ? 'SchoolAfterTakePhotScreen3'
    //     : fromScreen === 'SchoolAfterTakePhotScreen3'
    //     ? 'SchoolAfterTakePhotScreen4'
    //     : fromScreen === 'SchoolAfterTakePhotScreen4'
    //     ? 'SchoolAfterTakePhotScreen5'
    //     : fromScreen === 'SchoolAfterTakePhotScreen5'
    //     ? 'DashboardScreen'
    //     : 'DashboardScreen',
    //   fromScreen === 'SchoolAfterTakePhotScreen5'
    //     ? {
    //         fromScreen: 'SchoolAfterTakePhotScreen5',
    //         SchoolImage: this.state.takenImage,
    //         formData: formData,
    //       }
    //     : {
    //         data: this.state.takenImage,
    //         formData: formData,
    //       },
    // );
  };

  render() {
    const {TTComDB28, TTComM16, TTComDB18, TTComDB20, TTComDB16} = CommonStyles;
    const {formData, takenImage, fromScreen, isLoading} = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={{flex: 1, zIndex: 4, backgroundColor: 'transparent'}}>
          <CustomHeaderPrim
            leftIcon={LeftArrowIcon}
            centerLabel="Add photo"
            leftIconAction={() => this.props.navigation.goBack()}
          />
        </View>

        <View style={{flex: 9}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginTop: 100}} />

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={[TTComDB16, {textAlign: 'center', marginBottom: 30}]}>
                {fromScreen === 'SchoolGuideScreen'
                  ? 'Group Photo Pose 1 of 3'
                  : fromScreen === 'SchoolAfterTakePhotScreen1'
                  ? 'Group Photo Pose 2 of 3'
                  : fromScreen === 'SchoolAfterTakePhotScreen2'
                  ? 'Group Photo Pose 3 of 3'
                  : fromScreen === 'SchoolAfterTakePhotScreen3'
                  ? 'Portrait Pose 1 of 3'
                  : fromScreen === 'SchoolAfterTakePhotScreen4'
                  ? 'Portrait Pose 2 of 3'
                  : fromScreen === 'SchoolAfterTakePhotScreen5'
                  ? 'Portrait Pose 3 of 3'
                  : 'No data'}
              </Text>
              <View
                style={{
                  width: '85%',
                  height: 360,
                  borderRadius: 27,
                  borderWidth: 1.5,
                  borderColor: '#C6C6C6',
                }}>
                {takenImage && takenImage !== '' ? (
                  <Image
                    source={{uri: takenImage}}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                      borderRadius: 26,
                    }}
                  />
                ) : null}
              </View>
            </View>

            <View style={{flex: 1, paddingHorizontal: 20, paddingBottom: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 100,
                  marginTop: 10,
                }}>
                <CustomButton
                  buttonStyles="btn-secondary-black"
                  textStyles="txt-secondary"
                  text="Take Again"
                  onAction={() => this.props.navigation.goBack()}
                  width="45%"
                />

                <View style={{marginLeft: 5}} />

                {isLoading ? (
                  <Loader />
                ) : (
                  <CustomButton
                    buttonStyles="btn-primary"
                    textStyles="txt-primary"
                    text="Upload"
                    onAction={() => this.handleUploadImages()}
                    width="45%"
                  />
                )}
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[TTComM16, {marginRight: 5}]}>Powered by</Text>
                  <Image source={newSignatureIcon} style={{}} />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default SchoolPhotoInitialScreen;
