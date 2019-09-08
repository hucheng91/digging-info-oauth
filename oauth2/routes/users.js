/*
 * @Author: hucheng
 * @Date: 2019-09-08 08:59:13
 * @Description: here is des
 */
const express = require('express');
const router = express.Router();
const axios = require('axios');
var path = require('path');

const client_id = "a08c4b054db89ccccfce";
const client_secret = "c2bee2c7c0f3e2eb20c1364f42babb35d792ef4c";
const redirect_uri = "http://127.0.0.1:3009/users/oauth";
let access_token;
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
/**
 * 重定向到github
 */
router.post('/login', async (req, res, next) => {
  const url = `//github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`;
  res.send({ status: 302, url: url });
});
/**
 * github 认证后的回调地址
 */
router.get('/oauth', async (req, res, next) => {
  const token = req.query.code;
  const acccessTokenUrl = `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${token}`;
  // 获取 accessToken,这个就是我们之后请求API的令牌
  const accessToken = await axios({
    method: 'post',
    url: acccessTokenUrl,
    headers: {
      accept: 'application/json'
    }
  }).then(res => res.data.access_token);

  access_token = accessToken;
  console.log(access_token);
  // 根据accessToken 获取用户信息
  res.sendFile('user.html', { root: path.resolve(__dirname, '../') + '/public/' });
})
router.get('/getUserInfo', async (req, res, next) => {
  const info = await axios.get(`https://api.github.com/users/hucheng91?access_token=${access_token}`).then(res => res.data);
  res.cookie('user', info.login)
  res.send({ user: info });
});



module.exports = router;
