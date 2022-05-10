const App = getApp()

Page({
    data: {
        indicatorDots: !1,
        autoplay: 1,
        current: 0,
        interval: 1500,
        duration: 1000,
        circular: !1,
    },
    onLoad() {},
    onShow() {},
    bindload(e) {
    	setTimeout(App.WxService.getStorageSync('token') ? this.goIndex : this.goLogin, 6000)
    },
    goIndex() {
        App.WxService.switchTab('/pages/learning/start/index')
    },
    goLogin() {
        App.WxService.redirectTo('/pages/me/index')
    },
})
