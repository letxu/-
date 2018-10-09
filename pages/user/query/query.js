// pages/query/query.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curNavId: 1, //排序索引
    sortid: null, //排序id
    height: '',
    curIndex: 0,
    page: 1,
    sort: [{
        id: 1,
        title: "全部"
      },
      {
        id: 2,
        title: "正在审核"

      },
      {
        id: 3,
        title: "审核成功"
      },
      {
        id: 4,
        title: "审核失败"
      }
    ],
    data: null,
    tabId: 1,
    tabIndex: 0,
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

  switchTab: function(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = parseInt(e.currentTarget.dataset.index);
    console.log(e);
    console.log();
    if (that.data.curIndex != index) {
      var state = "全部";
      if (index == 0) {
        state = "全部";
      }
      if (index == 1) {
        state = "正在审核";
      }
      if (index == 2) {
        state = "审核成功";
      }
      if (index == 3) {
        state = "审核失败";
      }
      wx.request({
        url: app.globalData.baseUrl + '/User/User_Withdraw_Log',
        header: {
          'content-type': 'application/json', // 默认值
          "token": app.globalData.token
        },
        data: {
          state: state
        },
        method: 'GET',
        success: function(res) {
          console.log(res)
          that.setData({
            data: res.data.data
          })
        }
      })
    }
    this.setData({
      curNavId: id,
      curIndex: index,
    })

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
  loadData: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.showNavigationBarLoading()
    wx.request({
      url: app.globalData.baseUrl + '/User/User_Withdraw_Log',
      header: {
        'content-type': 'application/json', // 默认值
        "token": app.globalData.token
      },
      data: {
        page: that.data.page
      },
      method: 'GET',
      success: function(res) {
        if (res.data.success) {
          if (res.data.data != null && res.data.data.length > 0) {
            var tempData = that.data.data;
            if (tempData == null || that.data.page == 1) {
              that.setData({
                data: res.data.data
              })
            } else {
              Array.prototype.push.apply(tempData, res.data.data);
              that.setData({
                data: tempData
              })
            }
          } else {
            that.setData({
              page: that.data.page - 1
            });
            wx.showToast({
              duration: 3000,
              title: "这里空空如也，快点来霸占我",
              icon: 'none'
            })
          }
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
      },
      complete: function() {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight / 2;
        if (res.windowHeight > 600) {
          height = res.windowHeight / 2.5;
        }
        if (res.windowHeight > 650) {
          height = res.windowHeight / 3;
        }
        if (res.windowHeight > 700) {
          height = res.windowHeight / 5;
        }
        that.setData({
          height: height
        })
      },
    })
    that.loadData();
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
    var that = this
    that.setData({
      page: 1
    })
    that.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    var that = this
    console.log(that.data.page)
    that.setData({
      page: that.data.page + 1
    })

    console.log("上拉拉加载更多...." + that.data.page)

    that.loadData()

  },
  onShareAppMessage: function (res) {
    return {
      title: '千色色沙拉会员+',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})