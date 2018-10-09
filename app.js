//app.js
App({
  onLaunch: function() {
    var that = this;
    // 展示本地存储能力
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.globalData.token = res.data;
      },
    });
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },

  globalData: {
    baseUrl: 'https://ssl.ygwl.xin',
    // baseUrl: 'https://xcx.qsssl.com',
    // baseUrl: 'http://ssllocal.ygwl.xin',
    token: null,
    invite: 0,
    lat: '0',
    lng: "0",
    hasMask: "",
    firstLaunch: false
  }
})