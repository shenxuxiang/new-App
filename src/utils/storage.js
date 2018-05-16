import { AsyncStorage } from 'react-native';

function getItem(key) {
  return AsyncStorage.getItem(key)
    .then(data => JSON.parse(data))
    .catch(err => '哦~哦，数据储存出了点问题');
}

function setItem(key, value) {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key) {
  return AsyncStorage.removeItem(key);
}

function clear() {
  return AsyncStorage.clear();
}

function multiGet(...keys) {
  return AsyncStorage.multiGet([...keys]);
}

/**
 * 同时储存多个值
 * @params { Array } info [Object]
 * object 中有两个参数 key, value
 */
function multiSet(info) {
  const options = info.map(item => [item.key, JSON.stringify(item.value)]);
  return AsyncStorage.multiSet(options);
}

function multiRemove(...keys) {
  return AsyncStorage.multiRemove([...keys]);
}

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  multiGet,
  multiSet,
  multiRemove,
};
