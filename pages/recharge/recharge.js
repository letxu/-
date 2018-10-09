// import temp from '../components/mask/mask.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rechargeItems: null,
    title: "充值说明",
    showModal: false,
    tabId: 1,
    tabIndex: 0,
    money:"",
    footerTab: [{
        id: 1,
        pic: '/images/home_icon.png'


      },
      {
        id: 2,
        pic: '/images/user_icon.png'
      }
    ],
  },
  onShareAppMessage: function (res) {
    return {
      title: '千色色沙拉会员+',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
  scroll: function (e) {
    console.log(e)

  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },

  onConfirm: function () {
    this.hideModal();

    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.baseUrl + '/Pay',
      method: 'POST',
      data: {
        money: this.data.money
      },
      header: {
        "token": app.globalData.token
      },
      success: function (res) {
        if (res.data.success) {
          wx.requestPayment({
            "timeStamp": res.data.data.timeStamp,
            "nonceStr": res.data.data.nonceStr,
            "package": res.data.data.package,
            "signType": res.data.data.signType,
            "paySign": res.data.data.paySign,
            "success": function (res) {
              wx.showToast({
                duration: 3000,
                title: '支付成功！',
                icon: 'success'
              });
            },
            "fail": function (res) {
              wx.showToast({
                duration: 3000,
                title: '支付失败！',
                icon: 'none'
              });

            },
            "complete": function (res) { }
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
      complete: function () {
        wx.hideLoading();
      }
    });

  },
  //调用支付\r
  pay: function(e) {
    console.log(e.currentTarget.dataset.money)
    var that = this;
    that.setData({
      showModal: true,
       money: e.currentTarget.dataset.money
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
        url: '../index/index'
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.reLaunch({
        url: '../user/user'
      })
    }
  },
  toStore:function(){
    wx.navigateTo({
      url: '/pages/store/store'
    })

  } ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this
    wx.request({

      url: app.globalData.baseUrl + '/Charge',
      header: {

        "token": app.globalData.token
      },
      success: function(res) {
        if (res.data.success) {
          that.setData({
            rechargeItems: res.data.data.list,
            // content: res.data.data.des
          });

        } else {
          if (res.data.needLogin) {
            wx.navigateTo({
              url: '../login/login'
            })
          } else {
            wx.showToast({
              duration: 3000,
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      }
    })
  },
  onShow: function(e) {


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
  },

  /**
   * 生命周期函数--监听页面显示 
   *  
   */

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