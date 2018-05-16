import { fetch } from '../utils';

export default {
  getCategory(payload) {
    return fetch('http://123.207.41.132:8080/category', payload, 'post');
  },
  refreshingNews(payload) {
    return fetch('http://123.207.41.132:8080/news', payload, 'post');
  },
  updateAvator(payload) {
    return fetch('http://123.207.41.132:8080/avator', payload, 'post', {}, true);
  },
  getUserInfo(payload) {
    return fetch('http://123.207.41.132:8080/getUserInfo', payload, 'post');
  },
  submitUserInfo(payload) {
    return fetch('http://123.207.41.132:8080/updateUserInfo', payload, 'post');
  },
  toLogin(payload) {
    return fetch('http://123.207.41.132:8080/login', payload, 'post');
  },
  toRegister(payload) {
    return fetch('http://123.207.41.132:8080/register', payload, 'post');
  },
  getUserList(payload) {
    return fetch('http://123.207.41.132:8080/getUserList', payload, 'post');
  },
};

