import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StackNavigator,
  TabNavigator,
  addNavigationHelpers,
  NavigationActions,
} from 'react-navigation';
import { StyleSheet, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import Intro from './routes/Intro';
import Login from './routes/login';
import Register from './routes/register';
import InitCategory from './routes/InitCategory';
import Mine from './routes/Home/Mine';
import Category from './routes/Home/Category';
import Feedback from './routes/Home/Feedback';
import About from './routes/Home/About';
import Web from './routes/Web';
import AboutMe from './routes/AboutMe';
import UserDetail from './routes/UserDetail';

const TabContainer = TabNavigator(
  {
    Mine: { screen: Mine },
    Category: { screen: Category },
    Feedback: { screen: Feedback },
    About: { screen: About },
  },
  {
    tabBarPosition: 'bottom',
    // initialRouteName:'About',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
    backBehavior: 'none',
    tabBarOptions: {
      backBehavior: 'none',
      activeTintColor: '#3e9ce9',
      inactiveTintColor: '#999999',
      showLabel: true,
      showIcon: true,
      upperCaseLabel: false,
      scrollEnabled: false,
      indicatorStyle: {
        opacity: 0,
      },
      style: {
        backgroundColor: '#fff',
      },
      iconStyle: {
        marginTop: 0,
      },
      labelStyle: {
        fontSize: 14,
        marginTop: 0,
      },
      tabStyle: {
        padding: 0,
      },
    },
  },
);

const AppNavigation = StackNavigator(
  {
    Intro: {
      screen: Intro,
    },
    Login: {
      screen: Login,
    },
    Register: {
      screen: Register,
    },
    InitCategory: {
      screen: InitCategory,
      navigationOptions: {
        header: null,
      },
    },
    Home: {
      screen: TabContainer,
    },
    Web: { screen: Web },
    AboutMe: { screen: AboutMe },
    UserDetail: { screen: UserDetail },
  },
  {
    mode: 'card',
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#3e9ce9',
      },
      headerTitleStyle: {
        fontSize: 20,
        color: '#fff',
      },
      headerTintColor: '#fff',
      gesturesEnabled: false,
    },
  },
);

const getCurrentScreen = (navigationState) => {
  if (!navigationState) return null;
  const route = navigationState.routes[navigationState.index];
  // 判断当前route是否含有routes集合
  if (route.routes) return getCurrentScreen(route);
  return route.routeName;
};

@connect(({ router }) => ({ router }))
export default class Router extends PureComponent {
  static propTypes = {}
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.BackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.BackPress);
  }

  BackPress = () => {
    const currentScreen = getCurrentScreen(this.props.router);
    if (
      currentScreen === 'InitCategory' ||
      currentScreen === 'Login' ||
      currentScreen === 'Register' ||
      currentScreen === 'Mine' ||
      currentScreen === 'Category' ||
      currentScreen === 'Feedback' ||
      currentScreen === 'About'
    ) {
      return false;
    } else if (currentScreen === 'Intro') {
      return true;
    }
    this.props.dispatch(NavigationActions.back());
    return true;
  }

  render() {
    const { dispatch, router } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: router,
    });

    return <AppNavigation navigation={navigation} />;
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigation.router.getStateForAction(action, state);
}
