// pages/learning/detail/index.js
import {
  WaveView
} from '../../../helpers/WaveView';

const App = getApp()
const RecordManager = wx.getRecorderManager()
const AudioPlayer = wx.createInnerAudioContext()
const audioCtx = wx.createWebAudioContext()

let stopFlag = false

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
    titleName: "快板式唱腔",
    currentSegmentIndex: 0,
    segments: [{
        "speaker": "董亚兴",
        "txt": "讲起学，学的补碗补木杓",
        "start": "0",
        "end": "4266",
        "time": "0 - 4秒16",
        "s": "[0, 0, 0]",
        "e": "[0, 4, 16]",
        "line": "董亚兴: 讲起学，学的补碗补木杓（0-4秒16）\n"
      },
      {
        "speaker": "董亚兴",
        "txt": "修补功夫艰难多，不如破篾学织箩",
        "start": "4266",
        "end": "10400",
        "time": "4秒16  - 10秒24",
        "s": "[0, 4, 16]",
        "e": "[0, 10, 24]",
        "line": "修补功夫艰难多，不如破篾学织箩（4秒16 -10秒24）\n"
      },
      {
        "speaker": "董亚兴",
        "txt": "织箩难起笃，不如学做屋",
        "start": "10400",
        "end": "16000",
        "time": "10秒24  - 16秒",
        "s": "[0, 10, 24]",
        "e": "[0, 16, 0]",
        "line": "织箩难起笃，不如学做屋（10秒24 -16秒）\n"
      },
      {
        "speaker": "董亚兴",
        "txt": "做屋上墙又怕跌，不如学打铁",
        "start": "16000",
        "end": "21316",
        "time": "16秒 - 21秒19",
        "s": "[0, 16, 0]",
        "e": "[0, 21, 19]",
        "line": "做屋上墙又怕跌，不如学打铁（16秒-21秒19）\n"
      },
      {
        "speaker": "董亚兴",
        "txt": "打铁无力气，不如“唧格唧格”弹棉被",
        "start": "21316",
        "end": "27433",
        "time": "21秒19 - 27秒26",
        "s": "[0, 21, 19]",
        "e": "[0, 27, 26]",
        "line": "打铁无力气，不如“唧格唧格”弹棉被（21秒19-27秒26）\n"
      },
      {
        "speaker": "董亚兴",
        "txt": "弹棉难脱弓，不如学裁缝",
        "start": "27433",
        "end": "32049",
        "time": "27秒26 - 32秒03",
        "s": "[0, 27, 26]",
        "e": "[0, 32, 3]",
        "line": "弹棉难脱弓，不如学裁缝（27秒26-32秒03）\n"
      },
      {
        "speaker": "董亚兴",
        "txt": "裁缝锤桌角，不如牵猪公",
        "start": "32049",
        "end": "38116",
        "time": "32秒03 - 38秒07",
        "s": "[0, 32, 3]",
        "e": "[0, 38, 7]",
        "line": "裁缝锤桌角，不如牵猪公（32秒03-38秒07）\n"
      },
      {
        "speaker": "董亚兴",
        "txt": "牵着猪公人见贱，还是阉鸡过赚钱",
        "start": "38116",
        "end": "44200",
        "time": "38秒07 - 44秒12",
        "s": "[0, 38, 7]",
        "e": "[0, 44, 12]",
        "line": "牵着猪公人见贱，还是阉鸡过赚钱（38秒07-44秒12）\n"
      },
      {
        "speaker": "董亚兴",
        "txt": "阉鸡阉出肠，不如舞蛇卖药方",
        "start": "44200",
        "end": "50100",
        "time": "44秒12 - 50秒06",
        "s": "[0, 44, 12]",
        "e": "[0, 50, 6]",
        "line": "阉鸡阉出肠，不如舞蛇卖药方（44秒12-50秒06）\n"
      },
      {
        "speaker": "董亚兴",
        "txt": "卖药又怕医烂脚  算来算去无件好来学   好来学",
        "start": "55100",
        "end": "58400",
        "time": "55秒06 - 58秒24",
        "s": "[0, 55, 6]",
        "e": "[0, 58, 24]",
        "line": "卖药又怕医烂脚  算来算去无件好来学   好来学（55秒06-58秒24）\n"
      }

    ],
    comments: ['咬字不清晰', '吐词不够有力', '尖团字发音不够清晰', '气息不够通畅', '没有运用丹田气息来演唱，气和声音不和谐', '声音不够宏亮，韵味还不足', '强弱轻重力度表现不明显', '结束弱收没弱下来', '结束强收不够强', '气息、声带和共鸣腔体不够协调统一', '未能使用真假声相结合的唱法', '气息浮浅，声带紧张，缺乏共鸣', '气息的运用、平稳和持久度不够', '用气过头、使于蛮力、容易造成跑调或破音的现象', '发音扁而挤、犬，发音不完美', '声音虚而闷，不够张力', '字和音暗淡苦涩，不明朗', '声带开合不严谨、不均匀', '气息不连贯', '注意字重腔轻、字刚腔柔，字正腔圆', '气息不足、发声无力', '咬字清晰', '吐词干脆利索', '尖团字发音清晰', '气息通畅', '能运用丹田气息来演唱，气息和声带配合完美', '声音宏亮、富有韵味', '强弱轻重表现明显', '结束弱收能弱下来 ', '气息、声带和共鸣腔体协调', '能使用真假声相结合的唱法', '气息沉稳，声带放松，能引起共鸣', '气息的平稳和持久度好', '用气适中、富有表现力', '发音字正腔圆，共鸣完美', '字音洪亮、明朗', '声带开合严谨', '气息均匀、流畅', '能字正腔圆、字刚腔柔'],
    recording: false, // 正在录音
    recordStatus: 0, // 状态： 0 - 录音中 1- 翻译中 2 - 翻译完成/二次翻译

    records: [],

    isAuthRecord: false,

    grade: 0,
    commentId: -1,
    logtxt: 'loglog',

    userInfo: {
      studyTimeCnt: 0,
      studyData: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    'http://172.20.144.113:8080/video1.mp4';
    
    //获取study_id
    console.log("options", options)
    if(options.id) {
      console.log("设置了id")
    }
    this.setData({
      studyId: options.id
    })
    const id = this.data.studyId
    App.HttpService.getStudyDetail(id)
    .then(res => {
        const data = res.data
        console.log("studyDetail", data)
        if (data.meta.code == 0) {
          //调用成功
          this.setData({
            videoUrl: data.data.videoUrl,
            comments: data.data.coments,
            segments: data.data.segments
          })
        } else {
          //发生错误
        }
    })

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
    const query = wx.createSelectorQuery()
    query.select('#study-video').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res[0]) // #the-id节点的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
      const _videoObj = wx.createVideoContext("study-video", res[0])
      console.log(_videoObj)

    })
    console.log("onShow")

    const videoObj = wx.createVideoContext('study-video')
    console.log(videoObj)
    //videoObj.pause()

    this.allocAuthorize()

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

  onVideoTimeUpdate: function (e) {
    //播放进度变化时触发，event.detail = {currentTime, duration} 。触发频率 250ms 一次
    recordInfo.timeUpdateCnt += 1
    this.setData({
      'userInfo.studyTimeCnt': this.data.userInfo.studyTimeCnt + 1
    })

    let videoContext = wx.createVideoContext('study-video', this);
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

  onVoiceRecord: function (e) {
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

  initStreamRecord: function () {

    const _this = this;

    RecordManager.onStop(res => {
      console.log("onStop")
      console.log(res)

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
        url: "http://172.20.144.113:3001/api/study/1/record/" + (this.data.currentSegmentIndex + 1),
        //url: "http://8.134.216.143:5000/upload",
        filePath: res.tempFilePath,
        name: "file",
        formData: {
          'msg': 'voice',
          'segId': this.data.currentSegmentIndex + 1,
          'id': 1
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
            content: "系统与远程服务器通信时发生错误",
            navBack: false
          })

          console.log("err", err)
        }
      })

    })

    //流式录音接口	在onFrameRecordedzh中不断获取分片，持续获取，持续处理	
    RecordManager.onFrameRecorded(res => {

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

  streamRecord: function (e) {
    // console.log("streamrecord" ,e)
    let detail = e.detail || {}
    let buttonItem = detail.buttonItem || {}

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
    if (!this.data.recording || this.data.recordStatus != 0) {
      console.warn("has finished!")
      return
    }

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
      return
    this.setData({
      currentSegmentIndex: this.data.currentSegmentIndex + 1
    })
    let videoContext = wx.createVideoContext('study-video');
    videoContext.play()
  },
  streamSegmentReplay: function(e) {
    let detail = e.detail || {} // 自定义组件触发事件时提供的detail对象
    let buttonItem = detail.buttonItem || {}

    //可能要加入, 在播放时?禁止按重来
    let videoContext = wx.createVideoContext('study-video');
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

          console.log(myArrayBuffer)

          var chan = buffer.getChannelData(0);
          console.log("chan", chan)

          let sum = 0.0;
          console.log("sum", sum);

          for (let index = 0; index < chan.length / 5; index++) {
            sum += chan[index];
          }
          console.log("sum", sum);

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

  }

})