import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {isEmpty} from 'lodash';
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
    width: width -95,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  container_content_textInput: {
    width: '100%',
    minHeight: 34,
    paddingVertical: 0,
    paddingHorizontal: 5,
    flexDirection: 'row',
  }
})

export default function InputText(props) {
  const {
    title,
    maxHeight,
    name,
    titleColor,
    TextInputColor,
    value,
    onChangeText,
    keyboardType,
    multiline,
    placeholder,
    placeholderTextColor,
    editable,
  } = props;
  return (
    <View
      style={styles.container}
    >
      <Text
        style={[
          styles.container_title,
          { color: titleColor }
        ]}
      >{title}：</Text>
      <View style={styles.container_content}>
        <TextInput
          style={[
            styles.container_content_textInput,
            { maxHeight: maxHeight, color: TextInputColor }
          ]}
          onChangeText={(text) => onChangeText(name, text)}
          value={value}
          placeholder={placeholder}
          underlineColorAndroid="transparent"
          keyboardType={keyboardType}
          multiline={multiline}
          placeholderTextColor={placeholderTextColor}
          editable={editable}
        />
      </View>
    </View>
  );
};

InputText.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  maxHeight: PropTypes.number,
  titleColor: PropTypes.string,
  TextInputColor: PropTypes.string,
  value: PropTypes.string,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  editable: PropTypes.bool,
  onChangeText: PropTypes.func,
};
InputText.defaultProps = {
  maxHeight: 34,
  titleColor: 'rgba(0,0,0,.8)',
  TextInputColor: 'rgba(0,0,0,.6)',
  value: '',
  keyboardType: 'default',
  multiline: false,
  placeholder: '',
  placeholderTextColor: '#ccc',
  editable: true,
  onChangeText: () => {},
};
