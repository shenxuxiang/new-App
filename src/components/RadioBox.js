import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';

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
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  container_content_item: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingRight: 20,
  },
  container_content_item_icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_content_item_icon_con: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  container_content_item_text: {
    marginLeft: 5,
    fontSize: 14,
  },
});

export default class RadioBox extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    dataSource: PropTypes.array,
    titleColor: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    titleColor: 'rgba(0,0,0,.8)',
    value: '',
    dataSource: [],
    onChange: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handlerChecked = (item) => {
    this.setState({ value: item.label }, () => {
      this.props.onChange(this.props.name, item.label);
    });
  }

  render() {
    const {
      title,
      titleColor,
      dataSource,
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
          {
            dataSource.map((item, index) => (
              <TouchableWithoutFeedback
                opacity={1}
                onPress={() => this.handlerChecked(item)}
                key={item}
              >
                <View style={styles.container_content_item}>
                  <View
                    style={[
                        styles.container_content_item_icon,
                        { borderColor: item.label === this.state.value ? '#3e9ce9' : 'rgba(0,0,0,.4)' },
                      ]}
                  >
                    <View
                      style={[
                          styles.container_content_item_icon_con,
                          { backgroundColor: item.label === this.state.value ? '#3e9ce9' : 'rgba(0,0,0,.4)' },
                        ]}
                    />
                  </View>
                  <Text
                    style={[
                        styles.container_content_item_text,
                        { color: item.label === this.state.value ? '#3e9ce9' : 'rgba(0,0,0,.4)' },
                      ]}
                  >{item.text}
                  </Text>

                </View>
              </TouchableWithoutFeedback>
              ))
          }
        </View>
      </View>
    );
  }
}

