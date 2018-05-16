import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/zh-cn';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  container_title: {
    width: 75,
    lineHeight: 36,
    paddingRight: 5,
    textAlign: 'right',
  },
  container_content: {
    width: width - 95,
    height: 36,
    borderColor: '#ccc',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
  },
  container_content_textInput: {
    width: '100%',
    height: 36,
    lineHeight: 36,
    borderColor: '#fff',
    paddingVertical: 0,
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
});

export default class DatePicker extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    titleColor: PropTypes.string,
    TextInputColor: PropTypes.string,
    time: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    titleColor: 'rgba(0,0,0,.8)',
    TextInputColor: 'rgba(0,0,0,.6)',
    time: '',
    placeholder: '',
    placeholderTextColor: '#ccc',
    onChange: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      time: props.time,
    };
    this.datePickerTime = new Date(props.time);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.time !== this.props.time) {
      this.datePickerTime = new Date(nextProps.time);
      this.setState({ time: nextProps.time });
    }
  }

  // 选择时间 确认
  handleDatePicked = (date) => {
    this.datePickerTime = date;
    this.setState({
      time: moment(date).format('YYYY-MM-DD'),
      visible: false,
    }, () => {
      this.props.onChange(this.props.name, moment(date).format('YYYY-MM-DD'));
    });
  }
  // 选择时间 取消
  hideDateTimePicker = () => {
    this.setState({ visible: false });
  }

  render() {
    const {
      title,
      titleColor,
      TextInputColor,
      placeholder,
      placeholderTextColor,
    } = this.props;
    return (
      <View
        style={styles.container}
      >
        <Text
          style={[
            styles.container_title,
            { color: titleColor },
          ]}
        >{title}：
        </Text>
        <View style={styles.container_content}>
          <Text
            onPress={() => this.setState({ visible: true })}
            style={[
              styles.container_content_textInput,
              { color: !this.state.time ? placeholderTextColor : TextInputColor },
            ]}
          >
            {!this.state.time ? placeholder : this.state.time}
          </Text>
        </View>
        <DateTimePicker
          isVisible={this.state.visible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="date"
          date={this.datePickerTime}
        />
      </View>
    );
  }
}

