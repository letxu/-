// pages/invitation/invitation.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrCode: '',
    title:'邀请说明',
   
    footerTab: [{
      id: 1,
      pic: '/images/home_icon.png'


    },
    {
      id: 2,
      pic: '/images/user_icon.png'
    }],
  },
  // 底部
  Navigation: function(e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset)
    var that = this
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/User/QrCode',
      data: {

      },
      header: {
        'content-type': 'application/json', // 默认值
        "token": app.globalData.token
      },
      method: 'GET',
      success: function (res) {
        if (res.data.success) {
          that.setData({
            qrCode: res.data.data.qrCode
          });
        } else {
          if (res.data.needLogin) {
            wx.navigateTo({
              url: '../../login/login'
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

  previewImage: function(e) {
    wx.previewImage({
      urls: this.data.qrCode.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
  },
  //关闭事件
  showDialog: function () {
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