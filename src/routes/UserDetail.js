import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import TextInfo from '../components/TextInfo';
import EmptyContent from '../components/EmptyContent';
import { createAction, Toast } from '../utils';

const mapStateToProps = state => ({
  userDetail: state.userInfo.userDetail,
});

const mapDispatchToProps = {
  getUserDetail: createAction('userInfo/getUserDetail'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class UserDetail extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    userDetail: PropTypes.object.isRequired,
    getUserDetail: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      userMobile: props.navigation.state.params.userMobile,
      isShowLoading: true,
    };
  }

  componentDidMount() {
    this.props.getUserDetail({ userMobile: this.state.userMobile })
      .catch(err => console.log(err))
      .finally(() => this.setState({ isShowLoading: false }));
  }

  // 联系我
  onContactMe = () => {
    const { userMobile } = this.state;
    const url = `tel:${userMobile}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Toast.showShort('您的设备无法支持此功能');
        }
      }).catch(err => console.log(err));
  }

  render() {
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
      avatorURI,
    } = this.props.userDetail;
    if (this.state.isShowLoading) {
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#3e9ce9" />
          <Loading />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#3e9ce9" />
        <View
          style={[
            styles.container_header,
          ]}
        >
          <Icon
            name="undo"
            size={30}
            color="#333"
            onPress={() => this.props.navigation.goBack()}
            style={styles.container_header_back}
          />

          <View style={styles.container_header_avator}>
            <Image
              source={{ uri: avatorURI }}
              resizeMode="cover"
              style={{ width: 40, height: 40 }}
            />
          </View>

          <Text style={styles.container_header_name}>{userName}</Text>
          <View style={styles.container_header_icon}>
            <Icon name="addressbook" size={26} color="#333" onPress={this.onContactMe} />
          </View>
        </View>

        <View style={styles.body}>
          <ScrollView
            style={styles.body_content}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0, 2, 4]}
          >
            <View style={styles.body_content_title}>
              <Text style={styles.body_content_title_font}>基本信息</Text>
            </View>
            <View style={styles.body_content_box}>
              <TextInfo
                title="姓名"
                content={userName}
              />
              <TextInfo
                title="性别"
                content={sex === 1 ? '男' : '女'}
              />
              <TextInfo
                title="出生年月"
                content={userBirthday}
              />
              <TextInfo
                title="学历"
                content={userEducation}
              />
              <TextInfo
                title="个人爱好"
                content={userHobbies}
              />
              <TextInfo
                title="联系方式"
                content={userMobile}
              />
              <TextInfo
                title="工作年限"
                content={userWorkingYears}
              />
              <TextInfo
                title="居住地址"
                content={userAddress}
                viewStyle={{ borderBottomWidth: 0 }}
              />
            </View>

            <View style={[styles.body_content_title, { marginTop: 10 }]}>
              <Text style={styles.body_content_title_font}>工作简历</Text>
            </View>
            <View style={styles.body_content_box}>
              <TextInfo
                title="所在公司"
                content={companyName}
              />
              <TextInfo
                title="职位名称"
                content={jobName}
              />
              <TextInfo
                title="所属部门"
                content={department}
              />
              <TextInfo
                title="工作内容"
                content={workContent}
              />
              <TextInfo
                title="技术栈"
                content={technologyStack}
                viewStyle={{ borderBottomWidth: 0 }}
              />
            </View>

            <View style={[styles.body_content_title, { marginTop: 10 }]}>
              <Text style={styles.body_content_title_font}>教育背景</Text>
            </View>
            <View style={styles.body_content_box}>
              <TextInfo
                title="毕业学校"
                content={graduatedSchool}
              />
              <TextInfo
                title="专业"
                content={profession}
              />
              <TextInfo
                title="入学时间"
                content={admissionTime}
              />
              <TextInfo
                title="毕业时间"
                content={graduationTime}
                viewStyle={{ borderBottomWidth: 0 }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_header: {
    // position: 'absolute',
    // top: 0,
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(230,230,230,.95)',
    // zIndex: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  container_header_back: {
    paddingRight: 10,
  },
  container_header_avator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ccc',
    overflow: 'hidden',
  },
  container_header_name: {
    fontSize: 16,
    color: 'black',
  },
  container_header_icon: {
    flex: 1,
    alignItems: 'flex-end',
  },


  body: {
    flex: 1,
  },
  body_header: {
    width: '100%',
    height: 150,
  },
  body_content: {
    flex: 1,
  },
  body_content_title: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  body_content_title_font: {
    color: 'black',
    fontSize: 16,
  },
  body_content_box: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  body_content_footer: {
    width: '100%',
    height: 80,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  body_content_footer_btn: {
    flex: 1,
    backgroundColor: '#3e9ce9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
});
