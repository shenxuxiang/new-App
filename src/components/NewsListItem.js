import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
  Text,
  PixelRatio,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/zh-cn';

export default class NewsListItem extends PureComponent {
  static typeProps = {
    url: PropTypes.string,
    content: PropTypes.string,
    title: PropTypes.string,
    time: PropTypes.number,
    navigation: PropTypes.object.isRequired,
  }
  static defaultProps = {
    url: '',
    content: '',
    title: '',
    time: null,
  }

  constructor() {
    super();
    this.state = {
      descriptionfontColor: 'rgba(0,0,0,.8)',
      titleFontColor: '#87CEFA',

    };
  }

  onPressHandle = () => {
    this.setState({
      descriptionfontColor: '#999',
      titleFontColor: '#999',
    });
    this.props.navigation.navigate('Web', {
      url: this.props.url,
      title: this.props.title,
    });
  }

  render() {
    const { url, content, title, time } = this.props;
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="#d9d9d9"
        onPress={this.onPressHandle}
      >
        <View style={styles.conatiner_content}>
          <View style={styles.conatiner_content_img}>
            <Image
              style={styles.conatiner_content_img_con}
              source={{uri: url}}
              resizeMode="cover"
            />
          </View>
          <View style={styles.conatiner_content_con}>
            <Text
              style={[
                styles.conatiner_content_con_description,
                { color: this.state.descriptionfontColor }
              ]}
              numberOfLines={2}
            >{content}</Text>
            <View style={styles.conatiner_content_con_info}>
              <Text
                style={[
                  styles.conatiner_content_con_info_title,
                  { color: this.state.titleFontColor }
                ]}
              >{title}</Text>
              <Text style={styles.conatiner_content_con_info_time}>{moment(time).fromNow()}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  conatiner_content: {
    flex: 1,
    flexDirection: 'row',
  },
  conatiner_content_img: {
    width: 80,
    height: 70,
  },
  conatiner_content_img_con: {
    width: 80,
    height: 70,
    borderRadius: 6,
  },
  conatiner_content_con: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
  },
  conatiner_content_con_description: {
    fontSize: 16,
    lineHeight: 20,
  },
  conatiner_content_con_info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conatiner_content_con_info_title: {
    fontSize: 14,
  },
  conatiner_content_con_info_time: {
    fontSize: 14,
    color: '#ccc',
  },
})
