// pages/questions/result/score.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromUserId : 0,
    // isFirstIn: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.matchId)
    //根据 matchId ..
    if(options.matchId != "undefined") {

      this.score = App.HttpResource('/match/score/:id', {id: '@id'})

      this.setData({
        id: options.matchId
      })
    }

    //推广相关, 推广相关
    if(options.fromUserId != "undefined") {
      //如果是新访问此小程序的用户 则给推广方加分
      this.setData({fromUserId: options.fromUserId})
      this.userSharedRef(options.fromUserId, getCurrentPages()[0]["route"])
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
    return {
      title: '在朝花戏拾取得了好成绩: ' + this.data.scoreData.grade,
      path: 'pages/questions/result/score?matchId='+this.data.id+'&fromUserId='+this.data.fromUserId
    }
  },

  getScore: function(id) {
    this.score.getAsync({id: id})
    .then(res => {
      const data = res.data
      if(data.meta.code == 0) {
        this.setData({
          scoreData: data.data,
          results: JSON.parse(data.data.results)
        })
      }

    })
  },

  userSharedRef: function(userId, refPath) {
    console.log("from share:", refPath, "user:", userId)
    //将信息处理后, 加入到global中?

    //记录当前的时间等其它信息

    let refInfo = {
      "userId"    : userId,
      "path"      : refPath,
      "firstTime" : Date.now()
    }
    App.WxService.setStorageSync('refInfo', refInfo)
  }

})