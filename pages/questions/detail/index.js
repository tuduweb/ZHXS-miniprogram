// pages/questions/detail/index.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex : 0,
    maxIndex : 50,
    questions : [
      {
        title: "这是一个题目的演示",
        content: "这是这个题目的内容，要放多点占点位置吧。这是这个题目的内容，要放多点占点位置吧。",
        options: ["选项一", "选项二", "选项三", "选项四"],
        answers: [0]
      },
      {
        title: "这是222222个题目的演示",
        content: "题目题目，题目就是很容易的东西，放这里占点位置。这是这个题目的内容，要放多点占点位置吧。这是这个题目的内容，要放多点占点位置吧。",
        options: ["选项A", "选项B", "选项C", "选项D"],
        answers: [1]
      },
      {
        title: "这是33333个题目的演示",
        content: "加油加油，冲冲冲，我们要冲。这是这个题目的内容，要放多点占点位置吧。这是这个题目的内容，要放多点占点位置吧。",
        options: ["选项1", "选项2", "选项3", "选项4"],
        answers: [2]
      },
    ],
    choices: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  btn_last: function(e) {
    if(this.data.currentIndex > 0)
      this.setData({currentIndex : this.data.currentIndex - 1})
  },
  btn_next: function(e) {
    if(this.data.currentIndex < this.data.maxIndex) {
      this.setData({currentIndex : this.data.currentIndex + 1})
    }
  },
  matchSubmit: function(e) {
    
    //

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

  }
})