import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Platform,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  CustomTracker,
  CustomHeaderPrim,
  CustomButton,
  Loader,
} from '../../SharedComponents';
import {CommonStyles} from '../../SharedComponents/CustomStyles';
import {
  LeftArrowIcon,
  newSignatureIcon,
  boyGroupPortraitPose1Icon,
  boyGroupPortraitPose2Icon,
  boyGroupPortraitPose3Icon,
  girlGroupPortraitPose1Icon,
  girlGroupPortraitPose2Icon,
  girlGroupPortraitPose3Icon,
} from '../../SharedComponents/CommonIcons';
import {BaseUrlSchool} from '../../utils/constants';
import CustomStatusBar from '../../SharedComponents/CustomStatusBar/CustomStatusBar';

class GroupPortraitPoseGuide extends React.Component {
  constructor() {
    super();
    this.state = {
      formData: '', //{"class": "1", "division": "Q", "email": "Qq1@gmail.com", "gender": "male", "name": "Test1", "phone": "11111", "school": "GEMS NEW MILLENNIUM SCHOOL", "schoolId": 20}
      photoTaken: {
        pose1Portrait: '',
        pose2Portrait: '',
        pose3Portrait: '',
      },
      removeItem: {
        status: false,
        item: '',
      },
      isLoading: false,
    };
  }
  componentDidMount() {
    this.BackHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate('DashboardScreen');
      return true;
    });
    const {formData} = this.props.route.params;
    if (formData) {
      this.setState({formData});
    }
  }
  componentWillUnmount() {
    this.BackHandler.remove();
  }
  componentDidUpdate(prevProps) {
    let photoTaken = {...this.state.photoTaken};
    if (this.props.route.params) {
      if (this.props.isFocused !== prevProps.isFocused) {
        const {imageItem, data, base64Data} = this.props.route.params;

        if (imageItem && data && base64Data) {
          if (imageItem === 'pose1Portrait') {
            photoTaken.pose1Portrait = data;
            photoTaken.base64Data1 = base64Data;
          } else if (imageItem === 'pose2Portrait') {
            photoTaken.pose2Portrait = data;
            photoTaken.base64Data2 = base64Data;
          } else if (imageItem === 'pose3Portrait') {
            photoTaken.pose3Portrait = data;
            photoTaken.base64Data3 = base64Data;
          }

          this.setState({photoTaken}, () => {
            console.log('photoTaken in Did Update', this.state.photoTaken);
            this.saveDataToLocal(imageItem, data, base64Data);
          });
        }
      }
    }
  }

  saveDataToLocal = async (item, data, base64Data) => {
    try {
      let getLocalData = await this.getDataFromLocal('SchoolPoseSection');

      if (getLocalData === null) {
        let localdata = [];
        localdata.push({
          item,
          data,
          base64Data,
        });
        await AsyncStorage.setItem(
          'SchoolPoseSection',
          JSON.stringify(localdata),
        );
      } else {
        let JsonData = await JSON.parse(getLocalData);
        let index = JsonData.findIndex((indexItem) => indexItem.item === item);
        if (index !== -1) {
          JsonData[index].data = data;
          JsonData[index].base64Data = base64Data;
        }
      }
    } catch (err) {
      console.log('Errrrr', err);
    }
  };

  getDataFromLocal = async (item) => {
    let data = await AsyncStorage.getItem(item);
    // console.log('0001', data);
    return data;
  };

  handleRemoveTakenPhoto = (item) => {
    let removeItem = {...this.state.removeItem};

    removeItem.status = true;
    removeItem.item = item;

    this.setState({removeItem});
  };

  handleRemovePhoto = (item, status) => {
    let photoTaken = {...this.state.photoTaken};
    let removeItem = {...this.state.removeItem};
    if (status) {
      photoTaken[item] = '';
      removeItem.item = '';
      removeItem.status = false;
    } else {
      removeItem.status = false;
    }

    this.setState({removeItem, photoTaken});
  };

  uploadTakenPhoto = (callback) => {
    const {formData, photoTaken} = this.state;

    let pose1 = false;
    let pose2 = false;
    let pose3 = false;

    this.handleUpload(
      formData.schoolId,
      photoTaken.base64Data1,
      'pose1portrait',
      (res) => {
        console.log('Callback', res);
        if (res) {
          pose1 = true;
          this.handleUpload(
            formData.schoolId,
            photoTaken.base64Data2,
            'pose2portrait',
            (res) => {
              console.log('Callback', res);
              if (res) {
                pose2 = true;
                this.handleUpload(
                  formData.schoolId,
                  photoTaken.base64Data3,
                  'pose2portrait',
                  (res) => {
                    console.log('Callback', res);
                    if (res) {
                      pose3 = true;
                      console.log('All APIS Are Done');

                      this.props.navigation.navigate(
                        'SchoolPhotoSectionConfirmScreen',
                        {image: photoTaken.pose3Portrait},
                      );
                    }
                  },
                );
              }
            },
          );
        }
      },
    );
  };

  handleUpload = (id, imageData, type, callback) => {
    let payload = {
      photo: '',
    };
    this.setState({isLoading: true}, () => {
      let data = 'data:image/jpg;base64,' + imageData;
      payload.photo = data;

      axios
        .post(BaseUrlSchool + '/api/student/' + id + '/photo', payload)
        .then((res) => {
          console.log('res image upload ', res.data, type);
          this.setState({isLoading: false}, () => {
            if (callback) callback(true);
          });
        })
        .catch((err) => {
          this.setState({isLoading: false});
          if (callback) callback(false);
          console.log('Err in upload photos', err.response);
        });
    });
  };

  handleSubmit = () => {
    const {photoTaken} = this.state;
    photoTaken.pose1Portrait !== '' &&
      photoTaken.pose2Portrait !== '' &&
      photoTaken.pose3Portrait !== '' &&
      this.uploadTakenPhoto(() => {
        this.props.navigation.navigate('SchoolPhotoSectionConfirmScreen', {
          image: photoTaken.pose3Portrait,
        });
      });
  };

  render() {
    const {formData, photoTaken, removeItem, isLoading} = this.state;
    const {TTComDB18} = CommonStyles;
    return (
      <>
        <CustomStatusBar />
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{zIndex: 4, width: '100%'}}>
            <CustomHeaderPrim
              leftIcon={LeftArrowIcon}
              centerLabel="Portrait Poses Guide"
              leftIconAction={() =>
                this.props.navigation.navigate('DashboardScreen')
              }
            />
          </View>
          {isLoading ? (
            <Loader />
          ) : (
            <ScrollView
              style={{
                paddingHorizontal: 20,
                paddingBottom: 40,
                paddingTop: 30,
              }}
              contentContainerStyle={{paddingBottom: 40}}>
              <View style={{marginVertical: 15}}>
                <CustomTracker stage={2} label="schoolSection" />
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <SchoolPhotoInitialTexts
                  width={140}
                  label1="Please take your"
                  label2="3 portrait photos"
                  label3="following the different"
                  label4="poses shown here."
                />
                <View style={{marginHorizontal: 20}} />

                <SchoolPhotoInitial
                  width={140}
                  isPoseImg={photoTaken.pose1Portrait !== '' ? false : true}
                  img={
                    photoTaken.pose1Portrait !== ''
                      ? {uri: photoTaken.pose1Portrait}
                      : formData.gender === 'male'
                      ? boyGroupPortraitPose1Icon
                      : girlGroupPortraitPose1Icon
                  }
                  actionLabel1="Click Here to "
                  actionLabel2="Take Photo"
                  actionLabel={photoTaken.pose1Portrait !== '' ? 'Remove' : ''}
                  onAction={() =>
                    this.props.navigation.navigate('CameraSectionScreen', {
                      fromScreen: 'GroupPortraitPoseGuide',
                      item: 'pose1Portrait',
                      showDemoTip: false,
                    })
                  }
                  onActionRemove={() =>
                    this.handleRemoveTakenPhoto('pose1Portrait')
                  }
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 50,
                }}>
                <SchoolPhotoInitial
                  width={140}
                  isPoseImg={photoTaken.pose2Portrait !== '' ? false : true}
                  img={
                    photoTaken.pose2Portrait !== ''
                      ? {uri: photoTaken.pose2Portrait}
                      : formData.gender === 'male'
                      ? boyGroupPortraitPose2Icon
                      : girlGroupPortraitPose2Icon
                  }
                  actionLabel1="Click Here to "
                  actionLabel2="Take Photo"
                  actionLabel={photoTaken.pose2Portrait !== '' ? 'Remove' : ''}
                  onAction={() =>
                    this.props.navigation.navigate('CameraSectionScreen', {
                      fromScreen: 'GroupPortraitPoseGuide',
                      item: 'pose2Portrait',
                      showDemoTip: false,
                    })
                  }
                  onActionRemove={() =>
                    this.handleRemoveTakenPhoto('pose2Portrait')
                  }
                />
                <View style={{marginHorizontal: 20}} />
                <SchoolPhotoInitial
                  width={140}
                  isPoseImg={photoTaken.pose3Portrait !== '' ? false : true}
                  img={
                    photoTaken.pose3Portrait !== ''
                      ? {uri: photoTaken.pose3Portrait}
                      : formData.gender === 'male'
                      ? boyGroupPortraitPose3Icon
                      : girlGroupPortraitPose3Icon
                  }
                  actionLabel1="Click Here to "
                  actionLabel2="Take Photo"
                  actionLabel={photoTaken.pose3Portrait !== '' ? 'Remove' : ''}
                  onAction={() =>
                    this.props.navigation.navigate('CameraSectionScreen', {
                      fromScreen: 'GroupPortraitPoseGuide',
                      item: 'pose3Portrait',
                      showDemoTip: false,
                    })
                  }
                  onActionRemove={() =>
                    this.handleRemoveTakenPhoto('pose3Portrait')
                  }
                />
              </View>
              <View style={{marginVertical: 30}}>
                <CustomButton
                  buttonStyles={
                    photoTaken.pose1Portrait !== '' &&
                    photoTaken.pose2Portrait !== '' &&
                    photoTaken.pose3Portrait !== ''
                      ? 'btn-primary'
                      : 'btn-primary-color'
                  }
                  textStyles="txt-primary"
                  text="Submit"
                  width="100%"
                  onAction={() => this.handleSubmit()}
                />
              </View>
            </ScrollView>
          )}
          {removeItem.status && (
            <Modal
              visible={removeItem.status}
              transparent={true}
              animationType="slide">
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#000000d9',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 260,
                    height: 200,
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={TTComDB18}>Remove Photo?</Text>
                  <View style={{marginVertical: 10}} />
                  <CustomButton
                    buttonStyles="btn-primary"
                    textStyles="txt-primary"
                    text="Yes"
                    width="50%"
                    onAction={() =>
                      this.handleRemovePhoto(removeItem.item, true)
                    }
                  />
                  <View style={{marginVertical: 10}} />
                  <CustomButton
                    buttonStyles="btn-primary"
                    textStyles="txt-primary"
                    text="No"
                    width="50%"
                    onAction={() =>
                      this.handleRemovePhoto(removeItem.item, false)
                    }
                  />
                </View>
              </View>
            </Modal>
          )}
        </SafeAreaView>
      </>
    );
  }
}

