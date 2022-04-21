// pages/me/index.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
		items: [
			{
				icon: '../../assets/images/more_icon1@2x.png',
				text: '学习记录',
				path: '/pages/order/list/index'
			}, 
			{
				icon: '../../assets/images/more_icon2@2x.png',
				text: '笔记本',
				path: '/pages/address/list/index'
			}, 
			{
				icon: '../../assets/images/more_icon3@2x.png',
				text: '我的分享',
				path: '18521708248',
			}, 
			{
				icon: '../../assets/images/more_icon4@2x.png',
				text: '邀请好友',
				path: '/pages/help/list/index',
      },
      {
				icon: '../../assets/images/more_icon5@2x.png',
				text: '帮助和反馈',
				path: '/pages/help/list/index',
			},
    ],
    userInfo: {
      "nickname": "大头大头",
      "school": "国际实验学校"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("globalData", App.globalData)

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
    App.HttpService.userInfo()
    .then(res => {
      console.log(res.data)
      let data = res.data
      if (data.meta.code == 0) {
        this.setData({
          userInfo: data.data
        })
      }else{
        //
      }
    })
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