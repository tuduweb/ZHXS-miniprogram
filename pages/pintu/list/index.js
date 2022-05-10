// pages/pintu/list/index.js
App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initPintuIndex()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onItemClicked(e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/pintu/game/index?id='+e.currentTarget.dataset.id,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },

  initPintuIndex() {
    App.HttpService.getPintuIndex()
    .then(res => {
      let data = res.data
      if (data.meta.code == 0) {
        console.log(data)
        let pintuData = []
        pintuData.push({
          "classname": "丑行",
          "data": []
        })
        pintuData.push({
          "classname": "生行",
          "data": []
        })
        pintuData.push({
          "classname": "旦行",
          "data": []
        })
        data.data.forEach((item, index, arr) => {
          pintuData[item.type - 1].data.push(item)
          this.setData({
            pintuData: pintuData
          })
        })
      }
    })
    .catch(err => console.log(err))
  }
})