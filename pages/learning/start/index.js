// pages/learning/list/index.js
const App = getApp()
const idLists = [
  '6266a1cae81e8e1e538bd4f6',
  '6266a1e5e81e8e1e538bd4f7',
  '6266a0cce81e8e1e538bd4f5'
]

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onButtonClicked: function(e) {
    console.log("sid", e.currentTarget.dataset.sid)
    //页面需要权限，故判断用户是否登录, 并执行登录等..
    //跳转到页面
    let _studyId = idLists[e.currentTarget.dataset.sid - 1]
    console.log("url", '/pages/learning/detail/index?sid='+e.currentTarget.dataset.sid+'&id='+_studyId)
    wx.navigateTo({
      url: '/pages/learning/detail/index?sid='+e.currentTarget.dataset.sid+'&id='+_studyId,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  }
})