export default (function (props) {
  const isFocused = useIsFocused();

  return <GroupPortraitPoseGuide {...props} isFocused={isFocused} />;
});

const SchoolPhotoInitialTexts = (props) => {
  const {width, label1, label2, label3, label4} = props;
  const {TTComDB14} = CommonStyles;
  return (
    <View
      style={
        width
          ? {
              width: width,
              borderRadius: 27,
              borderStyle: 'dashed',
              borderWidth: 1,
              paddingVertical: 15,
              paddingHorizontal: 5,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
            }
          : {
              borderRadius: 27,
              borderStyle: 'dashed',
              borderWidth: 1,
              paddingVertical: 15,
              paddingHorizontal: 5,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200,
            }
      }>
      <View>
        <Text style={[TTComDB14, {textAlign: 'center'}]}>{label1}</Text>
        <Text style={[TTComDB14, {textAlign: 'center'}]}>{label2}</Text>
        <Text style={[TTComDB14, {textAlign: 'center'}]}>{label3}</Text>
        <Text style={[TTComDB14, {textAlign: 'center'}]}>{label4}</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 25,
        }}>
        <PoweredBy />
      </View>
    </View>
  );
};

const SchoolPhotoInitial = (props) => {
  const {
    width,
    img,
    actionLabel1,
    actionLabel2,
    onAction,
    isPoseImg,
    actionLabel,
    onActionRemove,
  } = props;
  const {TTComDB18} = CommonStyles;
  return (
    <View
      style={
        width
          ? {
              width: width,
              borderRadius: 27,
              borderWidth: 0.5,
              paddingVertical: 0,
              paddingHorizontal: 0,
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
              borderColor: '#70707026',
            }
          : {}
      }>
      <View style={{height: '80%'}}>
        <Image
          source={img}
          style={
            isPoseImg
              ? {}
              : {
                  width: width,
                  height: '100%',
                  resizeMode: 'cover',
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }
          }
        />
      </View>
      <TouchableOpacity
        onPress={() => (isPoseImg ? onAction() : onActionRemove())}
        style={{
          height: '20%',
          backgroundColor: actionLabel !== '' ? '#FFC000' : '#FF6C00',
          width: '100%',
          borderBottomLeftRadius: 27,
          borderBottomRightRadius: 27,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: Platform.OS === 'android' ? 0 : 5,
        }}>
        {actionLabel !== '' ? (
          <Text
            style={[TTComDB18, {color: '#fff', lineHeight: 20}]}
            allowFontScaling={false}>
            {actionLabel}
          </Text>
        ) : (
          <>
            <Text
              style={[TTComDB18, {color: '#fff', lineHeight: 20}]}
              allowFontScaling={false}>
              {actionLabel1}
            </Text>
            <Text
              style={[TTComDB18, {color: '#fff', lineHeight: 20}]}
              allowFontScaling={false}>
              {actionLabel2}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const PoweredBy = () => {
  const {TTComM16} = CommonStyles;
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={[TTComM16, {marginRight: 5}]}>Powered by</Text>
      <Image source={newSignatureIcon} />
    </View>
  );
};
