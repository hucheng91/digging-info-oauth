<!--
 * @Author: hucheng
 * @Date: 2019-09-08 17:16:26
 * @Description: here is des
 -->
# sso 单点登录

单点登录是我这讲的这些认证方式里面最复杂的，实现方式也很多，我们前端要知道
什么是单点登录，它适用的场景是什么，不用去扣代码实现

公司发展越来越大，每个内部系统使用起来都要登录一遍是不是很烦，比方我司系统都是企业微信扫码登录的，每个系统都要扫一次
是件很烦的事，能不能在一个地方登录了，其他系统进入的时候就知道了已经登录了，相当各个个系统 共享 session，那这种场景就适合单点登录了

单点登录 英文全称是 Single Sign On，简称就是 SSO，解释就是说：在多个应用系统中，只需要登录一次，就可以访问其他相互信任的应用系统

注意哈，这个和 Oauth2 的差别哈，Oauth2 是解决 第三方授权登录，SSO是为了解决 内部系统 一次登录 到处使用，共享 session 的问题，

有的人会讲，小编在 cookie， session 那一节 不是说 存储sesson，有状态不好码，注意了，SSO 主要在内部系统，内部系统的人撑破天 50 万，这个是没问题

session 是不适合 日活上百万的，所有说不同的技术有不同使用场景，脱离了业务场景，说哪个技术厉害就是耍流氓，就像网上的喷子天天讨论 `Vue,React,Angular` 
哪个厉害，无聊，没有业务场景，就没有讨论价值

我们先讲讲下 SSO 通过 cookie 最简单的实现方式

比方我们现在有 app1.a.com 营销管理平台，app2.a.com 投诉管理平台，app3.a.com 企业oa管理平台，
大家还记得我们在 cookie 那篇讲过， cookie 有个 domain 属性，如果我把 domain 设置成 `a.com`, 
这样的话，这个 cookie 就能同时被上面 3 个域名同时获取到，那不就解决了三个系统之间传递信息了，把用户登录状态放在
这个 cookie 就好了，那现在需要解决的是 上面3个系统怎么来标记 通过这个cookie来获取到对应的用户信息，用户的seeesion 问题了

那要是我们有个 专门保存 session 的系统不就可以了么，每个系统拿着 同一个cookie 去这个 session 服务器获取信息不就好了
上面这种就是最简单版的 SSO 了，大部分公司就是用的这套，贴个图

![sso.png-24.1kB][1]

看这幅图就基本明白了，Common Session 服务起负责存储 session，每个系统去它拿就好了，在浏览器端显示的就是 你在 app1.a.com 登录的时候，会跳转到 session 那台服务器，登录后，设置一个 cookie ，domain 设置成 a.com,然后跳转回去 app1.a.com, app1的后端通过cookie 去 common session 获取 用户信息，用户状态

那要是2个系统在不同的一级域名下怎么办呀？

## 不同域名下的 SSO
oauth2 里获取 accesstoken(还记得吧，这个地方派上用场了)
app1 可以通过 oauth2的方式 去获得这个 cookie，存到a的域名下，同样拿着这个 cookie 去 common session 服务器获取用户信息，这里不清楚 oauth2 要去看看之前那篇 写 oauth2 的

当然我这里是把整个流程梳理了，这里面其实还有很多细节点，比如 cookie 检验的问题，session 过去的问题，不通过页面，后端直接跳转的问题，权限问题，这些是细节，我这里就不讲，这些后端涉及更多，我们要理解的是这整个流程

## 总结

- SSO 是解决 只需要登录一次，就可以访问其他相互信任的应用系统
- SSO 适合公司内部多系统

如果你喜欢也可以关注我的 公众号 「chromedev」
![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b7bf97692233?w=258&h=258&f=jpeg&s=18523)
  [1]: http://static.zybuluo.com/hucheng91/zydphwffqtqvkrz98prno6zu/sso.png