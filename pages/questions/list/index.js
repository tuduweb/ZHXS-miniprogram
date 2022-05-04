// pages/questions/list/index.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {

  },
  onPullDownRefresh() {

  },
  goToScore: function(){
    wx.redirectTo({
      url:'../result/score'
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onJingjiClicked: function(e) {
    console.log(e.currentTarget.dataset)
    //生成题目
    App.HttpService.matchStart()
    .then(res => {
      console.log("res", res)
      if(res.statusCode == 200) {
        // navigateTo res.data.data._id
        return res.data.data._id
      }
      return -1
    })
    .then(_id => {
      if(_id == -1) {
        //发生错误
        return
      }
      wx.navigateTo({
        url: '../detail/index?id=' + _id
      })
    })
    .catch(err => console.log)
    // wx.navigateTo({
    //   url: '../detail/index'
    // })
  },
  onGenerateClicked: function(e) {
    App.HttpService.matchGenerate()
    .then(res => console.log)
    .catch(err => console.log)
  }
})