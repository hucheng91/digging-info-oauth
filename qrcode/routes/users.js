const express = require('express');
const router = express.Router();
const axios = require('axios');
var path = require('path');
let IS_LOGIN = false;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res, next) => {
  const userName = req.body.userName;
  IS_LOGIN = true;
  res.send({ status: 1 });
});

router.get('/isLogin', async (req, res, next) => {
  res.send({ status: 1, islogin: IS_LOGIN });
})

module.exports = router;
