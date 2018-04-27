function parsePostData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let result = '';
      ctx.req.addListener('data', function(data) {
        result += data;
      });
      ctx.req.addListener('end', function() {
        resolve(JSON.parse(result));
      });
    } catch(err) {
      reject(err);
    }
  });
}

module.exports = parsePostData;
