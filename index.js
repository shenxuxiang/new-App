import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
// import 'babel-polyfill';
import dva from './src/utils/dva';
import logger from 'redux-logger';
import appStore from './src/models/appStore';
import routerStore from './src/models/routerStore';
import newsStore from './src/models/newsStore';
import userInfoStore from './src/models/userInfoStore';
import Router from './src/Router';
import { Toast } from './src/utils';
const app = dva({
  models: [appStore, newsStore, routerStore, userInfoStore],
  // onAction: [logger],
  onError: err => Toast.showShort(err.msg),
});

const App = app.start(<Router />)

AppRegistry.registerComponent('news', () => App);

// if (__DEV__) {
//   GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
// }
