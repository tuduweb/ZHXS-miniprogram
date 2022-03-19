// pages/questions/list/index.js
const App = getApp()

const mockData = {"meta":{"code":0,"message":"新增挑战成功"},"data":{"_id":"6235e7df2921d348d1baed64","questions":{"_id":"6235aad7d6405c75b6baff80","title":"套题标题345.2546855931726","type":3,"remark":"remark","create_at":"2022-03-19T10:04:46.829Z","questions":["623596ef39ffbf661b148ab6","6235970639ffbf661b148ad8","623596b139ffbf661b148aaa","623596f639ffbf661b148ac8","623596fc39ffbf661b148ad5","6235970739ffbf661b148adc","623596f139ffbf661b148abc","623596ed39ffbf661b148ab3","623596ee39ffbf661b148ab4","623596f339ffbf661b148abf"],"__v":0,"datas":[{"_id":"623596b139ffbf661b148aaa","title":"问题9329","content":"内容内容52328","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596ed39ffbf661b148ab3","title":"问题7484","content":"内容内容98620","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596ee39ffbf661b148ab4","title":"问题1665","content":"内容内容98769","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596ef39ffbf661b148ab6","title":"问题3780","content":"内容内容13412","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596f139ffbf661b148abc","title":"问题1081","content":"内容内容72419","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596f339ffbf661b148abf","title":"问题5376","content":"内容内容26327","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596f639ffbf661b148ac8","title":"问题6636","content":"内容内容75892","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596fc39ffbf661b148ad5","title":"问题4701","content":"内容内容12496","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"6235970639ffbf661b148ad8","title":"问题4430","content":"内容内容48322","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"6235970739ffbf661b148adc","title":"问题5680","content":"内容内容89063","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0}]}}}

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
    App.HttpService.matchStart().then(res =>{
      console.log("matchStart", res)
      console.log("data", res.data.data[0])
      this.setData({
        match: {
          data : res.data.data[0]
        }
      })
    })

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