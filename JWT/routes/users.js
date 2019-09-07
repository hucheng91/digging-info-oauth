var express = require('express');
var router = express.Router();
const jws = require('jws');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res, next) => {
  const signature = jws.sign({
    header: { alg: 'HS256' },
    payload: { name: req.body.userName,
      userId: req.body.userName,
      exp: new Date()  // 过期时间
    },
    secret: '1233',
  });
  res.send({ jwt: signature });
});
router.get('/list', async (req, res, next) => {
  const jwt = req.headers.authorization;
  if (!jwt  ) {
    console.log("未登录"); // 跳到登陆的地方
  }
  res.send([{ userName: "王五" }, { userName: "赵六" }]);
});
module.exports = router;
