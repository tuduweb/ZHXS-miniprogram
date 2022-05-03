import WxValidate from './assets/plugins/wx-validate/WxValidate'
import WxService from './assets/plugins/wx-service/WxService'
import HttpResource from './helpers/HttpResource'
import HttpService from './helpers/HttpService'
import __config from './etc/config'

App({
	onLaunch() {
		console.log('onLaunch')
		console.log(wx.getStorageSync('token'))
	},
	onShow() {
		console.log('onShow')
	},
	onHide() {
		console.log('onHide')
	},
	getUserInfo() {
		return this.WxService.login()
		.then(data => {
            console.log(data)
			return this.WxService.getUserInfo()
		})
		.then(data => {
            console.log(data)
			this.globalData.userInfo = data.userInfo
			return this.globalData.userInfo
		})
	},
	globalData: {
		userInfo: null
	},
	renderImage(path) {
        if (!path) return ''
        if (path.indexOf('http') !== -1) return path
        return `${this.__config.domain}${path}`
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