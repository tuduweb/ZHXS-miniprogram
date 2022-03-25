// pages/questions/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex : 0,
    maxIndex : 10,
    questions : [
      {
        title: "这是一个题目的演示",
        content: "青衣作为旦行的一支,扮演娴淑的中、青年 女子角色。其妆容有@特点。 ",
        options: ["线眉风眼，肤色颇深润", "面部的上方、脑门中间点上一个红点", "底色以偏向灰棕、黑棕色混合色为主", "眉心到脑门之间画出一个淡红色的小“三角”形状"],
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
      }
    ]
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
  btn_goto: function(e) {
    //this.data.currentIndex = e.target.dataset.index
    this.setData({
      currentIndex: e.target.dataset.index
    })
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
  btn_submit: function(e) {
    this.matchSubmit(e)

    App.HttpService.matchSubmit({
      id: '6235e9542921d348d1baed65',
      choices: this.data.choices
    }).then(res =>{
      console.log(res)
      wx.redirectTo({
        url: '../result/score?matchId=' + res.data.data._id
      })
    })

  },
  matchSubmit: function(e) {
    
    console.log(this.data.choices)
    //检查是否所有题目都有选中

    //构造提交数据

    //提交数据

    //获取反馈结果

    //跳转

  }
})