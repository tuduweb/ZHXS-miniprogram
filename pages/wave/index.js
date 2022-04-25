// pages/wave/index.js
import { WaveView } from '../../helpers/WaveView';

const App = getApp()
const RecordManager = wx.getRecorderManager()
const AudioPlayer = wx.createInnerAudioContext()
const audioCtx = wx.createWebAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initStreamRecord()
    
    this.initWave()

    this.parseUrlAudio("http://172.20.144.113:8080/example/media/lc_3.wav")

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

  },


  initStreamRecord: function() {

    const _this = this;

    RecordManager.onStop(res => {
      console.log("onStop")
      console.log(res)

      let _records = this.data.records
      _records.push(res)

      this.setData({
        records : _records
      })

      if (this.data.waveView) {
        this.data.waveView.input();
      }
    })



    //流式录音接口	在onFrameRecordedzh中不断获取分片，持续获取，持续处理
    RecordManager.onFrameRecorded(res => {
      console.log(res)
      this.setData({
        recordImage: _this.data.baseRecordImage + (Math.floor(Math.random()*5) + 2) + ".png",
        hiddenImage: false
      })

      console.log( Date.now(),res.frameBuffer.byteLength)
      
      var array = new Int8Array(res.frameBuffer);
      console.log(array)
      console.log(array[0])

    })
  },

  streamRecord: function(e) {
    // console.log("streamrecord" ,e)
    let detail = e.detail || {}
    let buttonItem = detail.buttonItem || {}

    RecordManager.start({
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'wav',
      frameSize: 32
    })
    //参数只认整数..所以好像不可能是1s这样的设定 需要缜密计算一下//32->32768
    //numberOfChannels改成2 临时数据直接大一倍

    wx.showLoading({
      title: '正在录制', 
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

        wx.hideLoading()

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
    this.parseFileAudio(filePath)
  },

  parseUrlAudio: function(url) {
    console.log("start parse:", url)
    wx.request({
      url: url, // 音频 url
      responseType: 'arraybuffer',
      success: res => {
        audioCtx.decodeAudioData(res.data, buffer => {
          console.log("buffer", buffer)
          //var chan = audioCtx.getChannelData(0);
          //console.log("chan", chan)
        
          // const source = audioCtx.createBufferSource()

          // source.buffer = buffer
          // console.log(source)
          // source.connect(audioCtx.destination)
          // source.start()

          const myArrayBuffer = audioCtx.createBuffer(2, buffer.length, audioCtx.sampleRate);

          console.log(myArrayBuffer)

          var chan = buffer.getChannelData(0);
          console.log("chan", chan)

          let sum = 0.0;
          console.log("sum", sum);

          for (let index = 0; index < chan.length / 5; index++) {
            sum += chan[index];
          }
          console.log("sum", sum);

          this.data.waveView.demoBuffer(buffer);

        }, err => {
          console.error('decodeAudioData fail', err)
        })
      },
      error: err => {
        console.log(err)
      }
    })
  },
  parseFileAudio: function(url) {
    console.log("parseFileAudio", url)
    const FileSystemManager = wx.getFileSystemManager()
    FileSystemManager.readFile({
      filePath: url,
      success: res => {
        audioCtx.decodeAudioData(res.data, buffer => {
          console.log("buffer", buffer)

          const myArrayBuffer = audioCtx.createBuffer(2, buffer.length, audioCtx.sampleRate);

          console.log(myArrayBuffer)

          var chan = buffer.getChannelData(0);
          console.log("chan", chan)
          let sum = 0.0;
          console.log("sum", sum);

          for (let index = 0; index < chan.length / 5; index++) {
            sum += chan[index];
          }

          console.log("sum", sum);

          this.data.waveView.demoBuffer(buffer);
          
        }, err => {
          console.error('decodeAudioData fail', err)
        })
      }
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
          width: wx.getSystemInfoSync().windowWidth,
          height:100,
          scale: 1
        });
        _this.setData({
          waveView: waveView
        });
      })
  },
  DrawCanvas: function() {
    const _this = this;
    const query = this.createSelectorQuery();
    query.select('#wave2')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        console.log(res[0])

        let width = res[0].width
        let height = res[0].height

        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FF0000"; 　
        ctx.fillRect( 0, 0, 1,height);
        //ctx.clearRect(0, 0, width, height);

      })
  }

})