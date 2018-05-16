import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  DeviceEventEmitter,
  Linking,
  Dimensions,
  Animated,
  PanResponder,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { isEmpty } from 'lodash';
import Swiper from 'react-native-swiper';
import ModalImages from '../../components/ModalImages';
import TabBarIcon from '../../components/TabBarIcon';
import Icon from '../../components/Icon';
import Loading from '../../components/Loading';
import { createAction, Toast, Storage } from '../../utils';
import PullView from '../../components/PullView';
import UserListItem from '../../components/UserListItem';

const DeviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    lineHeight: 100,
    textAlign: 'center',
    fontSize: 18,
    color: '#d9d9d9',
  },
  footer: {
    lineHeight: 40,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
});

const imageList = [
  'http://123.207.41.132:8080/images/111.jpg',
  'http://123.207.41.132:8080/images/222.jpg',
  'http://123.207.41.132:8080/images/333.jpg',
  'http://123.207.41.132:8080/images/444.jpg',
  'http://123.207.41.132:8080/images/555.jpg',
];

const mapStateToProps = state => ({
  userList: state.userInfo.userList,
});

const mapDispatchToProps = {
  getUserList: createAction('userInfo/getUserList'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class About extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '关于',
    header: null,
    tabBarIcon: ({ focused, tintColor }) =>
      (<TabBarIcon
        name="mine"
        activeName="mine_fill"
        size={22}
        tintColor={tintColor}
        focused={focused}
      />),
  })

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    userList: PropTypes.array.isRequired,
    getUserList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
      swipeIdx: 0,
      isShowModal: false,
      initialPageOfModal: 0,
      emptyText: '请稍等~ 数据加载中...',

      refreshing: false,
    };
  }

  componentDidMount() {
    this.props.getUserList({});
  }

  // 关闭ModalImages
  closeModal = () => {
    this.setState({ isShowModal: false });
  }
  // 提交搜索
  onSubmitEditing = (value) => {
    this.props.getUserList({ query: value })
      .then(() => {
        if (isEmpty(this.props.userList)) {
          this.setState({ emptyText: '当前数据为空' });
        }
      }).catch(err => console.log(err));
  }
  // 下来刷新
  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.getUserList({})
      .then(() => {
        this.setState({ refreshing: false });
      }).catch(err => console.log(err));
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <ModalImages
          visible={this.state.isShowModal}
          closeModal={this.closeModal}
          initialPage={this.state.initialPageOfModal}
          imageList={imageList}
        />
        <PullView
          style={{ flex: 1 }}
          showSearchBar
          placeholder="请输入电话号码/姓名"
          onSubmitEditing={this.onSubmitEditing}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
        >
          <Swiper
            style={styles.container_body_banner}
            height={200}
            horizontal
            loop
            autoplay
            paginationStyle={{ bottom: 10 }}
            showsButtons={false}
            autoplayTimeout={5}
          >
            {
              imageList.map((item, index) =>
                (<TouchableWithoutFeedback
                  key={item}
                  onPress={() => {
                    this.setState({ isShowModal: true, initialPageOfModal: index });
}}
                >
                  <Image
                    source={{ uri: item }}
                    resizeMode="cover"
                    style={{ width: DeviceWidth, height: 200 }}
                  />
                 </TouchableWithoutFeedback>))
            }
          </Swiper>
          {
            this.props.userList.map(item =>
              <UserListItem {...item} navigation={this.props.navigation} key={item.userMobile} />)
          }
          {
            !isEmpty(this.props.userList)
              ? <Text style={styles.footer}>我是有底线的~~~</Text>
              : null
          }
          {
            isEmpty(this.props.userList)
              ? <Text style={styles.empty}>{this.state.emptyText}</Text>
              : null
          }
        </PullView>
      </View>
    );
  }
}
