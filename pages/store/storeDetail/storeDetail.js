// pages/storeDetail/storeDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    tabId: 1,
    tabIndex: 0,
    footerTab: [{
      id: 1,
      pic: '/images/home_icon.png'


    },
    {
      id: 2,
      pic: '/images/user_icon.png'
    }],
  },
  onShareAppMessage: function (res) {
    return {
      title: '千色色沙拉会员+',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      spacedata: Object.assign({}, options, {
        name: options.name
      })
    })
    wx.request({
      url: app.globalData.baseUrl + '/Shop/Detail',
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/json',
        "token": app.globalData.token
      },
      success: function(res) {
        if (res.data.success) {
          that.setData({
            data: res.data.data
          });
          wx.setNavigationBarTitle({
            title: res.data.data.name
          })
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
    });
  },
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.data.tel,
    })
  },
  // 底部
  Navigation: function(e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset)
    var that = this;
    if (e.currentTarget.dataset.id == 1) {
      wx.reLaunch({
        url: '../../index/index'
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.reLaunch({
        url: '../../user/user'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示 
   *  
   */


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
})