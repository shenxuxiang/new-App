import React from 'react';
import { create } from 'dva-core';
import { Provider } from 'react-redux';

export default function (options) {
  const app = create(options);
  if (!global.registered) options.models.forEach(model => app.model(model));
  global.registered = true;
  app.start();
  const store = app._store;
  app.start = container => () => <Provider store={store}>{container}</Provider>;
  app.getStore = () => store;
  return app;
}
