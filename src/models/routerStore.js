import { NavigationActions } from 'react-navigation';
import { routerReducer } from '../Router';
import { delay } from '../utils';

const actions = [
  NavigationActions.BACK,
  NavigationActions.INIT,
  NavigationActions.NAVIGATE,
  NavigationActions.RESET,
  NavigationActions.SET_PARAMS,
  NavigationActions.URI,
];

export default {
  namespace: 'router',
  state: {
    ...routerReducer(),
  },
  reducers: {
    apply(state, { payload }) {
      return routerReducer(state, payload);
    },
  },
  effects: {
    watch: [
      function* watch({ take, call, put }) {
        while (true) {
          const payload = yield take(actions);
          yield put({
            type: 'apply',
            payload,
          });
          if (payload.type === 'Navigation/NAVIGATE') {
            yield call(delay, 500);
          }
        }
      }, { type: 'watcher' },
    ],
  },
};
