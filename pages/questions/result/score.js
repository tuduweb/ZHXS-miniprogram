// pages/questions/result/score.js
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
  onLoad: function (options) {
    console.log(options.matchId)
    //根据 matchId ..
    if(options.matchId != "undefined") {

      this.goods = App.HttpResource('/match/score/:id', {id: '@id'})

      this.setData({
        id: options.matchId
      })

    }
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
    this.getScore(this.data.id)
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

  getScore: function(id) {
    this.goods.getAsync({id: id})
    .then(res => {
      const data = res.data
      if(data.meta.code == 0) {
        this.setData({
          scoreData: data.data
        })
      }

    })
  } 
})