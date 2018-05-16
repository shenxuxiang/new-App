import apis from '../apis';

const EMPTY_LIST = [];
const EMPTY_OBJ = {};

export default {
  namespace: 'app',
  state: {
    category: EMPTY_LIST,
    login: EMPTY_OBJ,
    register: EMPTY_OBJ,
  },
  reducers: {
    getCategorySuccess(state, { payload }) {
      const { data = EMPTY_LIST } = payload;
      return {
        ...state,
        category: data,
      };
    },
    loginSuccess(state, { payload }) {
      const { data = EMPTY_OBJ } = payload;
      return {
        ...state,
        login: data,
      };
    },
    registerSuccess(state, { payload }) {
      const { data = EMPTY_OBJ } = payload;
      return {
        ...state,
        register: data,
      };
    },
  },
  effects: {
    * getCategory({ payload }, { call, put }) {
      const response = yield call(apis.getCategory, payload);
      yield put({
        type: 'getCategorySuccess',
        payload: response,
      });
    },
    * toLogin({ payload }, { call, put }) {
      const response = yield call(apis.toLogin, payload);
      yield put({
        type: 'loginSuccess',
        payload: response,
      });
    },
    * toRegister({ payload }, { call, put }) {
      const response = yield call(apis.toRegister, payload);
      yield put({
        type: 'registerSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
