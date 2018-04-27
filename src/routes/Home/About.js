import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { isEmpty } from 'lodash';
import TabBarIcon from '../../components/TabBarIcon';
import Icon from '../../components/Icon';
import InputText from '../../components/InputText';
import DatePicker from '../../components/DatePicker'
import RadioBox from '../../components/RadioBox';
import { createAction, Toast, Storage } from '../../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_avator: {
    width: '100%',
    height: 100,
    padding: 10,
    backgroundColor: '#fff',
  },
  container_avator_box: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container_avator_box_left: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#f1f1f1',
    overflow: 'hidden',
  },
  container_avator_box_center: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
  },
  container_avator_box_center_font: {
    height: 30,
    lineHeight: 30,
    color: 'black',
  },
  container_avator_box_right: {
    padding: 10,
    lineHeight: 60,
  },
  container_box: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  conatiner_submit: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  conatiner_submit_box: {
    flex: 1,
    backgroundColor: '#3e9ce9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
});

const sexType = [
  {
    text: '男',
    label: 1,
  },
  {
    text: '女',
    label: 2,
  },
];

const mapStateToProps = (state) => ({
  avator: state.userInfo.avator,
  userInfo: state.userInfo.userInfo,
  submitResult: state.userInfo.submitResult,
});

const mapDispatchToProps = {
  updateAvator: createAction('userInfo/updateAvator'),
  getUserInfo: createAction('userInfo/getUserInfo'),
  submitUserInfo: createAction('userInfo/submitUserInfo'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class About extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    tabBarLabel: '关于',
    headerTitle: '填写信息',
    headerLeft: null,
    tabBarIcon: ({ focused, tintColor }) =>
      <TabBarIcon
        name="mine"
        activeName="mine_fill"
        size={22}
        tintColor={tintColor}
        focused={focused}
      />,
    tabBarVisible: true,
  })

  static propTypes = {
    avator: PropTypes.object.isRequired,
    updateAvator: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,
    getUserInfo: PropTypes.func.isRequired,
    submitResult: PropTypes.object.isRequired,
    submitUserInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      avator: {
        uri: null,
      },
      mobile: '',
      userInfo: {
        userName: '',
        sex: '',
        userMobile: '',
        userBirthday: '',
        userEducation: '',
        userHobbies: '',
        userWorkingYears: '',
        userAddress: '',
        companyName: '',
        jobName: '',
        department: '',
        workContent: '',
        technologyStack: '',
        graduatedSchool: '',
        profession: '',
        admissionTime: '',
        graduationTime: '',
      },
      y: '',
    };
    this.avatorUri = null;
  }

  componentDidMount() {
    Storage.getItem('USERMOBILE')
      .then((data) => {
        this.setState({ mobile: data });
        this.props.getUserInfo({ userMobile: data })
          .catch((err) => console.log(err));
      }).catch(err => console.log(err));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userInfo !== this.props.userInfo) {
      this.setState({
        userInfo: nextProps.userInfo,
        avator: {
          ...this.state.avator,
          uri: nextProps.userInfo.avatorURI || null,
        }
      });
    }
  }

  // 头像上传
  uploadAvator = (image) => {
    const data = new FormData();
    const file = {
      uri: image.uri,
      type: 'multipart/form-data',
      name: image.mime,
    };
    data.append("file", file);
    data.append('id', this.state.mobile);
    this.props.updateAvator(data)
      .then(() => {
        if (this.props.avator){
          Toast.showShort('头像修改成功');
          this.setState({ avator: { uri: this.props.avator.uri } });
        } else {
          Toast.showShort('头像修改失败');
        }
      }).catch((err) => {
        console.log(err);
      });
  }
  // 更新头像 并剪切
  updateAvator = () => {
    Alert.alert('更换头像', '请选择更换方式', [
      {
        text: '拍照',
        onPress: () => this.updateAvatorMethod('openCamera'),
      },
      {
        text: '从相册选择',
        onPress: () => this.updateAvatorMethod('openPicker'),
      },
    ])
  }
  // 更新头像方式
  updateAvatorMethod = (type) => {
    ImagePicker[type]({
      width: 300,
      height: 300,
      cropping: true,
      hideBottomControls: true,
    }).then((image) => {
      // 不能添加promise方法 会报错
      if (isEmpty(image)) return;
      this.avatorUri = image.path;
      this.setState({
        avator: {
          uri: image.path,
          width: image.width,
          height: image.height,
          mime: image.mime,
        }
      });
      this.uploadAvator(this.state.avator);
    }).catch(err => console.log(err));
  }

  updateStateValue = (name, value) => {
    this.setState({userInfo: {
      ...this.state.userInfo,
      [name]: value,
    }});
  }

  onSubmit = () => {
    const { avator, userInfo } = this.state;
    this.props.submitUserInfo({
      ...userInfo,
      avatorURI: avator.uri,
    }).then(() => {
      if (this.props.submitResult.message === 'SUCCESS') {
        DeviceEventEmitter.emit('updateUserInfo');
        Alert.alert('提示', '信息修改成功，是否继续留在此处', [
          {
            text: '是',
            onPress: () => {}
          }, {
            text: '否',
            onPress: () => this.props.navigation.navigate('Feedback'),
          }
        ]);
      } else {
        Toast.showShort('信息提交失败');
      }
    }).catch(err => console.log(err));
  }

  render() {
    // 当this.avatorUri为 null，this.state.avator.uri才会作为头像的路径
    const avatorPath = this.avatorUri ? this.avatorUri : this.state.avator.uri;
    const {
      userName,
      sex,
      userMobile,
      userBirthday,
      userEducation,
      userHobbies,
      userWorkingYears,
      userAddress,
      companyName,
      jobName,
      department,
      workContent,
      technologyStack,
      graduatedSchool,
      profession,
      admissionTime,
      graduationTime,
    } = this.state.userInfo;
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableHighlight
          style={styles.container_avator}
          onPress={this.updateAvator}
          underlayColor="#ccc"
        >
          <View style={styles.container_avator_box}>
            <View style={styles.container_avator_box_left}>
              <Image
                source={{uri: avatorPath}}
                resizeMode="cover"
                style={{ width: 80, height:80 }}
              />
            </View>
            <View style={styles.container_avator_box_center}>
              <Text
                style={[
                  styles.container_avator_box_center_font,
                  { fontSize: 16, }
                ]}
              >{userName}</Text>
              <Text style={styles.container_avator_box_center_font}>{userMobile}</Text>
            </View>
            <Icon name="switch" size={34} color="#666" style={styles.container_avator_box_right} />
          </View>
        </TouchableHighlight>
        <View style={styles.container_box}>
          <InputText
            title="姓名"
            name="userName"
            placeholder="请输入您的姓名"
            value={userName}
            onChangeText={this.updateStateValue}
            editable={false}
          />
          <RadioBox
            title="性别"
            name="sex"
            value={sex}
            dataSource={sexType}
          />
          <DatePicker
            title="出生年月"
            placeholder="请选择您的出生年月"
            name="userBirthday"
            time={userBirthday}
          />
          <InputText
            title="学历"
            name="userEducation"
            placeholder="请输入您的学历"
            value={userEducation}
            onChangeText={this.updateStateValue}
          />
          <InputText
            title="个人爱好"
            name="userHobbies"
            placeholder="请输入您的爱好"
            value={userHobbies}
            onChangeText={this.updateStateValue}
            multiline
            maxHeight={84}
          />
          <InputText
            title="联系方式"
            name="userMobile"
            placeholder="请输入您的联系方式"
            value={userMobile}
            onChangeText={this.updateStateValue}
            keyboardType="numeric"
            editable={false}
          />
          <InputText
            title="工作年限"
            name="userWorkingYears"
            placeholder="请输入您的工作年限"
            value={userWorkingYears}
            onChangeText={this.updateStateValue}
            keyboardType="numeric"
          />
          <InputText
            title="居住地址"
            name="userAddress"
            placeholder="请输入您的居住地址"
            value={userAddress}
            onChangeText={this.updateStateValue}
          />
        </View>
        <View style={styles.container_box}>
          <InputText
            title="所在公司"
            name="companyName"
            placeholder="请输入您所在公司"
            value={companyName}
            onChangeText={this.updateStateValue}
          />
          <InputText
            title="职位名称"
            name="jobName"
            placeholder="请输入您所从事的职位名称"
            value={jobName}
            onChangeText={this.updateStateValue}
          />
          <InputText
            title="所属部门"
            name="department"
            placeholder="请输入您所在的部门"
            value={department}
            onChangeText={this.updateStateValue}
          />
          <InputText
            title="工作内容"
            name="workContent"
            placeholder="请输入您所从事的工作内容"
            value={workContent}
            onChangeText={this.updateStateValue}
            multiline
            maxHeight={84}
          />
          <InputText
            title="技术栈"
            name="technologyStack"
            placeholder="您的技术栈"
            value={technologyStack}
            onChangeText={this.updateStateValue}
            multiline
            maxHeight={84}
          />
        </View>
        <View style={styles.container_box}>
          <InputText
            title="毕业学校"
            name="graduatedSchool"
            placeholder="请输入您的毕业院校"
            value={graduatedSchool}
            onChangeText={this.updateStateValue}
          />
          <InputText
            title="专业"
            name="profession"
            placeholder="请输入您所学的专业"
            value={profession}
            onChangeText={this.updateStateValue}
          />
          <InputText
            title="所属部门"
            name="department"
            placeholder="请输入您所在的部门"
            value={department}
            onChangeText={this.updateStateValue}
          />
          <DatePicker
            title="入学时间"
            name="admissionTime"
            placeholder="请输入您的入学时间"
            time={admissionTime}
            onChange={this.updateStateValue}
          />
          <DatePicker
            title="毕业时间"
            name="graduationTime"
            placeholder="请输入您的毕业时间"
            time={graduationTime}
            onChange={this.updateStateValue}
          />
        </View>
        <View style={styles.conatiner_submit}>
          <TouchableOpacity
            onPress={this.onSubmit}
            style={styles.conatiner_submit_box}
            opacity={.8}
          >
            <Text style={{ fontSize: 16, color: '#fff' }}>提交</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
};
