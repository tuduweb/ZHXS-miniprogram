// pages/learning/detail/index.js
import { WaveView } from '../../../helpers/WaveView';

const App = getApp()
const RecordManager = wx.getRecorderManager()
const AudioPlayer = wx.createInnerAudioContext()
const audioCtx = wx.createWebAudioContext()

let stopFlag = false


Page({

      /**
       * 页面的初始数据
       */
      data: {
        studyId: 1,
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

        grade: 80,
        commentId: -1

      },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取study_id
    console.log(options.query)

    const id = this.data.studyId
    App.HttpService.getStudyDetail(id)
    .then(res => {
        const data = res.data
        console.log("studyDetail", data)
        if (data.meta.code == 0) {
            //
        }
    })

    this.initStreamRecord()
    this.initWave()

    //this.DrawCanvas()


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
      const _videoObj = wx.createVideoContext("study-video", res[0])
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
    let videoContext = wx.createVideoContext('study-video', this);
    //console.log(e.detail.currentTime)
    var currentTime = parseInt(e.detail.currentTime)
    if(currentTime >= this.data.segments[this.data.currentSegmentIndex].end / 1000) {
      videoContext.pause()
      //console.log(e.detail.currentTime)

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

      wx.uploadFile({
        url: "http://172.20.144.113:3001/api/study/1f2f301d/record/" + this.data.currentSegmentIndex,
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
          console.log("res", res)
          if(res.statusCode != 200) {
            console.log(res.statusCode);
            return;
          }
          let _data = JSON.parse(res.data).data
          console.log("parsed", _data)
          this.setData({
            grade: _data.grade,
            commentId: _data.commentId
          })
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
      
      console.log(res.frameBuffer.byteLength)
      
      var array = new Int8Array(res.frameBuffer);

      console.log(array[0])
      

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
      format: 'PCM',
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
  streamNext: function(e) {
    this.setData({
      currentSegmentIndex : this.data.currentSegmentIndex + 1
    })
    let videoContext = wx.createVideoContext('study-video');
    videoContext.play()
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