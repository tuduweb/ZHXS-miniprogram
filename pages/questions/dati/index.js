// pages/questions/detail/index.js
const App = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentIndex: 0,
        maxIndex: 10,
        questions: [
            // {
            //     title: "这是一个题目的演示",
            //     content: "这是这个题目的内容，要放多点占点位置吧。这是这个题目的内容，要放多点占点位置吧。",
            //     options: ["选项一", "选项二", "选项三", "选项四"],
            //     answers: [0]
            // },
        ],
        choices: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.id != "undefined")
            this.matchDetail(options.id)

    },
    btn_choose: function (e) {
        //根据题目类型判断
        let duoxuan = this.data.questions[this.data.currentIndex].answerCnt > 1
        let _key = 'choices[' + this.data.currentIndex + ']'
        //深拷贝一个数组, 防止出现共用数组后使用push带来的非正常结果；或者在fill数据时做处理..使之不共享数组
        let _choices = this.data.choices[this.data.currentIndex].concat()

        if(duoxuan) {
            let pos = this.data.choices[this.data.currentIndex].indexOf(e.target.dataset.option)
            if(pos > -1) {
                _choices.splice(pos, 1)
            }else{
                _choices.push(e.target.dataset.option)
            }
        }else{
            _choices = [e.target.dataset.option]
        }

        console.log("index - choices", this.data.currentIndex, _choices)

        this.setData({
            [_key]: _choices
        })
    },
    goToScore: function (e) {
        console.log("index - choices", this.data.currentIndex, this.data.choices, this.data.choices[this.data.currentIndex])
    },
    btn_goto: function (e) {
        //this.data.currentIndex = e.target.dataset.index
        this.setData({
            currentIndex: e.target.dataset.index
        })
    },
    btn_last: function (e) {
        if (this.data.currentIndex > 0)
            this.setData({
                currentIndex: this.data.currentIndex - 1
            })
    },
    btn_next: function (e) {
        if (this.data.currentIndex < this.data.maxIndex) {
            this.setData({
                currentIndex: this.data.currentIndex + 1
            })
        }
    },
    btn_submit: function (e) {
        this.matchSubmit(e)

        App.HttpService.matchSubmit({
            id: this.data.id,
            choices: this.data.choices
        }).then(res => {
            console.log(res)
            wx.redirectTo({
                url: '../result/score?matchId=' + res.data.data._id
            })
        })

    },
    matchDetail: function(_id) {
        App.HttpService.matchDetail(_id)
        .then(res => {
            //if(res.meta)
            console.log(res)
            if(res.statusCode == 200) {
                this.setData({
                    'questions': res.data.data.questionsData,
                    'id': _id,
                    choices: new Array(res.data.data.questionsData.length).fill([])
                })
            }

        }
        )
        .catch(err => console.log(err))
    },
    matchSubmit: function (e) {

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

    },

    startMatch: function () {
        /* 使用match构建数据 核心是题目 获取n道题目. */

        //构建核心数据
        const coreData = {
            startTime: Date.now(),
            limitTime: 100,
        }

        //构建题目数据
        //向 /api/match/start 或其它接口请求后, 生成{meta.., data..} 的数据.其中data就是需要用来答题的数据.


        //
    },

    submitMatch: function() {

        //检查是否所有题目都有选中

        //构造提交数据

        //提交数据
        //获取反馈结果
        //跳转到result页
        App.HttpService.matchSubmit({
            id: '6235e9542921d348d1baed65',
            choices: this.data.choices
        }).then(res => {
            console.log(res)
            wx.redirectTo({
                url: '../result/score?matchId=' + res.data.data._id
            })
        })

    }

})