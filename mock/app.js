const Koa = require('koa');
const Router = require('koa-router');
const view = require('koa-view');
const convert = require('koa-convert');
const static = require('koa-static');
const session = require('koa-session-minimal');
const path = require('path');
const fs = require('fs');
const FILEPATH = '../mock_files';
const parsePostData = require('./utils/parsePostData');
const db = require('./utils/db');
const uploadFile = require('./utils/uploadFile');
const format = require('./utils/format');

const app = new Koa();
const router = new Router();


app.use(view(path.join(__dirname, './views'), { extension: 'ejs' }));

app.use(convert(
  static(path.join(__dirname, './static'))
));

app.use(router.routes())
   .use(router.allowedMethods());

app.use(session({
  key: 'SESSION_ID',
  cookie: {
    domain: '123.207.41.132', // 192.168.0.110
    path: '/',
    maxAge: 60 * 60 * 1000 * 2,
    httpOnly: true,
    overwrite: false,
    secure: false,
  },
}));

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Time-Response', `${ms}ms`);
});

app.use(async (ctx, next) => {
  const n = (+ctx.cookies.get('session_id') || 0) + 1;
  ctx.cookies.set('session_id', n);
  next();
});

router.post('/category', async (ctx, next) => {
  const dirName = path.join(__dirname, FILEPATH, 'category');
  const data = format.category;
  ctx.body = {
    code: 0,
    msg: 'SUCCESS',
    data,
  };
});

router.post('/news', async (ctx, next) => {
  const reqData = await parsePostData(ctx);
  const { id, pageNum, pageSize } = reqData;
  const options = {
    skip: (pageNum - 1) * pageSize,
    limit: pageSize,
  };
  const dataBase = await db.find(id, {}, options);
  const total = await db.count(id);
  ctx.body = {
    code: 0,
    msg: 'SUCCESS',
    data: {
      content: dataBase,
      total,
      pageNum,
    },
  };
});

router.post('/avator', async (ctx, next) => {
  const storagePath = path.join(__dirname, './static/avator');
  const result = await uploadFile(ctx, storagePath);
  if (result.code === 1) {
    const data = await db.find('userBaseInfo', { userMobile: result.data.id });
    if (data) {
      const isSuccess = await db.update('userBaseInfo', { userMobile: result.data.id }, {
        ...data[0],
        avatorURI: result.data.uri,
      });
      if (!isSuccess) {
        result.code = 0;
        result.msg = 'ERROR',
        result.data = null;
      }
    }
  }
  ctx.body = result;
});



router.post('/getUserInfo', async (ctx, next) => {
  const reqData = await parsePostData(ctx);
  const { userMobile } = reqData;
  const userInfo = await db.find('userBaseInfo', { userMobile });
  const result = {
    code: 0,
    msg: 'ERROR',
    data: null,
  };
  if (userInfo) {
    result.code = 1;
    result.msg = 'SUCCESS',
    result.data = userInfo[0];
  }
  ctx.body = result;
});

router.post('/updateUserInfo', async (ctx, next) => {
  const reqData = await parsePostData(ctx);
  const { userMobile } = reqData;
  const info = await db.update('userBaseInfo', { userMobile }, reqData);
  console.log(info)
  const result = {
    code: 0,
    msg: 'ERROR',
    data: {
      message: 'ERROR',
    },
  };
  if (info) {
    result.code = 1;
    result.msg = 'SUCCESS',
    result.data = {
      message: 'SUCCESS',
    };
  }
  ctx.body = result;
});

router.post('/login', async (ctx, next) => {
  const reqData = await parsePostData(ctx);
  console.log(reqData)
  const { userName, userMobile } = reqData;
  const userInfo = await db.find('userList', { userMobile });
  const result = {
    code: 0,
    msg: 'ERROR',
    data: null,
  };
  if (userInfo) {
    if (userInfo.length === 1) {
      if (userName === userInfo[0].userName) {
        result.code = 1;
        result.msg = 'SUCCESS',
        result.data = {
          message: 'SUCCESS',
        };
      } else {
        result.code = 0;
        result.msg = 'ERROR',
        result.data = {
          message: '用户名不匹配',
        };
      }
    } else {
      result.code = 0;
      result.msg = 'ERROR',
      result.data = {
        message: '该用户还未注册',
      };
    }
  }
  ctx.body = result;
});

router.post('/register', async (ctx, next) => {
  const reqData = await parsePostData(ctx);
  const { userName, userMobile } = reqData;
  const userInfo = await db.find('userList', { userMobile });
  const result = {
    code: 0,
    msg: 'ERROR',
    data: null,
  };
  if (userInfo) {
    if (userInfo.length === 0) {
      const [isOkOne, isOkTwo] = await Promise.all([
        db.insert('userBaseInfo', {
          ...format.userInfo,
          userName,
          userMobile,
        }),
        db.insert('userList', {
          userName,
          userMobile,
        }),
      ]);
      if (isOkOne && isOkTwo) {
        result.code = 1;
        result.msg = 'SUCCESS',
        result.data = {
          message: 'SUCCESS',
        };
      }
    } else {
      result.code = 0;
      result.msg = 'ERROR',
      result.data = {
        message: '该用户已存在',
      };
    }
  }
  ctx.body = result;
});



app.listen(8080, function() {
  console.log('server started at the 8080 port!');
})

