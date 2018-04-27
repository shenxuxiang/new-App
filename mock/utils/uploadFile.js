const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

/**
 * 获取文件的后缀名 例如： .html
 * @params { string } fileName 文件名称
 * @return { string }
 */
function getSuffixName(fileName) {
  return path.extname(fileName);
}
/**
 * 获取路径的上一级目录 './admin/user/sxx/' => './admin/user'
 * @params { string } dirname 路径
 * @return { string }
 */
function getParentDirectory(dirname) {
  const arr = dirname.split("\\");
  if (dirname.lastIndexOf('\\') === dirname.length - 1) {
    arr.pop();
  }
  const len = arr.length;
  let dirPath = '';
  arr.forEach((item, index) => {
    if (item && index < len - 1) {
      dirPath += `${item}/`;
    }
  })
  return path.join(dirPath);
}
/**
 * 创建文件路径 没有就创建一个
 * @params { string } dirname
 * @return { bool }
 */
function mkdirSync(pathName) {
  if (fs.existsSync(pathName)) return true;

  const parentDirectory = getParentDirectory(pathName);

  if (fs.existsSync(parentDirectory)) {
    console.log('ok', parentDirectory);
    fs.mkdirSync(path.join(pathName));
    return true;
  } else {
    return mkdirSync(path.join(parentDirectory));
  }
}

// 清空目录下的所有文件
function emptyDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  if (files.length <= 0) return;
  files.forEach((file) => {
    fs.unlinkSync(path.join(dirPath, file));
  });
}

/**
 * 上传文件
 * @params { object } ctx         koa上下文
 * @params { string } storagePath 存储路径
 * @return { promise }
 */
function uploadFile(ctx, storagePath) {
  const req = ctx.req;
  const res = ctx.res;
  const busboy = new Busboy({headers: req.headers});
  const result = {
    code: 0,
    msg: 'ERROR',
    data: null,
  };
  const savePath = path.join(storagePath);
  const mkdirResult = mkdirSync(savePath);
  // 用户的id
  let id;
  // 文件的名称
  let fileName;
  // 文件上传的路径
  let dir;

  return new Promise((resolve, reject) => {
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('文件开始上传了...');
      fileName = `${Math.random().toString().slice(2)}.${filename}`;
      dir = path.join(savePath, fileName);
      file.pipe(fs.createWriteStream(dir));

      file.on('end', function() {
        console.log('文件上传成功！！！');
      });
    });

    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      id = val;
      // 路径 每个用户只有一个且唯一的文件夹
      const dirName = path.join(savePath, id);
      // 没有的话 就创建一个
      const isTrue = mkdirSync(dirName);
      // 每次都清空里面的文件
      emptyDir(dirName);
      // 指定复制的路径
      const newDir = path.join(dirName, fileName);
      // 将上传的文件复制到用户指定的文件夹中
      fs.renameSync(dir, newDir);
    });

    busboy.on('finish', function() {
      result.code = 1;
      result.msg = 'SUCCESS';
      result.data = {
        uri: `http://123.207.41.132:8080/avator/${id}/${fileName}`, // 192.168.0.100:8080
        id,
      };
      resolve(result);
      console.log('文件上传结束！！！');
    });

    busboy.on('error', function(err) {
      reject(result);
    });

    req.pipe(busboy);
  })
}
module.exports = uploadFile
