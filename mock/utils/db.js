const url = 'localhost/dataBase';
const db = require('monk')(url);

// 体育迷
const collection_001 = db.get('physical');
// 私房话
const collection_004 = db.get('private');
// 财经迷
const collection_007 = db.get('finance');
// 潮人版
const collection_010 = db.get('hipster');
// 用户列表
const collection_userList = db.get('userList');
//用户信息
const collection_userBaseInfo = db.get('userBaseInfo');

// 确保是否已经创建索引值 没有就创建一个
function ensureIndex(collection) {
  collection.ensureIndex('id')
    .then(() => {
      console.log('索引创建完成， 如果没有索引则创建一个！！！');
    });
};

ensureIndex(collection_001);
ensureIndex(collection_004);
ensureIndex(collection_007);
ensureIndex(collection_010);
ensureIndex(collection_userList);
ensureIndex(collection_userBaseInfo);

// 执行数据库查询
function getResult(collection, method, searchObj = {}, options = {}) {
  return new Promise((resolve, reject) => {
    collection[method](searchObj, options)
      .then(data => resolve(data))
      .catch(err => reject(null));
  })
}
// 查询相关数据
const toSearchDatabase = (method) => (type, searchObj, options = {}) => {
  let collection;
  switch (type) {
    case '001':
      collection = collection_001;
      break;
    case '004':
      collection = collection_004;
      break;
    case '007':
      collection = collection_007;
      break;
    case '010':
      collection = collection_010;
      break;
    case 'userList':
      collection = collection_userList;
      break;
    case 'userBaseInfo':
      collection = collection_userBaseInfo;
      break;
    default: break;
  }
  return getResult(collection, method, searchObj, options);
};

const updateInfo = (type, searchObj, updateObj, options = { upsert: true }) => {
  let collection;
  switch (type) {
    case 'userList':
      collection = collection_userList;
      break;
    case 'userBaseInfo':
      collection = collection_userBaseInfo;
      break;
    default: break;
  };
  return new Promise((resolve, reject) => {
    collection.update(searchObj, updateObj, options)
      .then(() => resolve(true))
      .catch(err => reject(false));
  });
};

exports.find = toSearchDatabase('find');
exports.distinct = toSearchDatabase('distinct');
exports.findOneAndDelete = toSearchDatabase('findOneAndDelete');
exports.insert = toSearchDatabase('insert');
exports.remove = toSearchDatabase('remove');
exports.count = toSearchDatabase('count');
exports.update = updateInfo;
