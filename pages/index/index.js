//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    tabId: 1, //排序索引
    tabIndex: 0,
    isCharge: false,
    banner: null,
    footerTab: [{
        id: 1,
        pic: '/images/home_icon.png',
        active: "active"
      },
      {
        id: 2,
        pic: '/images/user_icon.png'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 1000,
    navItems: [{
        img: '/images/index1.png',
      },
      {
        img: '/images/index2.png',
      },
      {
        img: '/images/index3.png',
      },
      {
        img: '/images/index4.png',
      }
    ]
  },
  Navigation: function(e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset)
    var that = this;
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        tabId: id,
        tabIndex: index,
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.redirectTo({
        url: '../user/user'
      })
      this.setData({
        tabId: id,
        tabIndex: index,
      })
    }
  },
  tel: function() {
    wx.makePhoneCall({
      phoneNumber: "400-0099-727",
    })
  },
  tel1: function() {
    wx.makePhoneCall({
      phoneNumber: "400-1188-727",
    })
  },
  onLoad: function(options) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;

        app.globalData.lat = latitude;
        app.globalData.lng = longitude;
      }
    })
    if (options.scene != null && options.scene != undefined && options.scene != "") {
      app.globalData.invite = options.scene;
    }
  },
  onShow: function() {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/',
      header: {
        'content-type': 'application/json',
        "token": app.globalData.token
      },
      success: function(res) {
        if (res.data.success) {
          that.setData({
            data: res.data.data.banner,
            isCharge: res.data.data.isCharge
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
  // 邀请好友跳转
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
  gotoUser: function() {
    wx.navigateTo({
      url: '/pages/user/user'
    })
  },
  gotoRecharge: function() {
    wx.navigateTo({
      url: '/pages/recharge/recharge'
    })
  },
  gotoMyInvite: function() {
    if (this.data.isCharge) {
      wx.navigateTo({
        url: '/pages/user/invitation/invitation'
      })
    } else {
      wx.navigateTo({
        url: '/pages/recharge/recharge'
      })
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: '千色色沙拉会员+',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");

    if (!app.globalData.firstLaunch) {
  
      this.dialog.hideDialog();
    }
    app.globalData.firstLaunch = true;
  },
  showDialog: function() {
    this.setData({
      hasMask: true
    })
    this.dialog.showDialog();

  },
  _confirmEvent() {

    this.dialog.hideDialog();
  },

})