// components/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: "组件标题"
    }
  },

  /**
   * 组件的初始数据(组件内部数据)
   */
  data: {
    title: "学校",
    dataList: [{
      key: '湘潭大学',
      value: 1
    },{
      key: '湘潭市一中',
      value: 2
    },{
      key: '湘潭市第一小学',
      value: 3
    },{
      key: '湘大附小',
      value: 4
    },{
      key: '其他',
      value: 5
    }],
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose(e) {
      //通过事件传递的方式, 由子组件给父组件传递数据
      console.log(e.currentTarget.dataset.type, this.data.dataList[this.data.currentIndex])
      if(e.currentTarget.dataset.type == "submit") {
        this.triggerEvent('cancle', this.data.dataList[this.data.currentIndex])
      }else{
        this.triggerEvent('cancle', {})
      }
    },
    handleDataChange(e) {

      this.setData({
        currentIndex: e.detail.value[0]
      })

    }
  }
})
