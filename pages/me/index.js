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
				text: '益智拼图',
				path: '/pages/pintu/list/index'
			}, 
			{
				icon: '../../assets/images/more_icon3@2x.png',
				text: '我的分享',
				path: '/pages/me/shareRecord/index',
			}, 
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

    schoolLists: [{'id': '1', 'name': '紫金县第一小学'}, {'id': '2', 'name': '紫金县第二小学'}, {'id': '3', 'name': '紫金县第三小学'}, {'id': '4', 'name': '紫金县第四小学'}, {'id': '5', 'name': '紫金县第六小学'}, {'id': '6', 'name': '深圳中学河源实验学校'}, {'id': '7', 'name': '河源职业技术学院'}, {'id': '8', 'name': '紫金县职业技术学校'}, {'id': '9', 'name': '紫金县富士康希望小学'}, {'id': '10', 'name': '紫城镇中心小学'}, {'id': '11', 'name': '紫城镇第三小学'}, {'id': '12', 'name': '紫城镇林田小学'}, {'id': '13', 'name': '紫城镇荷光小学'}, {'id': '14', 'name': '紫金金山幼儿园'}, {'id': '15', 'name': '瓦溪中学'}, {'id': '16', 'name': '紫荆花舞蹈艺术培训中心'}, {'id': '17', 'name': '文武艺术培训中心'}, {'id': '18', 'name': '紫金县地税局'}, {'id': '19', 'name': '柏埔文化站'}, {'id': '20', 'name': '九和镇文化站'}, {'id': '21', 'name': '瓦溪半岗村'}, {'id': '22', 'name': '新龙村'}],

    // userInfo: {
    //   "nickname": "用户昵称",
    //   "school": "用户学校"
    // },

    userInfo: {
      "nickname": "用户昵称",
      "school": "用户学校",
      "studyTime": 0,
      "avgGrade": 0,
      "score": 0
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
    return App.ShareApp()
  },

  initUserInfo: function() {

    App.HttpService.userInfo()
    .then(res => {
      console.log(res.data)
      let data = res.data
      if (data.meta.code == 0) {
        //重新计算时间, 需要封装成函数
        let studyTime = data.data.studyTime
        let studyTimeUnit = "分钟"
        if(studyTime > 999) {
          studyTimeUnit = "小时"
          studyTime = Math.floor(studyTime / 60)
        }

        this.setData({
          userInfo: data.data,
          'userInfo.studyTimeUnit': studyTimeUnit,
          'userInfo.studyTimeCal': studyTime,
          isUserLogin: true
        })
      }else{
        //
      }
    })
    .catch(err => console.log)

  },

  handleClick(e) {

    if(e.detail && e.detail.name) {
      
      console.log(e.detail.name)

      const originSchool = this.data.userInfo.school
      console.log("school", e.detail.name, originSchool)
      if(e.detail.name == originSchool) {

      }else{

        this.setData({
          "userInfo.school": e.detail.name
        })

        //更新结果到远程服务器
        App.HttpService.profileUpdate({
          school: e.detail.name
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