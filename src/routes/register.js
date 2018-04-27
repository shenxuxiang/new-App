import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { createAction, Toast, RegExpObj } from '../utils';
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
    borderWidth: 1,
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
  container_submit: {
    width: '100%',
    height: 44,
    borderRadius: 6,
    borderColor: '#177cce',
    borderWidth: 1,
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

const mapStateToProps = (state) => ({
  register: state.app.register,
});

const mapDispatchToProps = {
  toRegister: createAction('app/toRegister'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Register extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    title: '注册',
    headerLeft: null,
  })

  static propTypes = {
    register: PropTypes.object.isRequired,
    toRegister: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
      userMobile: '',
      userName: '',
      mobileBorderColor: '#ccc',
      nameBorderColor: '#ccc',
    }
  }

  handlerEmpty = () => {
    Alert.alert('提示', '别点啦！这里啥也没有');
  }

  toLogin = () => {
    this.props.navigation.navigate('Login');
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
    this.props.toRegister({userMobile, userName})
      .then(() => {
        const { register } = this.props;
        if (register.message === 'SUCCESS') {
          this.props.navigation.navigate('Login', { userMobile, userName });
        } else {
          Toast.showShort(register.message);
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { userName, userMobile, mobileBorderColor, nameBorderColor } = this.state;
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
            { marginTop: 40, borderColor: mobileBorderColor }
          ]}
        >
          <Icon name="addpeople" size={24} color="rgba(0,0,0,.4)" />
          <TextInput
            style={styles.container_inputbox_input}
            value={userMobile}
            placeholder="请输入手机号"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({ userMobile: text })}
            onFocus={() => this.setState({ mobileBorderColor: '#3e9ce9' })}
            onBlur={() => this.setState({ mobileBorderColor: '#ccc' })}
            multiline = {false}
            keyboardType="numeric"
            placeholderTextColor ="rgba(0,0,0,.6)"
          />
          <Icon
            name="delete_fill"
            size={userMobile ? 24 : 0}
            color="rgba(0,0,0,.2)"
            onPress={() => this.setState({ userMobile: ''})}
          />
        </View>
        <View
          style={[
            styles.container_inputbox,
            { borderColor: nameBorderColor }
          ]}
        >
          <Icon name="mine" size={24} color="rgba(0,0,0,.4)" />
          <TextInput
            style={styles.container_inputbox_input}
            value={userName}
            placeholder="请输入姓名"
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({ userName: text })}
            onFocus={() => this.setState({ nameBorderColor: '#3e9ce9' })}
            onBlur={() => this.setState({ nameBorderColor: '#ccc' })}
            multiline = {false}
            keyboardType="default"
            placeholderTextColor ="rgba(0,0,0,.6)"
          />
          <Icon
            name="delete_fill"
            size={userName ? 24 : 0}
            color="rgba(0,0,0,.2)"
            onPress={() => this.setState({ userName: '' })}
          />
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
            userName && userMobile ? null :
              <View style={styles.container_submit_mask}/>
          }
        </View>
        <View style={styles.container_footer}>
          <Text
            style={styles.container_footer_text}
            onPress={this.handlerEmpty}
          >点着玩</Text>
          <Text style={{ color: '#999', paddingHorizontal: 5 }}>|</Text>
          <Text
            style={styles.container_footer_text}
            onPress={this.toLogin}
          >去登录</Text>
        </View>
      </View>
      </ScrollView>
    );
  }
}
