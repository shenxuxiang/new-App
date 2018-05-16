import apis from '../apis';

const EMPTY_LIST = [];
const EMPTY_OBJ = {};

export default {
  namespace: 'userInfo',
  state: {
    avator: EMPTY_OBJ,
    userInfo: EMPTY_OBJ,
    submitResult: EMPTY_OBJ,
    userList: EMPTY_LIST,
    userDetail: EMPTY_OBJ,
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
    getUserDetailSuccess(state, { payload }) {
      const { data = EMPTY_OBJ } = payload;
      return {
        ...state,
        userDetail: data,
      };
    },
    submitUserInfoSuccess(state, { payload }) {
      const { data = EMPTY_OBJ } = payload;
      return {
        ...state,
        submitResult: data,
      };
    },
    getUserListSuccess(state, { payload }) {
      const { data = EMPTY_OBJ } = payload;
      return {
        ...state,
        userList: data,
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
    * getUserDetail({ payload }, { call, put }) {
      const response = yield call(apis.getUserInfo, payload);
      yield put({
        type: 'getUserDetailSuccess',
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
    * getUserList({ payload }, { call, put }) {
      const response = yield call(apis.getUserList, payload);
      yield put({
        type: 'getUserListSuccess',
        payload: response,
      });
    },
  },
  subscriptions: {},
};
