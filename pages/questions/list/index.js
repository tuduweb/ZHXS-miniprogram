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
    const keyword = this.data.keyword

    this.setData({
        questions: {
            items: [],
            params: {
                page : 1,
                limit: 10,
                //type : type,
                //keyword : keyword,
            },
            paginate: {}
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log("hello onload")
    this.questions = App.HttpResource('/questions/:id', {id: '@id'})
    console.log(this.questions)
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
  },
  getList() {
    const questions = this.data.questions
    const params = questions.params

    // App.HttpService.getGoods(params)
    this.questions.queryAsync(params)
    .then(res => {
        const data = res.data
        console.log(data)
        // if (data.meta.code == 0) {
        //     data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
        //     goods.items = [...goods.items, ...data.data.items]
        //     goods.paginate = data.data.paginate
        //     goods.params.page = data.data.paginate.next
        //     goods.params.limit = data.data.paginate.perPage
        //     this.setData({
        //         goods: goods,
        //         'prompt.hidden': goods.items.length,
        //     })
        // }
        this.setData({
          questions: data.data
        })
    })
},
  goToScore: function(){
    wx.redirectTo({url:'../result/score'})
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

  },
  onJingjiClicked: function(e) {
    console.log(e)
  }
})