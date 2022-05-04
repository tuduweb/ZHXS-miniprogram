// pages/me/studyRecord/index.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: !0,
    type  : null,
    records: {},
    prompt: {
      hidden: !0,
      icon: '../../../assets/images/iconfont-empty.png',
  },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initStudyRecord()
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
    console.info('onPullDownRefresh')
    this.initData()
    this.getList()
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

  initStudyRecord: function() {
    this.records = App.HttpResource('/match/:id', {id: '@id'})
    this.setData({
        // type: option.type || '', 
        // keyword: option.keyword && decodeURI(option.keyword), 
    })
    this.onPullDownRefresh()
  },

  initData() {
    const type = this.data.type
    const keyword = this.data.keyword

    this.setData({
        records: {
            items: [],
            params: {
                page : 1,
                limit: 10,
                // type : type,
                // keyword : keyword,
            },
            paginate: {}
        }
    })
  },

  getList() {
    const records = this.data.records
    const params = records.params

    // App.HttpService.getrecords(params)
    this.records.queryAsync(params)
    .then(res => {
        const data = res.data
        console.log(data)
        if (data.meta.code == 0) {
            // data.data.items.forEach(n => n.thumb_url = App.renderImage(n.images[0] && n.images[0].path))
            records.items = [...records.items, ...data.data.items]
            records.paginate = data.data.paginate
            records.params.page = data.data.paginate.next
            records.params.limit = data.data.paginate.perPage
            this.setData({
                records: records,
                'prompt.hidden': records.items.length,
            })
        }
    })
  },

})