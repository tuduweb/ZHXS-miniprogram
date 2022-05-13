const App = getApp()

Page({
    data: {
        indicatorDots: 1,
        autoplay: 1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: 0,
        isSkipHidden: true
    },
    onLoad() {},
    onShow() {},
    bindload(e) {
    	// setTimeout(App.WxService.getStorageSync('token') ? this.goIndex : this.goLogin, 6000)
    },
    goIndex() {
        App.WxService.switchTab('/pages/learning/start/index')
    },
    goLogin() {
        App.WxService.redirectTo('/pages/me/index')
    },
    swiperChanged(e) {
        console.log(e.detail.current == 2)
        if(e.detail.current == 2) {
            this.setData({
                isSkipHidden: false
            })
        }
        //
    },
    btnSkipClicked(e) {
        if(App.WxService.getStorageSync('token')) {
            this.goIndex()
        }else{
            this.goLogin()
        }
    },
    btnContinueClicked(e) {
        this.goIndex()
    }
})
