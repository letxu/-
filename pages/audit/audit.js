// pages/audit/audit.js

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    platformArray: [],
    shopArray: [],
    platformIndex: 0,
    shopIndex: 0,
    title: '审核说明',
    pics: '',
    uploadimgs: [], //上传图片列表
    order: '',
    token: "",
    tabId: 1,
    formId:'',
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
    imgalist: [app.globalData.baseUrl + "/images/example1.jpg", app.globalData.baseUrl + "/images/example2.jpg"]
  

// https://ssl.ygwl.xin/QrCode/15.png
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    console.log(app.globalData.baseUrl + "/images/example1.jpg")
    wx.previewImage({
    
      current: current, // 当前显示图片的http链接
      urls: this.data.imgalist// 需要预览的图片http链接列表
    })
  },
  
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      platformIndex: e.detail.value
    })
  },
  bindMultiPickerChange: function(e) {
    console.log('picker发送选择改变，携带值h为', e.detail.value)
    this.setData({
      shopIndex: e.detail.value
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      order: e.detail.value
    })
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
    
    var that =this;

    that.hideModal();
    wx.showLoading({
      title: '加载中',
    });
    that.uploadPic(0);

  },
  formSubmit: function(e) {
    var that = this
    if (that.data.order == "") {
      wx.showToast({
        duration: 3000,
        title: '请输入订单号!',
        icon: "none"
      })
      return false
    } 
     if (that.data.uploadimgs == null ||that.data.uploadimgs == "" || that.data.uploadimgs.length <= 0) {
      wx.showToast({
        duration: 3000,
        title: "请先上传图片！",
        icon: 'none'
      });
      return;
    }else {
      that.setData({
        showModal: true,
        formId: e.detail.formId
      })
    }
    
  },
  submitData: function (postData) {
    var that = this;
    wx.showLoading({
      title: '提交中……',
    });
    wx.request({
      url: app.globalData.baseUrl + '/Takeout/Apply',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "token": app.globalData.token
      },
      data: {
        platform: that.data.platformArray[that.data.platformIndex].id,
        shop: that.data.shopArray[that.data.shopIndex].id,
        orderId: that.data.order,
        pics: that.data.pics,
        formId: that.data.formId
      },
      success: function (res) {
        if (res.data.success) {
          that.setData({
            pics: '',
            des: '',
            uploadimgs: []
          });
          setTimeout(() => {
            wx.showToast({
              duration: 3000,
              title: "提交成功！",
              icon: 'success'
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
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  toQuery:function(){
      wx.navigateTo({
        url: "/pages/user/query/query",
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
  onShow: function() {
    var that = this
    that.loadData();
  },
  loadData: function() {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + '/Takeout',
      header: {
        'content-type': 'application/json',
        "token": app.globalData.token
      },
      method: 'GET',
      success: function(res) {
        if (res.data.success) {
          that.setData({
            platformArray: res.data.data.platform,
            shopArray: res.data.data.shop,
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
      },
      fail: function() {
        console.log('das')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  chooseImage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      // itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let that = this;
    if (that.data.uploadimgs.length >= 5) {
      wx.showToast({
        title: "最多上传5张图片",
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    });
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          uploadimgs: that.data.uploadimgs.concat(res.tempFilePaths)
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  desChange: function (e) {
    this.setData({
      des: e.detail.value
    });
  },
  uploadPic: function (index) {
    var that = this;
    wx.uploadFile({
      url: app.globalData.baseUrl + '/Upload',
      filePath: that.data.uploadimgs[index],
      name: 'file',
      formData: {
        act: "share"
      },
      header: {
        'content-type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        var jsonStr = res.data;
        jsonStr = jsonStr.replace(" ", "");
        if (typeof jsonStr != 'object') {
          jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
          var tempJson = JSON.parse(jsonStr);
          res.data = tempJson;
        }
        if (res.data.success) {
          var pics = that.data.pics;
          if (pics != null && pics != "") {
            pics += ",";
          }
          pics += res.data.data;
          that.setData({
            pics: pics
          });
        } else {
          if (res.data.needLogin) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      },
      complete: function () {
        var newIndex = index + 1;
        if (that.data.uploadimgs.length > newIndex) {
          that.uploadPic(newIndex);
        } else {
          wx.hideLoading();
          that.submitData();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
  },
  showDialog: function() {
    var that =this
    that.setData({
      hasMask: true
    })

    that.dialog.showDialog();

    

         
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
  onShareAppMessage: function (res) {
    return {
      title: '千色色沙拉会员+',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})