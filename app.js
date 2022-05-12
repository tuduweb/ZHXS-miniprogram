import WxValidate from './assets/plugins/wx-validate/WxValidate'
import WxService from './assets/plugins/wx-service/WxService'
import HttpResource from './helpers/HttpResource'
import HttpService from './helpers/HttpService'
import __config from './etc/config'

App({
	onLaunch() {
    console.log('onLaunch')   
    
    this.autoUpdate()

    let accountInfo = wx.getAccountInfoSync(); 
    let appid = accountInfo.miniProgram.appId; // "wxfb6368d158c85cb7"小程序appid
    let envVersion = accountInfo.miniProgram.envVersion; // "develop"开发版
    let version = accountInfo.miniProgram.version; // 1.0.0 小程序版本号
    console.log("版本:", __wxConfig.envVersion, appid, version, wx.getStorageSync('version'))
    if(wx.getStorageSync('version') == version) {
      //是最新版本, 不做处理
    }else{
      //需要升级信息,或者初次启动,那么先让用户退出..
      if(wx.getStorageSync('token')) {
        wx.removeStorageSync('token')
      }
      wx.setStorageSync('version', version)
    }

	},
	onShow(options) {
    //进入小程序的方式
    console.log(options.scene)//1011 扫码进入, 场景
  },
	onHide() {
		console.log('onHide')
	},
	getUserInfo() {
		return this.WxService.login()
			.then(data => {
				console.log(data)
				return this.WxService.getUserInfo() //getUserInfo
			})
			.then(data => {
				console.log(data)
				this.globalData.userInfo = data.userInfo
				return this.globalData.userInfo
			})
	},
	globalData: {
		userInfo: null,
		isUserLogin: false
	},

	checkLogin: function() {
		return false
	},

	login: function(cb) {
		this.wechatSignIn(cb)
	},

	wechatDecryptData() {
		let code

		this.WxService.login()
		.then(data => {
			// console.log('wx.login data', data)
			// console.log('wechatDecryptData', data.code)
			code = data.code
			return this.WxService.getUserInfo() //getUserInfo //getUserProfile
		})
		.then(data => {
			// console.log("userData", data)
			return this.HttpService.wechatDecryptData({
				encryptedData: data.encryptedData, 
				iv: data.iv, 
				rawData: data.rawData, 
				signature: data.signature, 
				code: code, 
			})
		})
		.then(data => {
			console.log(data)
		})
	},

	wechatSignIn(cb) {
		//已经登
		if (this.WxService.getStorageSync('token')) return
		this.WxService.login()
		.then(data => {
			console.log('wechatSignIn', data.code)
			return this.HttpService.wechatSignIn({
				code: data.code
			})
		})
		.then(res => {
			const data = res.data
			console.log('wechatSignIn', data)
			if (data.meta.code == 0) {
				this.WxService.setStorageSync('token', data.data.token)
				cb()
			} else if(data.meta.code == 40029) {
				this.showModal()
			} else {
				this.wechatSignUp(cb)
			}
		})
	},
	wechatSignUp(cb) {
		this.WxService.login()
		.then(data => {
			console.log('wechatSignUp', data.code)

			let refInfo = this.WxService.getStorageSync('refInfo')

			return this.HttpService.wechatSignUp({
				code: data.code,
				refInfo: refInfo
			})
		})
		.then(res => {
			const data = res.data
			console.log('wechatSignUp', data)
			if (data.meta.code == 0) {
				this.WxService.setStorageSync('token', data.data.token)
				cb()
			} else if(data.meta.code == 40029) {
				this.showModal()
			}
		})
	},
	signIn(cb) {
		if (this.WxService.getStorageSync('token')) return
		this.HttpService.signIn({
			username: 'admin', 
			password: '123456', 
		})
		.then(res => {
            const data = res.data
            console.log(data)
			if (data.meta.code == 0) {
				this.WxService.setStorageSync('token', data.data.token)
				cb()
			}
		})
	},

	renderImage(path) {
		if (!path) return ''
		if (path.indexOf('http') !== -1) return path
		return `${this.__config.domain}${path}`
  },
  
  ShareApp: () => {
    //通用性分享App程序 //用于全局没有特殊定义时的分享页面

    //根据是否登录 分享不同的页面..
    return {
      title: "用户给你分享了一个小程序",
      path: "/pages/start/index"
    }
  },

  autoUpdate: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用applyUpdate应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      // 此时微信版本太低（一般而言版本都是支持的）
      wx.showModal({
        title: '溫馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },


	WxValidate: (rules, messages) => new WxValidate(rules, messages),
	HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
	HttpService: new HttpService({
		baseURL: __config.basePath,
	}),
	WxService: new WxService,
	__config,
})

// "pages/classify/index",
// "pages/cart/index",
// "pages/address/list/index",
// "pages/address/add/index",
// "pages/address/edit/index",
// "pages/address/confirm/index",
// "pages/order/list/index",
// "pages/order/confirm/index",
// "pages/order/detail/index",
// "pages/goods/list/index",
// "pages/goods/detail/index",
// "pages/help/list/index",
// "pages/help/detail/index",
// "pages/search/index",
// "pages/about/index",