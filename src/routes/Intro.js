import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { registerApp } from 'react-native-wechat';
import { Storage, Toast } from '../utils';

const splashImg = require('../static/images/splash.png');
const { height: winHeight, width: winWidth } = Dimensions.get('window');

export default class Intro extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
      animationValue: new Animated.Value(1),
    }
    // 微信注册
    registerApp('wxb24c445773822c79');
  }

  componentDidMount() {
    const { navigation } = this.props;
    Animated.timing(this.state.animationValue, {
      toValue: 1.2,
      duration: 1000,
    }).start();
    SplashScreen.hide();
    this.timer = setTimeout(() => {
      Storage.multiGet('USERMOBILE', 'MYCATEGORY')
        .then((data) => {
          const [[ ,userMobile ], [ , myCategory]] = data;
          if (!userMobile) {
            // 用户不存在就去登录界面
            navigation.navigate('Login');
          } else {
            if (!myCategory) {
              // 没有选分类就去分类界面
              navigation.navigate('InitCategory');
            } else {
              // 选了就去home界面
              navigation.navigate('Home');
            }
          }
        }).catch(err => console.log(err));
    }, 1000)
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  render() {
    return (
        <Animated.Image
          style={{
            width: winWidth,
            height: winHeight,
            transform: [
              {
                scale: this.state.animationValue,
              }
            ]
          }}
          source={splashImg}
          resizeMode="contain"
        />
    );
  }
}
