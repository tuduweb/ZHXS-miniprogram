// pages/learning/detail/index.js
import { WaveView } from '../../../helpers/WaveView';

const App = getApp()
const RecordManager = wx.getRecorderManager()
const AudioPlayer = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSegmentIndex: 0,
    sugments: [],

    recording: false,  // 正在录音
    recordStatus: 0,   // 状态： 0 - 录音中 1- 翻译中 2 - 翻译完成/二次翻译

    records: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initStreamRecord()
    this.initWave()
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
    const query = wx.createSelectorQuery()
    query.select('#study-video').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res){
      console.log(res[0])       // #the-id节点的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
      const _videoObj = wx.createVideoContext("study-bideo", res[0])
      console.log(_videoObj)

    })
    console.log("onShow")
  
    const videoObj = wx.createVideoContext('study-video')
    console.log(videoObj)
    //videoObj.pause()
  
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

  onVideoTimeUpdate: function(e) {
    console.log(e.detail.currentTime)
    var currentTime = parseInt(e.detail.currentTime)
    if(currentTime >= 1) {
      let videoContext = wx.createVideoContext('study-video', this);
      videoContext.pause()
      console.log(e.detail.currentTime)

      // wx.showModal({
      //   title: '充值提示',
      //   content: "非会员只能看前五分钟的内容", //提示内容
      //   confirmColor: '#2EA7E0', //确定按钮的颜色
      //   showCancel: false, //不显示取消按钮
      //   success(res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定按钮')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消按钮')
      //     }
      //   }
      // })
        

    }
  },

  onVoiceRecord: function(e) {
    RecordManager.start()

    this.setData({
      recordStatus: 0,
      recording: true,
      currentTranslate: {
        // 当前语音输入内容
        create: util.recordTime(new Date()),
        text: '正在聆听中',
      },
    })
    //this.scrollToNew();
  
  },

  initStreamRecord: function() {

    const _this = this;

    RecordManager.onStop(res => {
      console.log("onStop")
      console.log(res)

      let _records = this.data.records
      _records.push(res)
      this.setData({
        records: _records
      })
      console.log(_records)

      wx.uploadFile({
        url: "http://172.20.144.113:3001/api/study/1f2f301d/record/1",
        filePath: res.tempFilePath,
        name: "file",
        formData: {
          'msg': 'voice'
        }, // HTTP 请求中其他额外的 form data
        header: {
          'content-type' : 'application/json',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: res => {
          console.log(res)
        },
        fail: err => {
          console.log("err", err)
        }
      })

    })

    //流式录音接口	在onFrameRecordedzh中不断获取分片，持续获取，持续处理	
    RecordManager.onFrameRecorded(res => {
      console.log(res)
      _this.setData({
        recordImage: _this.data.baseRecordImage + (Math.floor(Math.random()*5) + 2) + ".png",
        hiddenImage: false
      })
      if (_this.data.waveView) {
        _this.data.waveView.input();
      }
    })

  },

  streamRecord: function(e) {
    // console.log("streamrecord" ,e)
    let detail = e.detail || {}
    let buttonItem = detail.buttonItem || {}

    RecordManager.start({
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      frameSize: 1
    })

    this.setData({
      recordStatus: 0,
      recording: true,
      currentTranslate: {
        // 当前语音输入内容
        //create: util.recordTime(new Date()),
        text: '正在聆听中',
      }
    })

  },
  streamRecordEnd: function(e) {
    let detail = e.detail || {}  // 自定义组件触发事件时提供的detail对象
    let buttonItem = detail.buttonItem || {}

        // 防止重复触发stop函数
        if(!this.data.recording || this.data.recordStatus != 0) {
          console.warn("has finished!")
          return
        }

        RecordManager.stop()
  },

  streamAudioPlay: function(e) {
    console.log(e.currentTarget.dataset.filepath)
    let filePath = e.currentTarget.dataset.filepath
    AudioPlayer.src = filePath
    AudioPlayer.autoplay = true
    AudioPlayer.onPlay(() => {
      console.log('开始播放')
    })
    AudioPlayer.onEnded(() => {
      console.log('结束')
    })
  },

  initWave() {
    const _this = this;
    const query = this.createSelectorQuery();
    query.select('#wave')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const waveView = new WaveView({
          elem: canvas,
          width:wx.getSystemInfoSync().windowWidth,
          height:100,
          scale: 1
        });
        _this.setData({
          waveView: waveView
        });
      })
  }

})