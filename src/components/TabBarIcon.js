import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

export default function TabBarIcon(props) {
  const {
    name,
    activeName,
    size,
    tintColor,
    focused,
  } = props;
  return (
    <Icon
      name={focused ? activeName : name}
      size={size}
      color={tintColor}
    />
  );
}

TabBarIcon.propTypes = {
  name: PropTypes.string.isRequired,
  activeName: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  tintColor: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
};

