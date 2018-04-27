import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, PixelRatio } from 'react-native';

const styles = StyleSheet.create({
  contain: {
    width: '100%',
    minHeight: 42,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1/PixelRatio.get(),
  },
  title: {
    lineHeight: 42,
    fontSize: 14,
    color: 'black',
    marginRight: 10,
  },
  content: {
    flex: 1,
    paddingTop: 5,
    lineHeight: 32,
    fontSize: 14,
    color: 'rgba(0,0,0,.6)',
  }
});

export default function TextInfo(props) {
  const { title, content, titleStyle, contentStyle, viewStyle } = props;
  return (
    <View style={[styles.contain, viewStyle]}>
      <Text style={[styles.title, titleStyle]}>{title}:</Text>
      <Text style={[styles.content, contentStyle]}>{content}</Text>
    </View>
  );
}

TextInfo.propTypes = {
  title: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  titleStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  viewStyle: PropTypes.object,
};
TextInfo.defaultProps = {
  title: '标题',
  content: '',
  titleStyle: null,
  contentStyle: null,
  viewStyle: null,
};
