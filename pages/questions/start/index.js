// pages/questions/list/index.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: !0,
    type  : null,
    test : "data",
    questions : {},
    prompt: {
        hidden: !0,
        icon: '../../../assets/images/iconfont-empty.png',
    },
  },
  initData() {
    const type = this.data.type

    this.setData({
        questions: {
            items: [],
            params: {
                page : 1,
                limit: 10,
            },
            paginate: {}
        },
        match: {}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log("hello onload")
    this.questions = App.HttpResource('/questions/:id', {id: '@id'})

    this.match = App.HttpResource('/match/start')
    console.log("match", this.match)
    this.setData({
        type: option.type || '', 
        //keyword: option.keyword && decodeURI(option.keyword), 
    })
    this.onPullDownRefresh()
  },
  onPullDownRefresh() {
    console.info('onPullDownRefresh')
    this.initData()
    this.getList()
    this.getStart()
  },
  getList() {
    const questions = this.data.questions
    const params = questions.params

    // App.HttpService.getGoods(params)
    this.questions.queryAsync(params)
    .then(res => {
        const data = res.data
        console.log(data)
        this.setData({
          questions: data.data
        })
    })
},
  getStart: function() {
    // App.HttpService.matchStart().then(res =>{
    //   console.log("matchStart", res)
    //   console.log("data", res.data.data[0])
    //   this.setData({
    //     match: {
    //       data : res.data.data[0]
    //     }
    //   })
    // })

  },
  goToScore: function(){
    wx.redirectTo({url:'../result/score'})
  },

  itemClick: function(e) {
    wx.navigateTo({
      url: '../detail/index'
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

  }
})