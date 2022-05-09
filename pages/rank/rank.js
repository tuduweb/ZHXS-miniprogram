// pages/rank/rank.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: {
      ranks: [
        {
          userName: "恋爱的犀牛",
          avatar: "avtar",
          school: "湘潭市一中",
          point: "12300"
        },
      ],
      statistic: {
        "sum": 0,
        "highest": 0,
        "accuracy": 0
      }
    },

    week: {
      ranks: [
        {
          userName: "恋爱的犀牛",
          avatar: "avtar",
          school: "湘潭市一中",
          point: "12300"
        },
      ],
      statistic: {
        "sum": 0,
        "highest": 0,
        "accuracy": 0
      }
    },

    currentType: 'week'
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRank()
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
    this.getRank()

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

  getRank: function() {
    App.HttpService.getRank()
    .then(res => {
      let data = res.data
      if (data.meta.code == 0) {

        let week = {
          ranks: data.data.week.rank,
          top3: data.data.week.rank.slice(0, 3),
          otherRank: data.data.week.rank.slice(3),
          statistic: data.data.week.statistic
        }
        let day = {
          ranks: data.data.day.rank,
          top3: data.data.day.rank.slice(0, 3),
          otherRank: data.data.day.rank.slice(3),
          statistic: data.data.day.statistic
        }
        this.setData({
          week: week,
          day: day
        })

        this.navClicked()


        // this.setData({
        //   top3: this.data.ranks.slice(0, 3),
        //   otherRank: this.data.ranks.slice(3, -1),
        // })
      }
    })
    .catch(err => console.log(err))
  },
  navClicked: function(e) {
    if(e && e.currentTarget.dataset.type == 'week') {
      this.setData({
        currentType: 'week',
        ranks: this.data.week.ranks,
        statistic: this.data.week.statistic,
        top3: this.data.week.top3,
        otherRank: this.data.week.otherRank
      })
    }else{
      this.setData({
        currentType: 'day',
        ranks: this.data.day.ranks,
        statistic: this.data.day.statistic,
        top3: this.data.day.top3,
        otherRank: this.data.day.otherRank
      })
    }
  }
})