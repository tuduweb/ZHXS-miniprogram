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
    },
    dataLists: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据(组件内部数据)
   */
  data: {
    title: "学校",
    dataList: [{
      name: '其他',
      id: '0'
    }],
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose(e) {
      //通过事件传递的方式, 由子组件给父组件传递数据
      console.log(e.currentTarget.dataset.type, this.data.dataLists[this.data.currentIndex])
      if(e.currentTarget.dataset.type == "submit") {
        this.triggerEvent('cancle', this.data.dataLists[this.data.currentIndex])
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
