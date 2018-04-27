import apis from '../apis';

const EMPTY_LIST = [];
const EMPTY_OBJ = {};

export default {
  namespace: 'userInfo',
  state: {
    avator: EMPTY_OBJ,
    userInfo: EMPTY_OBJ,
    submitResult: EMPTY_OBJ,
  },
  reducers: {
    updateAvatorSuccess(state, { payload }) {
      const { data = EMPTY_OBJ } = payload;
      return {
        ...state,
        avator: data,
      };
    },
    getUserInfoSuccess(state, { payload }) {
      const { data = EMPTY_OBJ } = payload;
      return {
        ...state,
        userInfo: data,
      };
    },
    submitUserInfoSuccess(state, { payload }) {
      const { data = EMPTY_OBJ } = payload;
      return {
        ...state,
        submitResult: data,
      };
    },
  },
  effects: {
    * updateAvator({ payload }, { call, put }) {
      const response = yield call(apis.updateAvator, payload);
      yield put({
        type: 'updateAvatorSuccess',
        payload: response,
      });
    },
    * getUserInfo({ payload }, { call, put }) {
      const response = yield call(apis.getUserInfo, payload);
      yield put({
        type: 'getUserInfoSuccess',
        payload: response,
      });
    },
    * submitUserInfo({ payload }, { call, put }) {
      const response = yield call(apis.submitUserInfo, payload);
      yield put({
        type: 'submitUserInfoSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
