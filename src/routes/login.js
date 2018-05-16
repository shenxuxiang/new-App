import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  StatusBar,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import * as WeChat from 'react-native-wechat';
import Loading from '../components/Loading';
import { createAction, Toast, RegExpObj, Storage } from '../utils';
import Icon from '../components/Icon';

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_box: {
    width: '100%',
    height: Platform.OS === 'ios' ? height - 44 : height - 81, // 81 = 56 + 25
    paddingHorizontal: 10,
  },
  container_inputbox: {
    width: '100%',
    height: 46,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container_inputbox_input: {
    flex: 1,
    height: 44,
    padding: 0,
    paddingHorizontal: 5,
    fontSize: 16,
    color: 'black',
  },
  container_reader: {
    width: '100%',
    height: 46,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container_reader_iconbox: {
    width: 20,
    height: 20,
    padding: 0,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#3e9ce9',
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container_submit: {
    width: '100%',
    height: 44,
    borderRadius: 6,
    borderColor: '#177cce',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#3e9ce9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_submit_text: {
    fontSize: 16,
    color: '#fff',
  },
  container_submit_mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,.5)',
  },
  container_footer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: '100%',
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_footer_text: {
    lineHeight: 36,
    color: '#5faded',
    fontSize: 14,
  },
});

const mapStateToProps = state => ({
  login: state.app.login,
});

const mapDispatchToProps = {
  toLogin: createAction('app/toLogin'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Login extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: '登录',
    headerLeft: null,
    headerTitleStyle: { alignSelf: 'center' },
  })

  static propTypes = {
    login: PropTypes.object.isRequired,
    toLogin: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
      userMobile: '',
      userName: '',
      mobileBorderColor: '#ccc',
      nameBorderColor: '#ccc',
      isReady: false,
      isLoading: false,
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    if (params) {
      this.setState({
        userName: params.userName,
        userMobile: params.userMobile,
      });
    }
  }

  handlerEmpty = () => {
    Alert.alert('提示', '别点啦！这里啥也没有');
  }

  toRegister = () => {
    this.props.navigation.navigate('Register');
  }

  setNavigator = async () => {
    // 是不是第一次使用App
    await Storage.setItem('USERMOBILE', this.state.userMobile);
    Storage.getItem('ISNOTFIRST')
      .then((data) => {
        if (data) {
          this.props.navigation.navigate('Mine');
        } else {
          this.props.navigation.navigate('InitCategory');
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  onSubmit = () => {
    Keyboard.dismiss();
    const { userName, userMobile } = this.state;
    if (!RegExpObj.chsName.test(userName)) {
      Toast.showShort('用户名必须是2-6个汉字');
      return;
    }
    if (!RegExpObj.mobile.test(userMobile)) {
      Toast.showShort('电话号码格式不对，重新输入');
      return;
    }
    this.setState({ isLoading: true });
    this.props.toLogin({ userMobile, userName })
      .then(() => {
        const { login } = this.props;
        if (login.message === 'SUCCESS') {
          this.setState({ isLoading: false }, () => {
            this.setNavigator();
          });
        } else {
          this.setState({ isLoading: false }, () => {
            Toast.showShort(login.message);
          });
        }
      }).catch((err) => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const {
      userName, userMobile, mobileBorderColor, nameBorderColor, isReady, isLoading,
    } = this.state;
    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <View style={styles.container_box}>
          <View
            style={[
            styles.container_inputbox,
            { marginTop: 40, borderColor: mobileBorderColor },
          ]}
          >
            <Icon name="addpeople" size={24} color="rgba(0,0,0,.4)" />
            <TextInput
              style={styles.container_inputbox_input}
              value={userMobile}
              placeholder="请输入手机号"
              underlineColorAndroid="transparent"
              onChangeText={text => this.setState({ userMobile: text })}
              onFocus={() => this.setState({ mobileBorderColor: '#3e9ce9' })}
              onBlur={() => this.setState({ mobileBorderColor: '#ccc' })}
              multiline={false}
              keyboardType="numeric"
              placeholderTextColor="rgba(0,0,0,.6)"
            />
            <Icon
              name="delete_fill"
              size={userMobile ? 24 : 0}
              color="rgba(0,0,0,.2)"
              onPress={() => this.setState({ userMobile: '' })}
            />
          </View>
          <View
            style={[
            styles.container_inputbox,
            { borderColor: nameBorderColor },
          ]}
          >
            <Icon name="mine" size={24} color="rgba(0,0,0,.4)" />
            <TextInput
              style={styles.container_inputbox_input}
              value={userName}
              placeholder="请输入姓名"
              underlineColorAndroid="transparent"
              onChangeText={text => this.setState({ userName: text })}
              onFocus={() => this.setState({ nameBorderColor: '#3e9ce9' })}
              onBlur={() => this.setState({ nameBorderColor: '#ccc' })}
              multiline={false}
              keyboardType="default"
              placeholderTextColor="rgba(0,0,0,.6)"
            />
            <Icon
              name="delete_fill"
              size={userName ? 24 : 0}
              color="rgba(0,0,0,.2)"
              onPress={() => this.setState({ userName: '' })}
            />
          </View>
          <View style={styles.container_reader}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ isReady: !isReady })}
            >
              <View
                style={[
                styles.container_reader_iconbox,
                {
                  borderColor: isReady ? 'transparent' : '#ccc',
                  backgroundColor: isReady ? '#3e9ce9' : 'transparent',
                },
              ]}
              >
                <Icon
                  name="right"
                  color="#fff"
                  size={isReady ? 18 : 0}
                />
              </View>
            </TouchableWithoutFeedback>
            <Text style={{ marginLeft: 10, color: 'black' }}>我已阅读并同意</Text>
            <Text style={{ color: '#f80' }}>用户协议</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.container_submit}
              opacity={0.6}
              onPress={this.onSubmit}
            >
              <Text style={styles.container_submit_text}>登录</Text>
            </TouchableOpacity>
            {
            userName && userMobile && isReady ? null :
            <View style={styles.container_submit_mask} />
          }
          </View>
          <View style={styles.container_footer}>
            <Text
              style={styles.container_footer_text}
              onPress={this.handlerEmpty}
            >点着玩
            </Text>
            <Text style={{ color: '#999', paddingHorizontal: 5 }}>|</Text>
            <Text
              style={styles.container_footer_text}
              onPress={this.toRegister}
            >去注册
            </Text>
          </View>
        </View>
        {
        isLoading ? <Loading /> : null
      }
      </ScrollView>
    );
  }
}
