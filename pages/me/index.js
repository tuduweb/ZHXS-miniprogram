// pages/me/index.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false, 
		items: [
			{
				icon: '../../assets/images/more_icon1@2x.png',
				text: '学习记录',
				path: '/pages/me/studyRecord/index'
			}, 
			{
				icon: '../../assets/images/more_icon2@2x.png',
				text: '趣味拼图',
				path: '/pages/pintu/list/index'
			}, 
			// {
			// 	icon: '../../assets/images/more_icon3@2x.png',
			// 	text: '我的分享',
			// 	path: '18521708248',
			// }, 
			// {
			// 	icon: '../../assets/images/more_icon4@2x.png',
			// 	text: '邀请好友',
			// 	path: '/pages/help/list/index',
      // },
      {
				icon: '../../assets/images/more_icon5@2x.png',
				text: '帮助和反馈',
				path: '/pages/help/list/index',
			},
    ],
    // userInfo: {
    //   "nickname": "用户昵称",
    //   "school": "用户学校"
    // },

    userInfo: {
      "nickname": "用户昵称",
      "school": "用户学校"
    },

    hasUserInfo: false,
    canIUseGetUserProfile: false,

    isUserLogin: false
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
    //console.log(getCurrentPages()[0]["route"])
    this.refreshUserState()
    
  },

  refreshUserState: function() {
    if(wx.getStorageSync('token')) {
      this.setData({
        isUserLogin: true
      })
    }else{
      this.setData({
        isUserLogin: false
      })
    }
    if(this.data.isUserLogin) {
      this.initUserInfo()
    }else{
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: false
        })
      }
    }
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

  initUserInfo: function() {

    App.HttpService.userInfo()
    .then(res => {
      console.log(res.data)
      let data = res.data
      if (data.meta.code == 0) {
        this.setData({
          userInfo: data.data,
          isUserLogin: true
        })
      }else{
        //
      }
    })
    .catch(err => console.log)

  },

  handleClick(e) {
    if(e.detail && e.detail.key) {
      
      console.log(e.detail.key)

      const originSchool = this.data.userInfo.school
      if(e.detail.key == originSchool) {

      }else{

        this.setData({
          "userInfo.school": e.detail.key
        })

        //更新结果到远程服务器
        App.HttpService.profileUpdate({
          school: e.detail.key
        })

      }

      
      //
    
    }else{

    }
    this.setData({
      isShow: !this.data.isShow
    })
  },
  handleItemClicked: function(e) {
    console.log(e.currentTarget.dataset.path)
    wx.navigateTo({
      url: e.currentTarget.dataset.path,
    })
  },

  login() {
    // wx.redirectTo({
    //   url: '/pages/login/index'
    // })
  
    App.login(() => {
      this.initUserInfo()
    })
  
  },

  logout() {
    App.WxService.showModal({
          title: '友情提示', 
          content: '确定要登出吗？', 
      })
      .then(data => data.confirm == 1 && this.signOut())
  },
  signOut() {
    App.HttpService.signOut()
    .then(res => {
      const data = res.data
      console.log(data)
      if (data.meta.code == 0) {
        App.WxService.removeStorageSync('token')
        this.refreshUserState()
        //App.WxService.redirectTo('/pages/login/index')
      }
    })
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("success", res)
        let userInfo = {}
        userInfo = this.data.userInfo
        userInfo.nickname = res.userInfo.nickName
        userInfo.avatar = res.userInfo.avatarUrl
        console.log(userInfo)
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        })
        //用户没有头像时该项为空。若用户更换头像，原有头像 URL 将失效。
        App.HttpService.profileUpdate({
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl
        })
      },
      complete: res => {
        //
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

})