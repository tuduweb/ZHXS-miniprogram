// pages/questions/detail/index.js
const App = getApp()

const mockData = {"meta":{"code":0,"message":"新增挑战成功"},"data":{"_id":"6235e7df2921d348d1baed64","questions":{"_id":"6235aad7d6405c75b6baff80","title":"套题标题345.2546855931726","type":3,"remark":"remark","create_at":"2022-03-19T10:04:46.829Z","questions":["623596ef39ffbf661b148ab6","6235970639ffbf661b148ad8","623596b139ffbf661b148aaa","623596f639ffbf661b148ac8","623596fc39ffbf661b148ad5","6235970739ffbf661b148adc","623596f139ffbf661b148abc","623596ed39ffbf661b148ab3","623596ee39ffbf661b148ab4","623596f339ffbf661b148abf"],"__v":0,"datas":[{"_id":"623596b139ffbf661b148aaa","title":"问题9329","content":"内容内容52328","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596ed39ffbf661b148ab3","title":"问题7484","content":"内容内容98620","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596ee39ffbf661b148ab4","title":"问题1665","content":"内容内容98769","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596ef39ffbf661b148ab6","title":"问题3780","content":"内容内容13412","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596f139ffbf661b148abc","title":"问题1081","content":"内容内容72419","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596f339ffbf661b148abf","title":"问题5376","content":"内容内容26327","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596f639ffbf661b148ac8","title":"问题6636","content":"内容内容75892","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"623596fc39ffbf661b148ad5","title":"问题4701","content":"内容内容12496","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"6235970639ffbf661b148ad8","title":"问题4430","content":"内容内容48322","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0},{"_id":"6235970739ffbf661b148adc","title":"问题5680","content":"内容内容89063","type":3,"remark":"remark","create_at":"2022-03-19T08:39:08.388Z","answer":[0],"options":["选项A","选项B","选项C"],"types":[],"__v":0}]}}}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex : 0,
    maxIndex : 10,
    questions : [
      {
        title: "这是一个题目的演示",
        content: "这是这个题目的内容，要放多点占点位置吧。这是这个题目的内容，要放多点占点位置吧。",
        options: ["选项一", "选项二", "选项三", "选项四"],
        answers: [0]
      },
      {
        title: "这是222222个题目的演示",
        content: "题目题目，题目就是很容易的东西，放这里占点位置。这是这个题目的内容，要放多点占点位置吧。这是这个题目的内容，要放多点占点位置吧。",
        options: ["选项A", "选项B", "选项C", "选项D"],
        answers: [1]
      },
      {
        title: "这是33333个题目的演示",
        content: "加油加油，冲冲冲，我们要冲。这是这个题目的内容，要放多点占点位置吧。这是这个题目的内容，要放多点占点位置吧。",
        options: ["选项1", "选项2", "选项3", "选项4"],
        answers: [2]
      },
    ],
    choices: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      questions : mockData.data.questions.datas,
      choices: new Array(mockData.data.questions.questions.length).fill(-1)
    })

    console.log(this.data.choices)
    console.log(mockData.data.questions.datas)

  },
  btn_choose: function(e) {
    console.log(this.data.currentIndex, e.target.dataset.option)
    let _key = 'choices[' + this.data.currentIndex + ']'
    this.setData({
      [_key] : e.target.dataset.option
    })
  },
  btn_goto: function(e) {
    //this.data.currentIndex = e.target.dataset.index
    this.setData({
      currentIndex: e.target.dataset.index
    })
  },
  btn_last: function(e) {
    if(this.data.currentIndex > 0)
      this.setData({currentIndex : this.data.currentIndex - 1})
  },
  btn_next: function(e) {
    if(this.data.currentIndex < this.data.maxIndex) {
      this.setData({currentIndex : this.data.currentIndex + 1})
    }
  },
  btn_submit: function(e) {
    this.matchSubmit(e)

    App.HttpService.matchSubmit({
      id: '6235e9542921d348d1baed65',
      choices: this.data.choices
    }).then(res =>{
      console.log(res)
      wx.redirectTo({
        url: '../result/score?matchId=' + res.data.data._id
      })
    })

  },
  matchSubmit: function(e) {
    
    console.log(this.data.choices)
    //检查是否所有题目都有选中

    //构造提交数据

    //提交数据

    //获取反馈结果

    //跳转

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