import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Image,
  WebView,
  ProgressBarAndroid,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StatusBar,
  PixelRatio,
  Modal,
} from 'react-native';
import * as WeChat from 'react-native-wechat';
import { Toast } from '../utils';
import Icon from '../components/Icon';
import MyProgress from '../components/MyProgress';
import Loading from '../components/Loading';
import EmptyContent from '../components/EmptyContent';

export default class Web extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  static propTypes = {
    navigation: PropTypes.object,
  }
  static defaultProps = {
    navigation: {},
  }
  constructor() {
    super();
    this.state = {
      status: 'loading',
      isModalShow: false,
    };
  }
  // WebView开始加载
  onLoadStart = () => {
    this.setState({ status: 'loading' });
  }
  // WebView加载成功了
  onLoad = () => {
    this.setState({ status: 'success' });
  }
  // WebView加载失败了
  onError = () => {
    this.setState({ status: 'error' });
  }
  // 进度条进度已达到 100% 了
  onProgressEnd = () => {
    this.setState({ status: 'loadingEnd' });
  }
  // 返回
  backPress = () => {
    if (this.canGoBack) {
      this.webview.goBack();
    } else {
      this.props.navigation.goBack();
    }
  }
  // webView 加载时的指示器
  renderLoading = () =>
  // return <MyProgress
  //   style={{
  //     position: 'absolute',
  //     left: 0,
  //     top: 50,
  //     width: '100%',
  //     height: 2,
  //   }}
  //   status={this.state.status}
  //   onProgressEnd={this.onProgressEnd}
  //   relatedNum={0.8}
  // />
    <Loading />

  // webView 加载失败呈现的状态
  renderError = () => (<View style={styles.container_loadError}>
    <Text style={styles.container_loadError_font}>信息加载失败了~~~</Text>
  </View>)

  onNavigationStateChange = (navState) => {
    this.canGoBack = navState.canGoBack;
  }
  // 分享给好友
  shareToFriends = () => {
    WeChat.isWXAppInstalled()
      .then((isInstalled) => {
        if (isInstalled) {
          WeChat.shareToSession({
            type: 'news',
            webpageUrl: 'https://juejin.im',
            title: 'this is my first app',
            description: '分享自：sxxnews',
            // thumbImage: this.props.navigation.state.params.url,
          }).catch((err) => {
            Toast.showShort(err.message);
          }).finally(() => {
            this.setState({ isModalShow: false });
          });
        } else {
          Toast.showShort('系统检测到您还没有安装微信软件');
        }
      });
  }
  // 分享到朋友圈
  shareToCircleOfFriends = () => {
    WeChat.isWXAppInstalled()
      .then((isInstalled) => {
        if (isInstalled) {
          WeChat.shareToTimeline({
            type: 'news',
            webpageUrl: 'https://juejin.im',
            title: 'this is my first app',
            description: '分享自：sxxnews',
            // thumbImage: this.props.navigation.state.params.url,
          }).catch((err) => {
            Toast.showShort(err.message);
          }).finally(() => {
            this.setState({ isModalShow: false });
          });
        } else {
          Toast.showShort('系统检测到您还没有安装微信软件');
        }
      });
  }

  render() {
    const { title, url } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="black"
        />
        <Modal
          animationType="fade"
          transparent
          visible={this.state.isModalShow}
          onRequestClose={() => {
            this.setState({ isModalShow: false });
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ isModalShow: false });
            }}
          >
            <View style={styles.modal}>
              <View style={styles.modal_con}>
                <Text style={styles.modal_con_header}>分享到</Text>
                <View style={styles.modal_con_body}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.shareToFriends}
                    style={{ width: '40%' }}
                  >
                    <View style={styles.modal_con_body_share}>
                      <Image
                        source={require('../static/images/share_icon_wechat.png')}
                        style={styles.modal_con_body_share_icon}
                      />
                      <Text style={styles.modal_con_body_share_font}>好友</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.shareToCircleOfFriends}
                    style={{ width: '40%' }}
                  >
                    <View style={styles.modal_con_body_share}>
                      <Image
                        source={require('../static/images/share_icon_moments.png')}
                        style={styles.modal_con_body_share_icon}
                      />
                      <Text style={styles.modal_con_body_share_font}>朋友圈</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <View style={styles.container_header}>
          <Icon
            name="undo"
            size={30}
            color="#3e9ce9"
            style={styles.iconStyle}
            onPress={this.backPress}
          />
          <View style={styles.container_header_content}>
            <Image
              style={styles.container_header_content_image}
              source={{ uri: url }}
              resizeMode="cover"
            />
            <Text style={styles.container_header_content_title}>{title}</Text>
          </View>
          <Icon
            name="switch"
            size={30}
            color="#3e9ce9"
            style={styles.iconStyle}
            onPress={() => {
              this.setState({ isModalShow: true });
            }}
          />
        </View>
        <View style={styles.container_content}>
          {
            <WebView
              ref={ref => this.webview = ref}
              style={{ marginTop: 50 }}
              dataDetectorTypes="all"
              source={{ uri: 'http://juejin.im' }}
              onLoadStart={this.onLoadStart}
              onLoad={this.onLoad}
              onError={this.onError}
              renderLoading={this.renderLoading}
              renderError={this.renderError}
              onShouldStartLoadWithRequest={() => {
                const shouldStartLoad = true;
                return shouldStartLoad;
              }}
              startInLoadingState
              domStorageEnabled
              onNavigationStateChange={this.onNavigationStateChange}
            />
          }
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
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 2 / PixelRatio.get(),
    borderBottomColor: '#ccc',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container_header_content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container_header_content_image: {
    width: 30,
    height: 30,
    marginRight: 5,
    borderRadius: 15,
  },
  container_header_content_title: {
    fontSize: 14,
    color: 'rgba(0,0,0,.8)',
  },
  container_header_progress: {
    position: 'absolute',
    bottom: -3,
    left: 0,
    width: '100%',
    height: 2,
  },
  container_content: {
    backgroundColor: '#e6e6e6',
    flex: 1,
  },
  iconStyle: {
    paddingHorizontal: 15,
  },
  container_loadError: {
    width: '100%',
    height: 40,
  },
  container_loadError_font: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 40,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_con: {
    width: '70%',
    height: 150,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  modal_con_header: {
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
  },
  modal_con_body: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modal_con_body_share: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_con_body_share_icon: {
    width: 40,
    height: 40,
  },
  modal_con_body_share_font: {
    fontSize: 16,
    color: '#313131',
    textAlign: 'center',
    marginTop: 5,
  },
});
