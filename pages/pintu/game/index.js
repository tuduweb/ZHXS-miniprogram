// pages/play/play.js
let app = getApp();
const device =  wx.getSystemInfoSync();
const width = device.windowWidth;

//const util = require('../../../helpers/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        left:0,
        src:'', // 图片链接
        col:0, // 拼图列数
        row:0, // 拼图行数
        remark:'', // 拼图成功留言

        total: 0, // 拼图块数量
        mwidth:'', // 拼图块宽度
        mheight:'', // 拼图块高度

        back:[], // 拼图各个块的位置和背景图片位置信息
        first:'', // 第一个选中的块
        second:'', // 第二个选中的块
        success:false, // 拼图成功
        animationData:{},
        animationData1:{},

        nickName:'', // 创建者昵称
        avatarUrl:'', // 创建者头像
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

      this.getPintu(options.id)


    },

    // 设置每个网格的背景图位置
    insertBack:function(obj){
        let total = obj.col * obj.rowNum,
            col = obj.col,
            row = obj.rowNum;
        let w = 300 / col,
            h = 300 / row;
        let arr = [];
        for(let i = 0;i<row;i++){
            for (let j = 0;j<col;j++){
                let obj = {};
                obj.hover = '';
                obj.order = i * col + j;
                obj.top = -(i * h);
                obj.left = -(j * w);
                obj.mtop = i * h;
                obj.mleft = j * w;

                obj.animation = {};
                arr.push(obj)
            }
        }
        console.log('初始化拼图分割',arr);
        this.setData({
            back:arr
        })
    },

    // 生成无序数组
    createArr: function (back) {
        let len = this.data.total;
        let arr = Array.from(Array(len), (v, k) => k);
        let i;
        while (len) {
            i = (Math.random() * len--) >>> 0;
            [arr[len], arr[i]] = [arr[i], arr[len]];
        }

        let res = [];
        let col = this.data.col,
            row = this.data.row;
        for (let ind in arr) {
            let obj = back[arr[ind]];

            let mcol = ind % col,
                mrow = parseInt(ind / col);
            // console.log('222222',ind,mcol,mrow);
            // obj.order = arr[ind];
            obj.mtop = mrow * (300 / row);
            obj.mleft = mcol * (300 / col);
            res.push(obj);
        }
        console.log('打乱顺序',res);
        return res
    },

    move: function (e) {
        console.log('移动', e);
        let index = e.currentTarget.dataset.id;
        let arr = this.data.back;
        let first = this.data.first;
        if (first || first == 1) { 
            arr[index].hover = "hover";
            this.setData({
                back: arr
            });

            // 交换fist和second的top和left
            let firstObj = arr[first],
                secondObj = arr[index];
            let firstOrder = firstObj.order,
                firstTop = firstObj.mtop,
                firstLeft = firstObj.mleft;
            firstObj.order = secondObj.order;
            firstObj.mtop = secondObj.mtop;
            firstObj.mleft = secondObj.mleft;
            secondObj.order = firstOrder;
            secondObj.mtop = firstTop;
            secondObj.mleft = firstLeft;

            firstObj.hover = "";
            secondObj.hover = "";

            arr[first] = firstObj;
            arr[index] = secondObj;
            
            
            // console.log('333333', first, index, this.data.back);
            setTimeout(()=>{
                this.setData({
                    first: '',
                    back: arr
                });
            },500)

            setTimeout(() => {
                // 判断是否拼完整了
                let success = this.judgeSuccess(arr);
                this.setData({
                    success: success
                });
                if(success){
                    let animation = wx.createAnimation({
                        duration: 1000,
                        timingFunction: "ease",
                        transformOrigin: "50% 0%",
                    });
                    animation.scale(0.4).step();

                    let animation1 = wx.createAnimation({
                        duration: 3000,
                        timingFunction: "ease",
                        transformOrigin: "50% 0%",
                    });
                    animation1.opacity(1).step();
                    this.setData({
                        animationData: animation.export(),
                        animationData1: animation1.export(),
                    })
                    
                }
            }, 1000)
        } else {
            arr[index].hover = "hover";
            this.setData({
                first: index,
                back: arr
            })
        }
    },

    judgeSuccess:function(arr){
        let res = false;
        let num = 0;
        for(let obj of arr){
            let y = obj.top + obj.mtop,
                x = obj.left + obj.mleft;
            if( y===0 && x===0){
                num++
            }
        }
        if(num == arr.length){
            res = true;
            wx.showToast({
                title: '拼图成功',
                icon: 'success',
                duration: 1000
            })
        }
        return res
    },

    preView:function(){
        let path = this.data.src;
        wx.previewImage({
            urls: [path],
        })
    },

    goBack:function(){
        wx.navigateBack({
            delta:1
        })
    },
    goIndex:function(){
        wx.switchTab({
            url: '/pages/me/index',
        })
    },
    goList:function(){
      wx.switchTab({
          url: '/pages/pintu/list/index',
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

    getPintu: function(_id) {
      App.HttpService.getPintuDetail(_id)
      .then(res => {
        let data = res.data
        if (data.meta.code == 0) {
          
          this.setData({
            itemData: data.data
          })

          wx.setNavigationBarTitle({
            title: "拼图游戏 - " + data.data.shortname
          })


          let left = (width - 300 - 25) / 2;

          let task = {
            "col" : 3,
            "rowNum": 3,
            "img": "https://zhxs.tuduweb.com/static/pintu/" + data.data.imageUrl,
            "remark": "恭喜你，完成了挑战!",
            "nickName": "用户",
            "content": data.data.content.replaceAll("\\n", "\n"),
            "shortname": data.data.shortname
          }

          let total = task.col * task.rowNum;
          let mwidth = 300/task.col,
              mheight = 300/task.rowNum;

          this.setData({
              left: left,
              src: task.img,
              col: task.col,
              row: task.rowNum,
              total: total,
              remark: task.remark + '\n\n',
              mwidth: mwidth,
              mheight: mheight,
              nickName: task.nickName,
              avatarUrl: task.avatarUrl,
              content: task.content,
              shortname: task.shortname
          });

          this.insertBack(task);

          setTimeout(() => {
              // 开始打乱顺序
              console.log('开始打乱顺序动画');
              let arr = this.data.back;
              arr = this.createArr(arr);
              this.setData({
                  back: arr
              })
          }, 1000);

          /*
          // 下载图片
          // console.log('图片路径',task.img);
          // let self = this;
          // let url = util.downloadImgUrl;
          // wx.downloadFile({
          //     url: url + '?path=' + task.img, 
          //     success: function (res) {
          //         // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          //         console.log('图片下载结果',res);
          //         if (res.statusCode == 200) {
          //             let path = res.tempFilePath;
          //             self.setData({
          //                 left: left,
          //                 src: path,
          //                 col: task.col,
          //                 row: task.row,
          //                 total: total,
          //                 remark: task.remark + '\n\n',
          //                 mwidth: mwidth,
          //                 mheight: mheight,
          //                 nickName: task.nickName,
          //                 avatarUrl: task.avatarUrl,
          //             });
          //             self.insertBack(task); // 
          //             setTimeout(() => {
          //                 // 开始打乱顺序
          //                 console.log('开始打乱顺序动画');
          //                 let arr = self.data.back;
          //                 arr = self.createArr(arr);
          //                 self.setData({
          //                     back: arr
          //                 })

          //             }, 1000)
          //         }else{
          //             wx.showModal({
          //                 title: '提示',
          //                 content: '图片下载失败！',
          //             })
          //         }
          //     },
          //     fail:function(err){
          //         console.log('下载图片失败',err);
          //     }
          // })*/


        }
    })}

})