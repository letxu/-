// pages/store/store.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curNavId: 1, //排序索引
    curIndex: 0,
    searchText: '',
    height: "",
    sort: [{
        id: 1,
        title: "默认"
      },
      {
        id: 2,
        title: "我附近的店"
      }
    ],
    data: null,
    title: "门店汇总",
    content: "参加店铺内容",
    page: 1,
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
  submitSearch: function() { //提交搜索
    var that = this;
    that.setData({
      page: 1
    });
    that.loadData()
  },
  onShareAppMessage: function (res) {
    return {
      title: '千色色沙拉会员+',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
  switchTab: function(e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    // console.log(id)
    var that = this
    this.setData({
      curNavId: id,
      curIndex: index,
    })
    this.loadData()
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
        url: '../index/index'
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.reLaunch({
        url: '../user/user'
      })
    }
  },
  onShow: function() {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        var height = res.windowHeight / 2;
        if (res.windowHeight > 600) {
          height = res.windowHeight / 2.5;
        }
        if (res.windowHeight > 650) {
          height = res.windowHeight / 3;
        }
        if (res.windowHeight > 700) {
          height = res.windowHeight / 10;
        }
        that.setData({
          height: height
        })
      },
    })
    that.loadData();

  },
  searchTextChange: function(e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  loadData: function() {
    
    var that = this;

    wx.showLoading({
      title: '加载中',
    });
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.baseUrl + '/Shop',
      header: {
        'content-type': 'application/json', // 默认值
        "token": app.globalData.token
      },
      data: {
        nearBy: that.data.curIndex != 0,
        lat: app.globalData.lat,
        lng: app.globalData.lng,
        name: that.data.searchText,
        page: that.data.page
        
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        if (res.data.success) {
          that.setData({
            content: res.data.data.des
          })
          if (res.data.data.list != null && res.data.data.list.length > 0) {
            var tempData = that.data.data;
            if (tempData == null || that.data.page == 1) {
              that.setData({
                data: res.data.data.list,
                content: res.data.data.des
              })
            } else {
              Array.prototype.push.apply(tempData, res.data.data.list);
              that.setData({
                data: tempData
              })
            }
          } else {
            if (that.data.page == 1) {
              that.setData({
                data: null
              })
            } else {
              setTimeout(() => {
                wx.showToast({
                  title: "这里空空如也，快点来霸占我",
                  icon: 'none'
                })
                setTimeout(() => {
                  wx.hideToast();
                }, 3000)
              }, 0);
            }
            that.setData({
              page: that.data.page - 1
            });
          }
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
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this


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
    console.log('dasd')
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

    that.loadData(1)

  },
})