<!--
 * @Author: hucheng
 * @Date: 2019-09-08 08:54:54
 * @Description: here is des
 -->
# oauth2 认证(附 github 登录 demo)

[理解用户认证鉴权1-cookie session](https://juejin.im/post/5d7393006fb9a06b1c7450ed)

[理解用户认证鉴权2-JWT ，Token 认证](https://juejin.im/post/5d73bba66fb9a06acc00aa40)

我们在很多站上都能看到类似下面的第三方登录的，他们是怎么实现的勒？

![oauth2.png-115kB][1]


这种基本都是 oauth2 登录，表现形式是，点击跳转到第三方页面，然后再跳转回来，一般大公司内部系统的鉴权也喜欢用 oauth2登录，今天小编就聊聊这个，然后用 写个 基于 github 的登录

## 定义
OAuth（开放授权）是一个开放标准，允许用户让第三方应用访问该用户在某一网站上存储的私密的资源（如照片，视频，联系人列表），而无需将用户名和密码提供给第三方应用。

允许用户提供一个令牌，而不是用户名和密码来访问他们存放在特定服务提供者的数据。每一个令牌授权一个特定的网站（例如，视频编辑网站)在特定的时段（例如，接下来的2小时内）内访问特定的资源（例如仅仅是某一相册中的视频）。这样，OAuth允许用户授权第三方网站访问他们存储在另外的服务提供者上的信息，而不需要分享他们的访问许可或他们数据的所有内容。
OAuth2.0官方文档为：https://tools.ietf.org/html/rfc6749
> 为什么是OAuth2.0呢？其实是有1和1.1版本的，只是因为1和1.1版本流程比较复杂，应用不是很广泛。

## 整体大致流程

![640.png-33.8kB][2]

简单的讲，就是你的先去第三方 申请注册下面三个东西
```
const client_id = "xx";
const client_secret = "xx";
const redirect_uri = "http://127.0.0.1:3009/users/oauth";
```
用户在页面点击登录后，后端会拿着上面这三样东西，拼接一个地址，跳转到第三方，第三方校验
`client_id,client_secret,redirect_uri`,通过后，第三方回调 redirect_uri，在url后面带上 `token`, 拿着 token 和client_secret，去第三方获取 acccessToken， 然后系统就可以拿着 `acccessToken`去第三方获取用户信息，然后放如 cookie

这样的好处就是，你的系统不需要一个维护用户登录的的数据库表，系统多起来了，就非常方便，大家都去一个地方获取用户信息，后面衍生的 网关的概念，是把用户的权限都管理起来了

下面我基于 github 的登录，写的一个 example，帮助大家理解 oauth2，文章末尾我会留下 github 地址，你可以本地跑一下，加深理解

### 第一步 申请3大件
github 左上角 用户头像下拉 => Settings => Developer settings => Oauth App => New Oauth App , 填写网站的域名，回调地址,贴下我最后生成的

![github_oauth2.png-95.1kB][3]

下面是本地代码实现
```javascript
 // login.html
 <button @click="login>github登录</button>

 function login(){
     axios.post("/users/login").then(res => {});
 }
 // 后端 api 实现

const client_id = "xx"; // 这里是github 生成的，从图上 copy 下来
const client_secret = "xxx"; // 同上
const redirect_uri = "http://127.0.0.1:3009/users/oauth"; // 在github里填的 callback url
const githubAuthorizeUrl = "http://github.com/login/oauth/authorize?"
let access_token;

/**
 * 重定向到github
 */
router.post('/login', async (req, res, next) => {
   // 这里拿着 上面 client_id 302 重定向到 github，也就是我们常看到的 github那个 授权头像位置
  const url = `${githubAuthorizeUrl}client_id=${client_id}&redirect_uri=${redirect_uri}`;
  res.send({ status: 302, url: url });
});
```

### 第二步，点击github 授权，授权后重定向到上面写的 redirect_uri ，带上 token


![github_oauth_2.png-203.1kB][4]

点击上面 Authorize 会校验你的 redirect_uri 是不是一致，一致后跳转，代码如下
```
/**
 * github 认证后的回调地址
 */
router.get('/oauth', async (req, res, next) => {
  let accessTokenUrl = 'https://github.com/login/oauth/access_token?'
  const token = req.query.code;
  const acccessTokenUrl = `${accessTokenUrl}client_id=${client_id}&client_secret=${client_secret}&code=${token}`;
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

```

这样就获取到了关键的 accessToken，有了令牌我们就可以调用 github 的 api 

### 第三步 通过 accessToken 调用 API

![oauth2_step3.png-424.3kB][5]

我这里通过 api 获取了下用户信息
```
router.get('/getUserInfo', async (req, res, next) => {
  const info = await axios.get(`https://api.github.com/users/hucheng91?access_token=${access_token}`).then(res => res.data);
  res.cookie('user', info.login)
  res.send({ user: info });
});
```

整个 oauth2 的认证流程就走完了，理清了，oauth2 在工作用用到最多，如果只是写页面的话，用到比较少，但弄清楚搞明白还是很有必要的的，这样和后端开发沟通起来也方便很多

## demo
https://github.com/hucheng91/digging-info-oauth

如果你喜欢也可以关注我的 公众号 「chromedev」
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b7bf97692233?w=258&h=258&f=jpeg&s=18523)


  [1]: https://user-gold-cdn.xitu.io/2019/9/8/16d10051cce3d9be?w=636&h=910&f=png&s=117780
  [2]: https://user-gold-cdn.xitu.io/2019/9/8/16d10051cd3c3103?w=906&h=416&f=png&s=34626
  [3]: https://user-gold-cdn.xitu.io/2019/9/8/16d10051d1f29d39?w=1011&h=694&f=png&s=97378
  [4]: https://user-gold-cdn.xitu.io/2019/9/8/16d1007c21160cc2?w=1023&h=695&f=png&s=208001
  [5]: https://user-gold-cdn.xitu.io/2019/9/8/16d10051ccfff06f?w=549&h=590&f=png&s=434446