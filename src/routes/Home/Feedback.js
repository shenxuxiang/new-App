import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Lightbox from 'react-native-lightbox';
import Carousel from 'react-native-looped-carousel';
import TabBarIcon from '../../components/TabBarIcon';
import Banner from '../../components/Banner';
import Icon from '../../components/Icon';
import TextInfo from '../../components/TextInfo';
import ModalImages from '../../components/ModalImages';
import { createAction, Storage, } from '../../utils';

const DeviceWidth = Dimensions.get('window').width;

const mapStateToProps = (state) => ({
  userInfo: state.userInfo.userInfo,
});

const mapDispatchToProps = {
  getUserInfo: createAction('userInfo/getUserInfo'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Feedback extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    title: '建议',
    headerLeft: null,
    header: null,
    tabBarIcon: ({ focused, tintColor }) =>
      <TabBarIcon
        name="brush"
        activeName="brush_fill"
        size={22}
        tintColor={tintColor}
        focused={focused}
      />
  })

  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      swipeIdx: 0,
      isShowModal: false,
      initialPageOfModal: 0,
      imageList: [
        'http://192.168.0.115:8080/images/111.jpg',
        'http://192.168.0.115:8080/images/222.jpg',
        'http://192.168.0.115:8080/images/333.jpg',
        'http://192.168.0.115:8080/images/444.jpg',
        'http://192.168.0.115:8080/images/555.jpg',
      ],
      userMobile: '',
    };
  }

  componentDidMount() {
    this.deviceEventListener = DeviceEventEmitter.addListener('updateUserInfo', this.getUserInfo);
    this.getUserInfo()
  }

  componentWillUnmount = () => {
    this.deviceEventListener.remove();
  }

  getUserInfo = () => {
    Storage.getItem('USERMOBILE')
      .then((data) => {
        this.setState({ userMobile: data });
        this.props.getUserInfo({userMobile: data})
          .catch(err => console.log(err));
      }).catch(err => console.log(err));
  }

  onIndexChanged = (idx) => {
    this.setState({ swipeIdx: idx });
  }
  // 关闭ModalImages
  closeModal = () => {
    this.setState({ isShowModal: false })
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
    } = this.props.userInfo;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#3e9ce9" />
        <ModalImages
          visible={this.state.isShowModal}
          closeModal={this.closeModal}
          initialPage={this.state.initialPageOfModal}
          imageList={this.state.imageList}
        />
        <View style={styles.body}>
          <ScrollView
            style={styles.body_content}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1, 3, 5]}
          >
            <Swiper
              style={styles.body_header}
              height={150}
              horizontal={true}
              loop={true}
              autoplay={true}
              paginationStyle={{ bottom: 10 }}
              showsButtons={false}
              autoplayTimeout={4}
            >
              {
                this.state.imageList.map((item, index) =>
                  <TouchableWithoutFeedback
                    key={item}
                    onPress={() => {
                      this.setState({ isShowModal: true, initialPageOfModal: index })}}
                  >
                    <Image
                      source={{ uri: item }}
                      resizeMode="cover"
                      style={{ width: DeviceWidth, height: 150 }} />
                  </TouchableWithoutFeedback>
                )
              }
            </Swiper>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    zIndex: 12,
  },
  header_left: {
    fontSize: 14,
    color: 'black',
  },
  header_right: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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

})
