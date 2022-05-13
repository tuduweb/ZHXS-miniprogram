// pages/learning/detail/index.js

import __config from '../../../etc/config'

import {
  WaveView
} from '../../../helpers/WaveView';

const App = getApp()
const RecordManager = wx.getRecorderManager()
const AudioPlayer = wx.createInnerAudioContext()
const audioCtx = wx.createWebAudioContext()

let stopFlag = false
let videoContext

//这里可以封装成全局函数..作为一种服务
//在视频时间戳更新时计时,
let recordInfo = {
  'studyTime': 0,
  'timeUpdateCnt': 0
}

Page({

  /**
   * 页面的初始数据
   */
  waveView: null,
  data: {
    studyId: 1,
    currentSegmentIndex: 0,
    segments: [
      // {
      //   "speaker": "董亚兴",
      //   "txt": "讲起学，学的补碗补木杓",
      //   "start": "0",
      //   "end": "4266",
      //   "time": "0 - 4秒16",
      //   "s": "[0, 0, 0]",
      //   "e": "[0, 4, 16]",
      //   "line": "董亚兴: 讲起学，学的补碗补木杓（0-4秒16）\n"
      // },

    ],
    comments: [],
    recording: false, // 正在录音
    recordStatus: 0, // 状态： 0 - 录音中 1- 翻译中 2 - 翻译完成/二次翻译

    records: [],

    isAuthRecord: false,

    grade: 0,
    commentId: -1,
    logtxt: 'loglog',

    isRecording: false,

    userInfo: {
      studyTimeCnt: 0,
      studyData: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    //获取study_id
    console.log("options", options)
    if(options.sid) {
      console.log("设置了id")
    }
    this.setData({
      studyId: options.sid
    })
    this.allocAuthorize()

    this.initStudyData()

    this.initStudySystem()
    this.initStreamRecord()
    this.initWave()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.parseUrlAudio("http://172.20.144.113:8080/example/media/lc_3.wav")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // const query = wx.createSelectorQuery()
    // query.select('#study-video').boundingClientRect()
    // query.selectViewport().scrollOffset()
    // query.exec(function (res) {
    //   console.log(res[0]) // #the-id节点的上边界坐标
    //   res[1].scrollTop // 显示区域的竖直滚动位置
    //   const _videoObj = wx.createVideoContext("study-video", res[0])
    //   console.log("_videoObj", _videoObj)

    // })

    const videoObj = wx.createVideoContext('study-video')
    console.log("videoObj", videoObj)
    //videoObj.pause()
  
    videoContext = wx.createVideoContext('study-video', this);

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
    //需要定制成相关..
    return App.ShareApp()
  },

  onVideoTimeUpdate: function (e) {
    //播放进度变化时触发，event.detail = {currentTime, duration} 。触发频率 250ms 一次
    recordInfo.timeUpdateCnt += 1
    this.setData({
      'userInfo.studyTimeCnt': this.data.userInfo.studyTimeCnt + 1
    })

    //console.log(e.detail.currentTime)
    var currentTime = parseInt(e.detail.currentTime)
    //recordInfo
    if (currentTime >= this.data.segments[this.data.currentSegmentIndex].end / 1000) {
      videoContext.pause()
      //console.log(e.detail.currentTime)
    }
  },

  onVideoError: function(e) {
    
    this.onSystemError({
      title: '网络错误',
      content: "连接视频服务器失败", //提示内容
      navBack: true
    })

  },

  onSystemError: function(config) {

    wx.showModal({
      title: config['title'] ?  config['title'] : '系统错误',
      content: config['content'] ? config['content']: "系统发生错误，即将退出。", //提示内容
      confirmColor: '#2EA7E0', //确定按钮的颜色
      showCancel: false, //不显示取消按钮
      success(res) {
        //保存状态然后退出?
        // wx.redirectTo({
        //   url: '/pages/me/me',
        // })
        if (res.confirm) {
          console.log('用户点击确定按钮')
          if(config['navBack'])
            wx.navigateBack({ changed: true })
        } else if (res.cancel) {
          console.log('用户点击取消按钮')
        }
      }
    
    })
  },

  // onVoiceRecord: function (e) {

  //   this.setData({
  //     isRecording: false
  //   })
 
  //   RecordManager.start()

  //   this.setData({
  //     recordStatus: 0,
  //     recording: true,
  //     currentTranslate: {
  //       // 当前语音输入内容
  //       create: util.recordTime(new Date()),
  //       text: '正在聆听中',
  //     },
  //   })
  //   //this.scrollToNew();

  // },

  initStreamRecord: function () {

    const _this = this;

    RecordManager.onStop(res => {
      console.log(res)

      if(res.duration <= 1000) {
        console.log("时间不够", res.duration)
        wx.hideLoading()
        return
      }

      let _records = this.data.records
      _records.push(res)
      this.setData({
        records: _records
      })

      this.parseFileAudio(res.tempFilePath)

      wx.request({
        url: res.tempFilePath, // 音频 url
        responseType: 'arraybuffer',
        success: res => {
          audioCtx.decodeAudioData(res.data, buffer => {
            console.log("decodeAudioData", buffer)
          }, err => {
            console.error('decodeAudioData fail', err)
          })
        }
      })

      console.log("_records", _records)
      this.setData({
        logtxt: '正在上传'
      })
      wx.uploadFile({
        //url: "http://172.20.144.113:3001/api/study/1f2f301d/record/" + this.data.currentSegmentIndex,
        url: __config.domain + "api/study/" + this.data.studyId +"/record/" + (this.data.currentSegmentIndex + 1),
        //url: "http://8.134.216.143:5000/upload",
        filePath: res.tempFilePath,
        name: "file",
        formData: {
          'msg': 'voice',
          'segId': this.data.currentSegmentIndex + 1,
          'id': this.data.studyId
        }, // HTTP 请求中其他额外的 form data
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: res => {

          wx.hideLoading()

          this.setData({
            logtxt: 'success'
          })

          console.log("res", res)
          if (res.statusCode != 200) {
            console.log(res.statusCode);
            return;
          }
          let _data = JSON.parse(res.data)
          if (_data.meta.code == 1) {
            console.log('err status == 1')
            return
          }
          console.log("parsed", _data)
          let _grade = Math.ceil(_data.data.score)

          if (_grade > 99)
            _grade = 99

          if (_grade < 0)
            _grade = 0

          this.setData({
            commentId: _data.data.commentId,
            grade: _grade
          })

        },
        fail: err => {

          wx.hideLoading()

          this.setData({
            logtxt: "系统与远程服务器通信时发生错误"
          })

          this.onSystemError({
            title: '网络错误',
            content: "系统获取视频失败，请检查网络。",
            navBack: false
          })

          console.log("err", err)
        }
      })

    })

    //流式录音接口	在onFrameRecordedzh中不断获取分片，持续获取，持续处理	
    RecordManager.onFrameRecorded(res => {

      if(this.data.isRecording == false) {
        RecordManager.stop()
        return
      }
      
      console.log(res)
      _this.setData({
        recordImage: _this.data.baseRecordImage + (Math.floor(Math.random() * 5) + 2) + ".png",
        hiddenImage: false
      })

      if (_this.waveView) {
        //_this.data.waveView.input();
      }

    })

  },

  streamRecordStart: function (e) {
    
    this.setData({
      isRecording: true
    })

    let detail = e.detail || {}
    let buttonItem = detail.buttonItem || {}

    if(this.data.isRecording == false) {
      return
    }

    RecordManager.start({
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'wav',
      frameSize: 1
    })

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
  streamRecordEnd: function (e) {


    let detail = e.detail || {} // 自定义组件触发事件时提供的detail对象
    let buttonItem = detail.buttonItem || {}

    // 防止重复触发stop函数
    if (!this.data.isRecording || this.data.recordStatus != 0) {
      console.warn("has finished!")
      return
    }

    this.setData({
      isRecording: false
    })

    //如果时间太短..

    //wx.hideLoading()
    wx.showLoading({
      title: '正在解析',
    })

    RecordManager.stop()
    
    //显示..
    //parseFileAudio
  },

  streamAudioPlay: function (e) {
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
  streamNext: function (e) {
    console.log(this.data.currentSegmentIndex, this.data.segments.length)

    if (this.data.currentSegmentIndex >= this.data.segments.length - 1)
    {
      return
    }
    
    this.setData({
      currentSegmentIndex: this.data.currentSegmentIndex + 1
    })
    videoContext.seek(this.data.segments[this.data.currentSegmentIndex].start / 1000)
    videoContext.play()
  },
  streamSegmentReplay: function(e) {
    let detail = e.detail || {} // 自定义组件触发事件时提供的detail对象
    let buttonItem = detail.buttonItem || {}

    //可能要加入, 在播放时?禁止按重来
    videoContext.seek(this.data.segments[this.data.currentSegmentIndex].start)
    videoContext.play()
  },
  initWave() {
    const _this = this;
    const query = this.createSelectorQuery();
    query.select('#wave')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const waveView = new WaveView({
          elem: canvas,
          width: wx.getSystemInfoSync().windowWidth,
          height: 100,
          scale: 1
        });
        console.log(waveView)
        _this.waveView = waveView
      })
  },
  DrawCanvas: function () {
    const _this = this;
    const query = this.createSelectorQuery();
    query.select('#wave2')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        console.log(res[0])

        let width = res[0].width
        let height = res[0].height

        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0, 0, 1, height);
        //ctx.clearRect(0, 0, width, height);

      })
  },

  parseUrlAudio: function (url) {
    console.log("start parse:", url)
    wx.request({
      url: url, // 音频 url
      responseType: 'arraybuffer',
      success: res => {
        audioCtx.decodeAudioData(res.data, buffer => {
          console.log("buffer", buffer)

          const myArrayBuffer = audioCtx.createBuffer(2, buffer.length, audioCtx.sampleRate);

          //console.log(myArrayBuffer)

          var chan = buffer.getChannelData(0);
          //console.log("chan", chan)

          this.waveView.demoBuffer(buffer);

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

          // const myArrayBuffer = audioCtx.createBuffer(2, buffer.length, audioCtx.sampleRate);
          // console.log(myArrayBuffer)
          // var chan = buffer.getChannelData(0);

          this.waveView.demoBuffer(buffer);
          
        }, err => {
          console.error('decodeAudioData fail', err)
        })
      }
    })
  },

  allocAuthorize: function() {
    //申请授权
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    var that = this
    wx.getSetting({
      success(res) {
        console.log("权限", res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success () {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              that.setData({
                isAuthRecord: true
              })
              console.log("授权成功")
            }
          })
        }else{
          that.setData({
            isAuthRecord: true
          })
        }
      }
    })

  },


  //userSystem
  initStudySystem: function() {
    //
    console.log("init study system")

  },

  initStudyData: function() {

    const id = this.data.studyId
    App.HttpService.getStudyDetail(id)
    .then(res => {
        const data = res.data
        //console.log("studyDetail", res)
        if (data.meta.code == 0) {
          //调用成功
          this.setData({
            videoUrl: data.data.videoUrl,
            comments: data.data.comments,
            segments: data.data.segments
          })

          wx.setNavigationBarTitle({
            title: "唱腔练习 - " + data.data.title
          })
        } else {
          //发生错误 //与登录冲突
          // this.onSystemError({
          //   title: '服务器错误',
          //   content: "远程服务器发生错误",
          //   navBack: true
          // })
        }
    })
    .catch(err => {
      this.onSystemError({
        title: '网络错误',
        content: "系统与远程服务器通信时发生错误",
        navBack: true
      })
    })

  },

  buttonStart: function(e) {
    console.log("button start", e)
  },

  buttonEnd: function(e) {
    console.log("button end", e)
  }

})