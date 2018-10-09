// pages/login/login.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    send: true,
    alreadySend: false,
    second: 120,
    disabled: true,
    buttonType: 'default',
    phoneNum: '',
    code: '',
    nickName: '',
    avatar: '',
    captcha: '',
    invite: '',
    userInfo: {},
    checked: true,
    title: '用户协议',
    content: ""
  },

  // 手机号部分
  inputPhoneNum: function(e) {

    this.setData({
      phoneNum: e.detail.value
    })
    console.log(this.data.phoneNum)
  },
  showSendMsg: function() {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },

  hideSendMsg: function() {
    this.setData({
      send: false,
    })
  },

  // checkboxChange:function(){
  //   this.setData({
  //     checked: !checked,
  //   })
  //   console.log(this.data.ckeched)
  // },
  // 获取短信接口
  sendMsg: function() {
    if (this.data.phoneNum == "") {
      wx.showToast({
        title: '请输入您的手机号码!',
        icon: "none"
      })
      return false
    } else {
      var that = this;
      wx.showLoading({
        title: '加载中',
      });
      wx.request({
        url: app.globalData.baseUrl + '/Captcha/Sms',
        data: {
          mobile: this.data.phoneNum
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function(res) {
          if (res.data.success) {
            that.setData({
              alreadySend: true,
              send: false
            })
            that.timer()
            setTimeout(() => {
              wx.showToast({
                title: "发送成功！",
                icon: 'success'
              })
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }, 0);
          } else {
            setTimeout(() => {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              setTimeout(() => {
                wx.hideToast();
              }, 3000)
            }, 0);
          }
        },
        complete: function() {
          wx.hideLoading();
        }
      })
    }
  },

  timer: function() {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 120,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  // 验证码
  addCode: function(e) {
    this.setData({
      captcha: e.detail.value
    })
    // console.log('captcha' + this.data.captcha)
  },

  checkboxChange: function() {
    this.setData({
      checked: !this.data.checked
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;

  },

  getUserInfo: function(e) {
    var that = this;
    console.log(that.data.checked)

    if (that.data.checked == false) {
      wx.showToast({
        title: '您还没同意用户协议！',
        icon: "none"
      })
      return false
    } else {
      console.log(that.data.phoneNum)
      if (e.detail.userInfo) {
        if (this.data.phoneNum == "") {
          wx.showToast({
            title: '请输入手机号码!',
            icon: "none"
          })
          return false
        }
        if (this.data.captcha == "") {
          wx.showToast({
            title: '请输入验证码!',
            icon: "none"
          })
          return false
        }
        wx.getSetting({
          success() {
            wx.login({
              success: function(resp) {
                if (resp.code) {
                  wx.showLoading({
                    title: '加载中',
                  });
                  wx.request({
                    //后台接口地址
                    url: app.globalData.baseUrl + '/Login',
                    data: {
                      mobile: that.data.phoneNum,
                      captcha: that.data.captcha,
                      nickName: e.detail.userInfo.nickName,
                      avatar: e.detail.userInfo.avatarUrl,
                      code: resp.code,
                      invite: app.globalData.invite
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function(res) {
                      if (res.data.success) {
                        app.globalData.isFromLogin = false;
                        setTimeout(() => {
                          wx.showToast({
                            title: "发送成功！",
                            icon: 'success'
                          })
                          setTimeout(() => {
                            wx.hideToast();
                          }, 3000)
                        }, 0);
                        app.globalData.token = res.data.token;
                        wx.setStorage({
                          key: 'token',
                          data: res.data.token
                        });
                        wx.navigateBack({
                          delta: 1
                        })
                      } else {
                        setTimeout(() => {
                          wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                          })
                          setTimeout(() => {
                            wx.hideToast();
                          }, 3000)
                        }, 0);
                      }
                    }

                  })
                } else {
                  console.log('登录失败！' + res.errMsg)
                }

              }

            })
          }
        })

        // 发送 res.code 到后台换取 openId, sessionKey, unionId

      } else {
        console.log('未授权')
        wx.showToast({
          title: '尚未进行授权',
          icon: "none"
        })
      }
    }
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
  },
  showDialog: function() {
    this.setData({
      hasMask: true
    })

    this.dialog.showDialog();

  },
  //关闭事件
  _confirmEvent() {
    this.setData({
      hasMask: false
    })
    this.dialog.hideDialog();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("login.onShow");
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/Login/Protocol',
      success: function(res) {
        if (res.data.success) {
          console.log(res)
          that.setData({
            content: res.data.data
          });

        } else {
          setTimeout(() => {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            setTimeout(() => {
              wx.hideToast();
            }, 3000)
          }, 0);
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onShareAppMessage: function (res) {
    return {
      title: '千色色沙拉会员+',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})