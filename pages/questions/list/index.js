// pages/questions/list/index.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [
      {
        'tid': 1,
        'title': "故事剧情",
      },
      {
        'tid': 2,
        'title': "妆容服饰",
      },
      {
        'tid': 3,
        'title': "表演艺术",
      },
      {
        'tid': 4,
        'title': "腔调技巧",
      },
    ]
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
    return App.ShareApp()
  },
  onJingjiClicked: function(e) {
    console.log(e.currentTarget.dataset)

    App.HttpService.matchStart(e.currentTarget.dataset.tid)
    .then(res => {
      console.log("res", res)
      if(res.statusCode == 200 && res.data.meta.code == 0) {
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
        url: '../dati/index?id=' + _id
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