import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {useIsFocused} from '@react-navigation/native';
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
  boyGroupPose1Icon,
  boyGroupPose2Icon,
  boyGroupPose3Icon,
  girlGroupPose1Icon,
  girlGroupPose2Icon,
  girlGroupPose3Icon,
  groupPoseBgDashedIcon,
} from '../../SharedComponents/CommonIcons';
import {BaseUrlSchool} from '../../utils/constants';

class GroupPoseGuide extends React.Component {
  constructor() {
    super();
    this.state = {
      formData: '',
      photoTaken: {
        pose1: '',
        pose2: '',
        pose3: '',
      },
      removeItem: {
        status: false,
        item: '',
      },
      isLoading: false,
    };
  }
  componentDidMount() {
    const {formData} = this.props.route.params;
    console.log('Did Mount in GROUP Pose', this.props.route.params);
    console.log('Did Mount in GROUP Pose isFocused', this.props.isFocused);
    if (formData) {
      this.setState({formData});
    }
  }

  componentDidUpdate(prevProps) {
    const {imageItem, data, base64Data} = this.props.route.params;
    let photoTaken = {...this.state.photoTaken};
    if (this.props.isFocused !== prevProps.isFocused) {
      if (imageItem && data && base64Data) {
        if (imageItem === 'pose1') {
          photoTaken.pose1 = data;
          photoTaken.base64Data1 = base64Data;
        } else if (imageItem === 'pose2') {
          photoTaken.pose2 = data;
          photoTaken.base64Data2 = base64Data;
        } else if (imageItem === 'pose3') {
          photoTaken.pose3 = data;
          photoTaken.base64Data3 = base64Data;
        }

        this.setState({photoTaken}, () => {
          this.saveDataToLocal(imageItem, data, base64Data);
        });
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
        // console.log('SAVE DONE', this.getDataFromLocal('SchoolPoseSection'));
      } else {
        // console.log('getLocalData from Async Data INSIDE');
        let JsonData = await JSON.parse(getLocalData);
        let index = JsonData.findIndex((indexItem) => indexItem.item === item);
        if (index !== -1) {
          // console.log('getLocalData from Async Data ', JsonData[0].item);
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
      'pose1',
      (res) => {
        console.log('Callback', res);
        if (res) {
          pose1 = true;
          this.handleUpload(
            formData.schoolId,
            photoTaken.base64Data2,
            'pose2',
            (res) => {
              console.log('Callback', res);
              if (res) {
                pose2 = true;
                this.handleUpload(
                  formData.schoolId,
                  photoTaken.base64Data3,
                  'pose2',
                  (res) => {
                    console.log('Callback', res);
                    if (res) {
                      pose3 = true;
                      console.log('All APIS Are Done');
                      this.setState({isLoading: false}, async () => {
                        const data = {
                          data: formData,
                          screen: 'GroupPortraitPoseGuide',
                        };
                        await AsyncStorage.setItem(
                          'AlreadyTakePhoto',
                          JSON.stringify(data),
                        );
                      });

                      this.props.navigation.navigate('GroupPortraitPoseGuide', {
                        fromScreen: 'GroupPortraitPoseGuide',
                        formData: formData,
                      });
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
    console.warn('id', id);

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
    photoTaken.pose1 !== '' &&
      photoTaken.pose2 !== '' &&
      photoTaken.pose3 !== '' &&
      this.uploadTakenPhoto(() => {
        this.props.navigation.navigate('GroupPortraitPoseGuide', {
          fromScreen: 'GroupPortraitPoseGuide',
        });
      });
  };

  render() {
    const {formData, photoTaken, removeItem, isLoading} = this.state;
    const {TTComDB18} = CommonStyles;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <CustomHeaderPrim
          leftIcon={LeftArrowIcon}
          centerLabel="Group Poses Guide"
          leftIconAction={() => this.props.navigation.goBack()}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <ScrollView style={{paddingHorizontal: 20, paddingBottom: 40}}>
            <View style={{marginVertical: 15}}>
              <CustomTracker stage={1} label="schoolSection" />
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <SchoolPhotoInitialTexts
                width={140}
                label1="Please take your"
                label2="3 full size photos"
                label3="following the different"
                label4="poses shown here."
              />
              <View style={{marginHorizontal: 20}} />
              <SchoolPhotoInitial
                width={140}
                isPoseImg={photoTaken.pose1 !== '' ? false : true}
                img={
                  photoTaken.pose1 !== ''
                    ? {uri: photoTaken.pose1}
                    : formData.gender === 'male'
                    ? boyGroupPose1Icon
                    : girlGroupPose1Icon
                }
                actionLabel1="Click Here to "
                actionLabel2="Take Photo"
                actionLabel={photoTaken.pose1 !== '' ? 'Remove' : ''}
                onAction={() =>
                  this.props.navigation.navigate('CameraSectionScreen', {
                    fromScreen: 'GroupPoseGuide',
                    item: 'pose1',
                    showDemoTip:
                      photoTaken.pose1 === '' &&
                      photoTaken.pose2 === '' &&
                      photoTaken.pose3 === ''
                        ? true
                        : false,
                  })
                }
                onActionRemove={() => this.handleRemoveTakenPhoto('pose1')}
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
                isPoseImg={photoTaken.pose2 !== '' ? false : true}
                img={
                  photoTaken.pose2 !== ''
                    ? {uri: photoTaken.pose2}
                    : formData.gender === 'male'
                    ? boyGroupPose2Icon
                    : girlGroupPose2Icon
                }
                actionLabel1="Click Here to "
                actionLabel2="Take Photo"
                actionLabel={photoTaken.pose2 !== '' ? 'Remove' : ''}
                onAction={() =>
                  this.props.navigation.navigate('CameraSectionScreen', {
                    fromScreen: 'GroupPoseGuide',
                    item: 'pose2',
                    showDemoTip:
                      photoTaken.pose1 === '' &&
                      photoTaken.pose2 === '' &&
                      photoTaken.pose3 === ''
                        ? true
                        : false,
                  })
                }
                onActionRemove={() => this.handleRemoveTakenPhoto('pose2')}
              />
              <View style={{marginHorizontal: 20}} />
              <SchoolPhotoInitial
                width={140}
                isPoseImg={photoTaken.pose3 !== '' ? false : true}
                img={
                  photoTaken.pose3 !== ''
                    ? {uri: photoTaken.pose3}
                    : formData.gender === 'male'
                    ? boyGroupPose3Icon
                    : girlGroupPose3Icon
                }
                actionLabel1="Click Here to "
                actionLabel2="Take Photo"
                actionLabel={photoTaken.pose3 !== '' ? 'Remove' : ''}
                onAction={() =>
                  this.props.navigation.navigate('CameraSectionScreen', {
                    fromScreen: 'GroupPoseGuide',
                    item: 'pose3',
                    showDemoTip:
                      photoTaken.pose1 === '' &&
                      photoTaken.pose2 === '' &&
                      photoTaken.pose3 === ''
                        ? true
                        : false,
                  })
                }
                onActionRemove={() => this.handleRemoveTakenPhoto('pose3')}
              />
            </View>

            <View style={{marginVertical: 30}}>
              <CustomButton
                buttonStyles={
                  photoTaken.pose1 !== '' &&
                  photoTaken.pose2 !== '' &&
                  photoTaken.pose3 !== ''
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
                  onAction={() => this.handleRemovePhoto(removeItem.item, true)}
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
      </View>
    );
  }
}

export default (function (props) {
  const isFocused = useIsFocused();

  return <GroupPoseGuide {...props} isFocused={isFocused} />;
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

              // borderRadius: 5,
              // shadowColor: '#000',
              // shadowOffset: {
              //   width: 0,
              //   height: 12,
              // },
              // shadowOpacity: 0.58,
              // shadowRadius: 16.0,
              // elevation: 25,
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
