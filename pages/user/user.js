
const app = getApp()

Page({
  data: {
    tabId: 1, //排序索引
    tabIndex: 0,
    avatarUrl: '',
    nickName: '',
    title: '会员权益',

    hasUserInfo: false,
    money: '',
    point: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    footerTab: [{
        id: 1,
        pic: '/images/home_icon.png'
      },
      {
        id: 2,
        pic: '/images/user_icon.png',
        active: "active"
      }
    ],
    token: "",
    userInfo: {},
    isCharge: "",
    isExpire: false
  },
  Navigation: function(e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset)
    var that = this

    if (e.currentTarget.dataset.id == 1) {
      wx.reLaunch({
        url: '../index/index'
      })

    } else if (e.currentTarget.dataset.id == 2) {

    }


  },
  newUser: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/User/New_Reward',
      header: {
        'content-type': 'application/json', // 默认值
        "token": app.globalData.token
      },
      method: 'POST',
      success: function(res) {
        if (res.data.success) {
          setTimeout(() => {
            wx.showToast({
              duration: 3000,
              title: res.data.msg,
              icon: 'none'
            })
          }, 0);
        } else {
          if (res.data.needLogin) {
            wx.navigateTo({
              url: '../login/login'
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
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  onShow: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/User',
      header: {
        'content-type': 'application/json', // 默认值
        "token": app.globalData.token
      },
      method: 'GET',
      success: function(res) {
        if (res.data.success) {
          console.log(res)
          that.setData({
            money: res.data.data.money,
            point: res.data.data.point,
            isCharge: res.data.data.isCharge,
            avatarUrl: res.data.data.avatar,
            nickName: res.data.data.nickname,
            isExpire: res.data.data.isExpire,
            // content: res.data.data.des
          })

          wx.setStorage({
            key: 'isCharge',
            data: res.data.data.isCharge
          });
        } else {
          if (res.data.needLogin) {
            wx.navigateTo({
              url: '../login/login'
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
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },


  onLoad: function() {},
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  invited: function() {
    if (this.data.isCharge == true) {
      wx.navigateTo({
        url: "/pages/user/invitation/invitation"
      })
    } else {
      wx.showToast({
        duration: 3000,
        title: "要邀请心仪的小仙女/小哥哥，首先您要成为超级会员哦",
        icon: "none"
      })
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
  onShareAppMessage: function (res) {
    return {
      title: '千色色沙拉会员+',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})