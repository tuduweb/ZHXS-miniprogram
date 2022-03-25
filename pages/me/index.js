// pages/me/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		items: [
			{
				icon: '../../assets/images/iconfont-order.png',
				text: '我的订单',
				path: '/pages/order/list/index'
			}, 
			{
				icon: '../../assets/images/iconfont-addr.png',
				text: '收货地址',
				path: '/pages/address/list/index'
			}, 
			{
				icon: '../../assets/images/iconfont-kefu.png',
				text: '联系客服',
				path: '18521708248',
			}, 
			{
				icon: '../../assets/images/iconfont-help.png',
				text: '常见问题',
				path: '/pages/help/list/index',
			},
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

  }
})