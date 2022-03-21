Page({
	onShareAppMessage: function() {  
    // const promise = new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve({
    //       title: '自定义转发标题12345'
    //     })
    //   }, 500)
    // })
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      //promise 
    }
  }
})