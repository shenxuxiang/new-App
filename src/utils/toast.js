import {
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';

const showShort = (content, position = 'CENTER', isAlert) => {
  if (!content) return;
  if (isAlert || Platform.os === 'ios') {
    Alert.alert('提示', content.toString());
  } else {
    ToastAndroid.showWithGravity(content.toString(), ToastAndroid.SHORT, ToastAndroid[position]);
  }
};

const showLong = (content, position = 'CENTER', isAlert) => {
  if (!content) return;
  if (isAlert || Platform.os === 'ios') {
    Alert.alert('提示', content.toString());
  } else {
    ToastAndroid.showWithGravity(content.toString(), ToastAndroid.LONG, ToastAndroid[position]);
  }
};

export default {
  showShort,
  showLong
};
