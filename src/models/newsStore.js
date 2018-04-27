import apis from '../apis';

const EMPTY_LIST = [];
const EMPTY_OBJ = {};

export default {
  namespace: 'news',
  state: {
    news_001: EMPTY_OBJ,
    news_004: EMPTY_OBJ,
    news_007: EMPTY_OBJ,
    news_010: EMPTY_OBJ,
  },
  reducers: {
    refreshingNewsSuccess(state, { payload }) {
      const { id, content } = payload;
      const { data = EMPTY_OBJ } = content;
      return {
        ...state,
        [`news_${id}`]: data,
      };
    },
  },
  effects: {
    * refreshingNews({ payload }, { call, put }) {
      const response = yield call(apis.refreshingNews, payload);
      yield put({
        type: 'refreshingNewsSuccess',
        payload: {
          content: response,
          id: payload.id,
        },
      });
    }
  },
  subscriptions: {},
};
