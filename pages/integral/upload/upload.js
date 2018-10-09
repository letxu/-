// pages/upload/upload.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: '',
    des: '',
    formId: '',
    uploadimgs: [], //上传图片列表
    tabId: 1,
    formId: '',
    tabIndex: 0,
    title: "活动说明",
    content: "",
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
  // 底部
  Navigation: function(e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset)
    var that = this
    if (e.currentTarget.dataset.id == 1) {
      wx.redirectTo({
        url: '../../index/index'
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.redirectTo({
        url: '../../user/user'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  chooseImage: function() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      // itemColor: "#f7982a",
      success: function(res) {
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
  chooseWxImage: function(type) {
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
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          uploadimgs: that.data.uploadimgs.concat(res.tempFilePaths)
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  desChange: function(e) {
    this.setData({
      des: e.detail.value
    });
  },
  uploadPic: function(index) {
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
      success: function(res) {
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
      complete: function() {
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
    var that = this;
    that.hideModal()
    wx.showLoading({
      title: '上传图片中……',
    });
      that.uploadPic(0);
  },
  submitData: function(postData) {
    var that = this;
    wx.showLoading({
      title: '提交中……',
    });
    wx.request({
      url: app.globalData.baseUrl + '/Share',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        "token": app.globalData.token
      },
      data: {
        pics: that.data.pics,
        des: that.data.des,
        formId: that.data.formId
      },
      success: function(res) {
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
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  // 提交图片
  submit: function(e) {
    var that = this;
  
    if (that.data.uploadimgs == null ||that.data.uploadimgs == "" || that.data.uploadimgs.length <= 0) {
      wx.showToast({
        duration: 3000,
        title: "请先上传图片！",
        icon: 'none'
      });
      return;
    }
    // if (that.data.des == "") {
    //   wx.showToast({
    //     duration: 3000,
    //     title: "请先填写备注！",
    //     icon: 'none'
    //   });
    //   return;
    // }

    that.setData({
      showModal: true,
      formId: e.detail.formId
    });
  
  },
  editImage: function() {
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg: function(e) {
    var imgs = this.data.uploadimgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      uploadimgs: imgs
    });
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