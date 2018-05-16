import sendRequest from './request';

export { default as Toast } from './toast';

export { default as Storage } from './storage';

export const createAction = type => payload => ({ type, payload });

export const delay = time => new Promise(resolve => setTimeout(resolve, time));

export const RegExpObj = {
  mobile: /^1(3|5|7|8)[0-9]{9}$/,
  chsName: /^[\u4e00-\u9fff]([\u4e00-\u9fff]{0,4})[\u4e00-\u9fff]$/,
  picType: /^image\.(png|jpg|jpeg|bmp)$/,
  passWord: /^(?=[A-Z][a-zA-Z])(?=.*\d+)(?=.*[\~\!\@\#\$%\^&\*\(\)_\+\{\}\:\;\"\"\'\/\`\?\<\>\.\,\[\]\-\=\\\|]+)[a-zA-Z0-9\x21-x7e]{6,18}$/,
};

export const fetch = (...options) => Promise.race([
  sendRequest(...options),
  new Promise((resolve, reject) => setTimeout(() => {
    reject({ msg: '请求超时了~~' });
  }, 30000)),
]);
