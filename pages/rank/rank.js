// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranks: [
      {
        userName: "恋爱的犀牛",
        avatar: "avtar",
        school: "湘潭市一中",
        point: "12300"
      },
      {
        userName: "名字很长很炫酷",
        avatar: "avtar",
        school: "湘潭市二中",
        point: "10000"
      },
      {
        userName: "可爱的哥哥",
        avatar: "avtar",
        school: "湘潭大学附属中学",
        point: "9876"
      },
      {
        userName: "呆呆的西瓜",
        avatar: "avtar",
        school: "湘潭市一中",
        point: "8000"
      },
      {
        userName: "离谱的儿子",
        avatar: "avtar",
        school: "湘钢一中",
        point: "7654"
      },
      {
        userName: "名字很长很炫酷的人们",
        avatar: "avtar",
        school: "湘潭市十中",
        point: "3200"
      },
      {
        userName: "爱情的眼泪",
        avatar: "avtar",
        school: "湘潭市四中",
        point: "189"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      top3: this.data.ranks.slice(0, 3)
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